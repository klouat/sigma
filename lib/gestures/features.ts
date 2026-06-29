import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { FingerScores, GestureFeatures, KnownCharacter, KnownHarakat, MotionSample } from "./types";
import { HARAKAT_CHARACTER_THRESHOLD, HARAKAT_THRESHOLD, KNOWN_HARAKAT, MOVEMENT_DISTANCE_THRESHOLD } from "./constants";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function averagePoint(points: NormalizedLandmark[]) {
  return points.reduce(
    (acc, point) => ({
      x: acc.x + point.x / points.length,
      y: acc.y + point.y / points.length,
    }),
    { x: 0, y: 0 }
  );
}

export function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function scoreVerticalFinger(
  tip: NormalizedLandmark,
  pip: NormalizedLandmark,
  mcp: NormalizedLandmark,
  wrist: NormalizedLandmark
) {
  const tipAbovePip = clamp((pip.y - tip.y) * 4.5, 0, 1);
  const tipAboveMcp = clamp((mcp.y - tip.y) * 3.2, 0, 1);
  const reach = clamp((distance(tip, wrist) - distance(mcp, wrist)) * 2.4, 0, 1);

  return clamp(tipAbovePip * 0.45 + tipAboveMcp * 0.3 + reach * 0.25, 0, 1);
}

export function scoreThumb(
  thumbTip: NormalizedLandmark,
  thumbIp: NormalizedLandmark,
  thumbMcp: NormalizedLandmark,
  indexMcp: NormalizedLandmark,
  wrist: NormalizedLandmark
) {
  const tipAboveIp = clamp((thumbIp.y - thumbTip.y) * 4.4, 0, 1);
  const tipAboveMcp = clamp((thumbMcp.y - thumbTip.y) * 3.1, 0, 1);
  const reach = clamp(
    (distance(thumbTip, wrist) - distance(indexMcp, wrist)) * 2.2 + 0.35,
    0,
    1
  );

  return clamp(tipAboveIp * 0.45 + tipAboveMcp * 0.35 + reach * 0.2, 0, 1);
}

export function getFingerScores(landmarks: NormalizedLandmark[]): FingerScores {
  const wrist = landmarks[0];
  const palmCenter = averagePoint([
    landmarks[0],
    landmarks[5],
    landmarks[9],
    landmarks[13],
    landmarks[17],
  ]);

  return {
    thumb: scoreThumb(landmarks[4], landmarks[3], landmarks[2], landmarks[5], wrist),
    index: scoreVerticalFinger(landmarks[8], landmarks[6], landmarks[5], wrist),
    middle: scoreVerticalFinger(landmarks[12], landmarks[10], landmarks[9], wrist),
    ring: scoreVerticalFinger(landmarks[16], landmarks[14], landmarks[13], wrist),
    pinky: clamp(
      scoreVerticalFinger(landmarks[20], landmarks[18], landmarks[17], wrist) * 0.8 +
        clamp(
          (distance(landmarks[20], palmCenter) - distance(landmarks[17], palmCenter)) *
            2.4,
          0,
          1
        ) *
          0.2,
      0,
      1
    ),
  };
}

export function scoreAround(value: number, center: number, tolerance: number) {
  return clamp(1 - Math.abs(value - center) / tolerance, 0, 1);
}

