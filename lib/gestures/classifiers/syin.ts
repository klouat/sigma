import type { GestureFeatures } from "../types";

export function scoreSyin(f: GestureFeatures): number {
  const fourFingerOpen = Math.min(
    f.fingerScores.index,
    f.fingerScores.middle,
    f.fingerScores.ring,
    f.fingerScores.pinky
  );
  const openSpreadPalm =
    fourFingerOpen * 0.28 +
    f.openPalmFlat * 0.22 +
    f.fourFingerSpread * 0.34 +
    f.fiveFingerShape * 0.1 +
    Math.max(f.fourFingerFan, f.fourFingerSpread) * 0.06;
  const thumbIndexCue = Math.max(
    f.thumbTouchIndex * 0.7,
    (1 - Math.min(f.thumbIndexGap / 1.35, 1)) * 0.55,
    f.thumbSideways * 0.35
  );
  const notSinClosed = Math.max(0.2, 1 - f.fourFingerClose * 0.85);
  const notTwoOrThreeFinger =
    Math.max(0.45, 1 - f.indexMiddlePair * 0.6) *
    Math.max(0.45, 1 - f.threeFingerClose * 0.55);
  const notCurled = Math.max(0.25, 1 - f.fullFist * 0.8) * Math.max(0.3, 1 - f.curledShape * 0.7);
  const notSideways = Math.max(0.35, 1 - Math.max(f.indexSideways, f.twoFingerSideways) * 0.6);

  const score =
    openSpreadPalm * 0.62 +
    f.fourFingerSpread * 0.2 +
    thumbIndexCue * 0.1 +
    fourFingerOpen * 0.08;

  return Math.max(0, Math.min(1, score * notSinClosed * notTwoOrThreeFinger * notCurled * notSideways * 1.75));
}
