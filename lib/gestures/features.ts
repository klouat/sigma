import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { FingerScores, GestureFeatures, KnownCharacter, KnownHarakat, MotionSample } from "./types";
import { HARAKAT_CHARACTER_THRESHOLD, HARAKAT_THRESHOLD, KNOWN_HARAKAT, MOVEMENT_DISTANCE_THRESHOLD } from "./constants";
import { Fathah } from "./classifiers/Fathah";
import { Kasrah } from "./classifiers/Kasrah";
import { Dammah } from "./classifiers/Dammah";
import { Fathatain } from "./classifiers/Fathatain";
import { Kasratain } from "./classifiers/Kasratain";
import { Dammatain } from "./classifiers/Dammatain";
import { Sukun } from "./classifiers/Sukun";

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
  const reachFromWrist = clamp((distance(tip, wrist) - distance(mcp, wrist)) * 2.4, 0, 1);
  const verticalReach = tipAbovePip * 0.55 + tipAboveMcp * 0.45;

  return clamp(verticalReach * 0.45 + reachFromWrist * 0.55, 0, 1);
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
  const reachFromWrist = clamp(
    (distance(thumbTip, wrist) - distance(indexMcp, wrist)) * 2.2 + 0.35,
    0,
    1
  );
  const verticalReach = tipAboveIp * 0.55 + tipAboveMcp * 0.45;

  return clamp(verticalReach * 0.35 + reachFromWrist * 0.65, 0, 1);
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
  const indexRaised = clamp(
    (landmarks[5].y - landmarks[8].y) * 2.6 +
      (landmarks[6].y - landmarks[8].y) * 2.2,
    0,
    1
  );
  const middleRaised = clamp(
    (landmarks[9].y - landmarks[12].y) * 2.6 +
      (landmarks[10].y - landmarks[12].y) * 2.2,
    0,
    1
  );
  const ringRaised = clamp(
    (landmarks[13].y - landmarks[16].y) * 2.6 +
      (landmarks[14].y - landmarks[16].y) * 2.2,
    0,
    1
  );
  const pinkyRaised = clamp(
    (landmarks[17].y - landmarks[20].y) * 2.6 +
      (landmarks[18].y - landmarks[20].y) * 2.2,
    0,
    1
  );
  const thumbRaised = clamp(
    (landmarks[2].y - landmarks[4].y) * 2.4 +
      (landmarks[3].y - landmarks[4].y) * 2.0,
    0,
    1
  );
  const thumbIndexGap = distance(landmarks[4], landmarks[8]) / palmWidth;
  const thumbMiddleGap = distance(landmarks[4], landmarks[12]) / palmWidth;
  const thumbPinkyGap = distance(landmarks[4], landmarks[20]) / palmWidth;
  const indexDx = Math.abs(landmarks[8].x - landmarks[5].x);
  const indexDy = Math.abs(landmarks[8].y - landmarks[5].y);
  const middleDx = Math.abs(landmarks[12].x - landmarks[9].x);
  const middleDy = Math.abs(landmarks[12].y - landmarks[9].y);
  const indexVertical = clamp((indexDy - indexDx * 0.65) * 4.0 + 0.1, 0, 1);
  const indexHorizontal = clamp((indexDx - indexDy * 0.65) * 4.0 + 0.1, 0, 1);
  const indexSideways = clamp(
    (indexDx -
      indexDy) *
      3.2 +
      0.2,
    0,
    1
  );
  const middleHorizontal = clamp((middleDx - middleDy * 0.65) * 4.0 + 0.1, 0, 1);
  const middleSideways = clamp((middleDx - middleDy) * 3.2 + 0.2, 0, 1);
  const indexExtendedSideways = clamp(
    (distance(landmarks[8], landmarks[5]) / palmWidth - 0.55) * 1.9,
    0,
    1
  ) * Math.max(indexHorizontal, indexSideways);
  const middleExtendedSideways = clamp(
    (distance(landmarks[12], landmarks[9]) / palmWidth - 0.5) * 2.0,
    0,
    1
  ) * Math.max(middleHorizontal, middleSideways);
  const indexMiddleSidewaysPair =
    Math.min(indexExtendedSideways, middleExtendedSideways) *
    (1 - fingerScores.ring * 0.65) *
    (1 - fingerScores.pinky * 0.65) *
    Math.max(0.35, 1 - fingerScores.thumb * 0.45);
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
  const fourFingerSpread = clamp(
    Math.min(
      fingerScores.index,
      fingerScores.middle,
      fingerScores.ring,
      fingerScores.pinky
    ) *
      ((distance(landmarks[8], landmarks[12]) +
        distance(landmarks[12], landmarks[16]) +
        distance(landmarks[16], landmarks[20])) /
        palmWidth -
        0.72) *
      1.45,
    0,
    1
  );
  const thumbIndexLShape = clamp(
    fingerScores.thumb * 0.3 +
      fingerScores.index * 0.3 +
      clamp(
        (Math.abs(landmarks[4].x - landmarks[8].x) -
          Math.abs(landmarks[4].y - landmarks[8].y)) *
          2.2 +
          0.15,
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
    (landmarks[4].y - landmarks[0].y) * 4.2 +
      (landmarks[4].y - landmarks[3].y) * 2.8 +
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
  const minHandX = Math.min(...landmarks.map((point) => point.x));
  const maxHandX = Math.max(...landmarks.map((point) => point.x));
  const minHandY = Math.min(...landmarks.map((point) => point.y));
  const maxHandY = Math.max(...landmarks.map((point) => point.y));
  const handAspect = (maxHandX - minHandX) / Math.max(maxHandY - minHandY, 0.001);
  const sideFist = clamp(
    fullFist * 0.55 +
      clamp((handAspect - 0.78) * 1.8, 0, 1) * 0.3 +
      wristAngle * 0.15,
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
    indexRaised,
    middleRaised,
    ringRaised,
    pinkyRaised,
    thumbRaised,
    thumbIndexGap,
    thumbMiddleGap,
    thumbPinkyGap,
    indexVertical,
    indexHorizontal,
    indexSideways,
    indexExtendedSideways,
    middleHorizontal,
    middleSideways,
    middleExtendedSideways,
    indexMiddleSidewaysPair,
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
    fourFingerSpread,
    thumbIndexLShape,
    closedFistBase,
    indexPinkyUp,
    thumbDown,
    looseFist,
    sideFist,
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

  let mark = "";
  switch (harakat.key) {
    case "fathah": mark = "\u064E"; break;
    case "kasrah": mark = "\u0650"; break;
    case "dammah": mark = "\u064F"; break;
    case "fathatain": mark = "\u064B"; break;
    case "kasratain": mark = "\u064D"; break;
    case "dammatain": mark = "\u064C"; break;
    case "sukun": mark = "\u0652"; break;
  }
  return `${character.arabic}${mark}`;
}

export function classifyHarakatMotion(
  samples: MotionSample[],
  character: KnownCharacter | null,
  characterAccuracy: number,
  features: GestureFeatures | null = null
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

  // Calculate total path length for Fathatain back-and-forth detection
  let pathLength = 0;
  for (let i = 1; i < samples.length; i++) {
    pathLength += Math.hypot(samples[i].x - samples[i - 1].x, samples[i].y - samples[i - 1].y);
  }

  const sukunScore = Sukun(totalDistance);
  if (sukunScore >= 0.8 && characterAccuracy >= HARAKAT_CHARACTER_THRESHOLD) {
    return {
      harakat: KNOWN_HARAKAT[6],
      accuracy: Math.round(sukunScore * 1000) / 10,
      direction: "Held still.",
    };
  }

  if (totalDistance < MOVEMENT_DISTANCE_THRESHOLD && pathLength < MOVEMENT_DISTANCE_THRESHOLD * 1.5) {
    return {
      harakat: null,
      accuracy: 0,
      direction: "Move the hand sign to begin harakat detection.",
    };
  }

  const fathahScore = Fathah(horizontalDistance, deltaY);
  const kasrahScore = Kasrah(downwardDistance, horizontalDistance);
  const dammahScore = Dammah(downwardDistance, horizontalDistance);
  const fathatainScore = Fathatain(horizontalDistance, deltaY, pathLength);
  
  const vShapeScore = features?.indexMiddlePair ?? 0;
  const kasratainScore = Kasratain(downwardDistance, horizontalDistance, vShapeScore);
  const dammatainScore = Dammatain(downwardDistance, horizontalDistance, vShapeScore);

  const scores = [
    { harakat: KNOWN_HARAKAT[0], score: fathahScore, name: "fathah", dir: "Horizontal motion" },
    { harakat: KNOWN_HARAKAT[1], score: kasrahScore, name: "kasrah", dir: "Downward motion" },
    { harakat: KNOWN_HARAKAT[2], score: dammahScore, name: "dammah", dir: "Curved motion" },
    { harakat: KNOWN_HARAKAT[3], score: fathatainScore, name: "fathatain", dir: "Double horizontal motion" },
    { harakat: KNOWN_HARAKAT[4], score: kasratainScore, name: "kasratain", dir: "V shape downward motion" },
    { harakat: KNOWN_HARAKAT[5], score: dammatainScore, name: "dammatain", dir: "V shape curved motion" },
  ];

  const bestScore = scores.reduce((prev, curr) => (curr.score > prev.score ? curr : prev));

  if (bestScore.score >= 0.45) {
    const accuracy = Math.round(bestScore.score * 1000) / 10;
    return {
      harakat: accuracy >= HARAKAT_THRESHOLD ? bestScore.harakat : null,
      accuracy,
      direction:
        accuracy >= HARAKAT_THRESHOLD
          ? `${bestScore.dir} detected.`
          : `${bestScore.dir} is visible, but confidence is below 80%.`,
    };
  }

  return {
    harakat: null,
    accuracy: Math.round(bestScore.score * 1000) / 10,
    direction: "Movement detected, but direction is still unclear.",
  };
}