export function computeGestureFeatures(landmarks: NormalizedLandmark[]): GestureFeatures {
  const fingerScores = getFingerScores(landmarks);
  const palmWidth = Math.max(distance(landmarks[5], landmarks[17]), 0.001);
  const thumbIndexGap = distance(landmarks[4], landmarks[8]) / palmWidth;
  const thumbMiddleGap = distance(landmarks[4], landmarks[12]) / palmWidth;
  const thumbPinkyGap = distance(landmarks[4], landmarks[20]) / palmWidth;
  const indexSideways = clamp(
    (Math.abs(landmarks[8].x - landmarks[5].x) -
      Math.abs(landmarks[8].y - landmarks[5].y)) *
      3.2 +
      0.2,
    0,
    1
  );
  const indexDiagonal = clamp(
    1 -
      Math.abs(
        Math.abs(landmarks[8].x - landmarks[5].x) -
          Math.abs(landmarks[8].y - landmarks[5].y)
      ) *
        2.8 -
      0.15,
    0,
    1
  );
  const thumbCurved = clamp(
    (1 - scoreVerticalFinger(landmarks[4], landmarks[3], landmarks[2], landmarks[0])) *
      clamp(
        (distance(landmarks[4], landmarks[5]) / palmWidth) * 2.8,
        0,
        0.55
      ) *
      2.4,
    0,
    1
  );
  const curvedHand =
    (1 - fingerScores.index + 1 - fingerScores.middle + 1 - fingerScores.ring) / 3;
  const extendedCount =
    fingerScores.thumb +
    fingerScores.index +
    fingerScores.middle +
    fingerScores.ring +
    fingerScores.pinky;
  const oneFingerShape = scoreAround(extendedCount, 1, 0.7);
  const twoFingerShape = scoreAround(extendedCount, 2, 0.7);
  const threeFingerShape = scoreAround(extendedCount, 3, 0.8);
  const curledShape = scoreAround(extendedCount, 0.4, 0.6);
  const indexMiddlePair = clamp(
    Math.min(fingerScores.index, fingerScores.middle) -
      Math.max(fingerScores.ring, fingerScores.pinky) * 0.55,
    0,
    1
  );
  const threeFingerFan = clamp(
    Math.min(fingerScores.index, fingerScores.middle, fingerScores.ring) -
      fingerScores.pinky * 0.45,
    0,
    1
  );
  const thumbUpOnly = clamp(
    fingerScores.thumb -
      (fingerScores.index + fingerScores.middle + fingerScores.ring + fingerScores.pinky) /
        4,
    0,
    1
  );
  const indexUpOnly = clamp(
    fingerScores.index -
      (fingerScores.thumb + fingerScores.middle + fingerScores.ring + fingerScores.pinky) /
        4,
    0,
    1
  );
  const threeFingerClose = clamp(
    Math.min(fingerScores.index, fingerScores.middle, fingerScores.ring) -
      Math.max(fingerScores.thumb, fingerScores.pinky) * 0.5 -
      clamp(
        (fingerScores.index - fingerScores.middle) * 2.6 +
          (fingerScores.index - fingerScores.ring) * 2.6,
        0,
        0.4
      ),
    0,
    1
  );
  const fourFingerShape = scoreAround(extendedCount, 4, 0.8);
  const fiveFingerShape = scoreAround(extendedCount, 5, 0.6);
  const fourFingerFan = clamp(
    Math.min(fingerScores.index, fingerScores.middle, fingerScores.ring, fingerScores.pinky) -
      fingerScores.thumb * 0.4 -
      clamp(
        Math.abs(
          (landmarks[8].x - landmarks[12].x) +
            (landmarks[12].x - landmarks[16].x) +
            (landmarks[16].x - landmarks[20].x)
        ) *
          0.9,
        0,
        0.35
      ),
    0,
    1
  );
  const openPalmFlat = clamp(
    fingerScores.index * 0.3 +
      fingerScores.middle * 0.28 +
      fingerScores.ring * 0.22 +
      fingerScores.pinky * 0.2 -
      clamp(
        (Math.abs(landmarks[8].x - landmarks[12].x) -
          Math.abs(landmarks[8].y - landmarks[12].y)) *
          1.8,
        0,
        0.3
      ),
    0,
    1
  );
  const fullFist = clamp(
    (1 - fingerScores.thumb) * 0.2 +
      (1 - fingerScores.index) * 0.22 +
      (1 - fingerScores.middle) * 0.22 +
      (1 - fingerScores.ring) * 0.2 +
      (1 - fingerScores.pinky) * 0.16,
    0,
    1
  );
  const partialCurl = clamp(
    scoreAround(
      fingerScores.index + fingerScores.middle + fingerScores.ring + fingerScores.pinky,
      2.2,
      1.4
    ) *
      0.7 +
      (1 - Math.abs(fingerScores.thumb - 0.6)) * 0.3,
    0,
    1
  );
  const thumbSideways = clamp(
    (Math.abs(landmarks[4].x - landmarks[3].x) -
      Math.abs(landmarks[4].y - landmarks[3].y)) *
      3.6 +
      0.15,
    0,
    1
  );

  const twoFingerSideways = clamp(
    Math.min(fingerScores.index, fingerScores.middle) -
      Math.max(fingerScores.thumb, fingerScores.ring, fingerScores.pinky) * 0.5 -
      clamp(
        Math.abs(landmarks[8].y - landmarks[5].y) * 1.6 +
          Math.abs(landmarks[12].y - landmarks[9].y) * 1.6 -
          0.4,
        0,
        0.5
      ),
    0,
    1
  );
  const wristAngle = clamp(
    Math.abs(
      Math.atan2(
        landmarks[0].y - landmarks[9].y,
        landmarks[0].x - landmarks[9].x
      ) -
        Math.atan2(
          landmarks[5].y - landmarks[0].y,
          landmarks[5].x - landmarks[0].x
        )
    ) *
      1.2 -
      0.2,
    0,
    1
  );
  const indexCurvedUp = clamp(
    fingerScores.index * 0.6 +
      (1 -
        Math.min(
          distance(landmarks[8], landmarks[6]) / distance(landmarks[6], landmarks[5]),
          1
        )) *
        0.3 +
      (1 - Math.abs(fingerScores.index - 0.65)) * 0.1,
    0,
    1
  );
  const thumbTouchIndex = clamp(
    (1 - distance(landmarks[4], landmarks[8]) / palmWidth) * 2.2 -
      clamp(fingerScores.thumb * 1.2, 0, 0.35),
    0,
    1
  );
  const fingerCurvature = clamp(
    (1 -
      (fingerScores.index * 0.7 + fingerScores.middle * 0.7) /
        Math.max(fingerScores.index + fingerScores.middle, 0.01)) *
      1.6 +
      (1 - fingerScores.index) * 0.2 +
      (1 - fingerScores.middle) * 0.2,
    0,
    1
  );
  const fourFingerClose = clamp(
    Math.min(
      fingerScores.index,
      fingerScores.middle,
      fingerScores.ring,
      fingerScores.pinky
    ) -
      fingerScores.thumb * 0.45 -
      clamp(
        (Math.abs(landmarks[8].x - landmarks[12].x) +
          Math.abs(landmarks[12].x - landmarks[16].x) +
          Math.abs(landmarks[16].x - landmarks[20].x)) *
          1.5,
        0,
        0.4
      ),
    0,
    1
  );
  const thumbIndexLShape = clamp(
    fingerScores.thumb * 0.3 +
      fingerScores.index * 0.3 +
      clamp(
        (Math.abs(landmarks[4].y - landmarks[8].y) -
          Math.abs(landmarks[4].x - landmarks[8].x)) *
          2.2 +
          0.35,
        0,
        0.6
      ) *
        0.4,
    0,
    1
  );
  const closedFistBase = clamp(
    fullFist -
      clamp(
        (distance(landmarks[5], landmarks[17]) / palmWidth) * 0.3,
        0,
        0.25
      ) +
      (1 - fingerScores.index) * 0.2,
    0,
    1
  );
  const indexPinkyUp = clamp(
    Math.min(fingerScores.index, fingerScores.pinky) -
      Math.max(fingerScores.thumb, fingerScores.middle, fingerScores.ring) * 0.5 -
      clamp(
        Math.min(
          Math.abs(fingerScores.index - fingerScores.pinky),
          1
        ) *
          0.3,
        0,
        0.2
      ),
    0,
    1
  );
  const thumbDown = clamp(
    (landmarks[0].y - landmarks[4].y) * 4.2 +
      (landmarks[3].y - landmarks[4].y) * 2.8 +
      (1 - fingerScores.thumb) * 0.1,
    0,
    1
  );
  const looseFist = clamp(
    fullFist * 0.55 +
      scoreAround(
        fingerScores.thumb + fingerScores.index + fingerScores.middle + fingerScores.ring + fingerScores.pinky,
        1.5,
        1.0
      ) *
        0.3 +
      (1 - Math.abs(fullFist - 0.55)) * 0.15,
    0,
    1
  );
  const thumbPinkySpread = clamp(
    Math.min(fingerScores.thumb, fingerScores.pinky) -
      Math.max(fingerScores.index, fingerScores.middle, fingerScores.ring) * 0.5 +
      (distance(landmarks[4], landmarks[20]) / palmWidth) * 0.35 -
      0.1,
    0,
    1
  );
  const extensionRatio = clamp(
    (fingerScores.thumb + fingerScores.pinky) /
      Math.max(
        fingerScores.index + fingerScores.middle + fingerScores.ring + 0.01,
        0.01
      ) *
      0.8,
    0,
    1
  );
  const indexMiddleCrossed = clamp(
    (1 - Math.abs(landmarks[8].x - landmarks[12].x) / Math.max(palmWidth * 0.15, 0.01)) *
      0.6 +
      Math.min(fingerScores.index, fingerScores.middle) * 0.2 +
      (1 -
        Math.max(fingerScores.thumb, fingerScores.ring, fingerScores.pinky)) *
        0.2,
    0,
    1
  );

  return {
    fingerScores,
    thumbIndexGap,
    thumbMiddleGap,
    thumbPinkyGap,
    indexSideways,
    indexDiagonal,
    thumbCurved,
    curvedHand,
    extendedCount,
    oneFingerShape,
    twoFingerShape,
    threeFingerShape,
    fourFingerShape,
    fiveFingerShape,
    curledShape,
    indexMiddlePair,
    threeFingerFan,
    threeFingerClose,
    fourFingerFan,
    thumbUpOnly,
    indexUpOnly,
    openPalmFlat,
    fullFist,
    partialCurl,
    thumbSideways,
    twoFingerSideways,
    wristAngle,
    indexCurvedUp,
    thumbTouchIndex,
    fingerCurvature,
    fourFingerClose,
    thumbIndexLShape,
    closedFistBase,
    indexPinkyUp,
    thumbDown,
    looseFist,
    thumbPinkySpread,
    extensionRatio,
    indexMiddleCrossed,
  };
}

export function getTrackingCenter(landmarks: NormalizedLandmark[]) {
  return averagePoint([
    landmarks[0],
    landmarks[5],
    landmarks[9],
    landmarks[13],
    landmarks[17],
  ]);
}

export function getHandBounds(landmarks: NormalizedLandmark[], width: number, height: number) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (const landmark of landmarks) {
    const x = landmark.x * width;
    const y = landmark.y * height;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const padding = 18;

  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}

export function getCombinedArabic(character: KnownCharacter | null, harakat: KnownHarakat | null) {
  if (!character) {
    return null;
  }

  if (!harakat) {
    return character.arabic;
  }

  const mark = harakat.key === "fathah" ? "\u064E" : "\u0650";
  return `${character.arabic}${mark}`;
}

export function classifyHarakatMotion(
  samples: MotionSample[],
  character: KnownCharacter | null,
  characterAccuracy: number
) {
  if (
    !character ||
    characterAccuracy < HARAKAT_CHARACTER_THRESHOLD ||
    samples.length < 4
  ) {
    return {
      harakat: null,
      accuracy: 0,
      direction: "Hold a clear character sign first.",
    };
  }

  const first = samples[0];
  const last = samples[samples.length - 1];
  const deltaX = last.x - first.x;
  const deltaY = last.y - first.y;
  const horizontalDistance = Math.abs(deltaX);
  const downwardDistance = Math.max(0, deltaY);
  const totalDistance = Math.hypot(deltaX, deltaY);

  if (totalDistance < MOVEMENT_DISTANCE_THRESHOLD) {
    return {
      harakat: null,
      accuracy: 0,
      direction: "Move the hand sign to begin harakat detection.",
    };
  }

  const fathahScore = clamp(
    horizontalDistance * 5.4 -
      Math.abs(deltaY) * 1.7 +
      (horizontalDistance > Math.abs(deltaY) ? 0.22 : 0),
    0,
    1
  );
  const kasrahScore = clamp(
    downwardDistance * 6.5 -
      horizontalDistance * 1.9 +
      (downwardDistance > horizontalDistance ? 0.22 : 0),
    0,
    1
  );

  if (fathahScore >= kasrahScore && fathahScore >= 0.45) {
    const accuracy = Math.round(fathahScore * 1000) / 10;
    return {
      harakat: accuracy >= HARAKAT_THRESHOLD ? KNOWN_HARAKAT[0] : null,
      accuracy,
      direction:
        accuracy >= HARAKAT_THRESHOLD
          ? "Horizontal motion detected."
          : "Horizontal motion is visible, but confidence is below 80%.",
    };
  }

  if (kasrahScore > fathahScore && kasrahScore >= 0.45) {
    const accuracy = Math.round(kasrahScore * 1000) / 10;
    return {
      harakat: accuracy >= HARAKAT_THRESHOLD ? KNOWN_HARAKAT[1] : null,
      accuracy,
      direction:
        accuracy >= HARAKAT_THRESHOLD
          ? "Downward motion detected."
          : "Downward motion is visible, but confidence is below 80%.",
    };
  }

  return {
    harakat: null,
    accuracy: Math.round(Math.max(fathahScore, kasrahScore) * 1000) / 10,
    direction: "Movement detected, but direction is still unclear.",
  };
}
