import type { GestureFeatures } from "../types";

export function scoreSin(f: GestureFeatures): number {
  const fourFingerOpen = Math.min(
    f.fingerScores.index,
    f.fingerScores.middle,
    f.fingerScores.ring,
    f.fingerScores.pinky
  );
  const fourStraightFingers =
    f.fingerScores.index * 0.25 +
    f.fingerScores.middle * 0.25 +
    f.fingerScores.ring * 0.24 +
    f.fingerScores.pinky * 0.18 +
    f.fourFingerClose * 0.08;
  const verticalPalm =
    Math.min(f.indexVertical, f.middleRaised, f.ringRaised, f.pinkyRaised) * 0.45 +
    f.openPalmFlat * 0.35 +
    Math.max(f.fourFingerClose, f.fourFingerFan) * 0.2;
  const thumbTuckedOrSide =
    Math.max(1 - f.fingerScores.thumb, 1 - f.thumbRaised, f.thumbSideways * 0.45);
  const notTwoOrThreeFinger =
    Math.max(0.25, 1 - f.indexMiddlePair * 0.9 + fourFingerOpen * 0.65) *
    Math.max(0.35, 1 - f.threeFingerClose * 0.75 + fourFingerOpen * 0.55);
  const notCurled = Math.max(0.2, 1 - f.fullFist * 0.75) * Math.max(0.25, 1 - f.curledShape * 0.65);
  const notSideways = Math.max(0.25, 1 - Math.max(f.indexSideways, f.twoFingerSideways) * 0.75);
  const closeFingerCue = Math.max(f.fourFingerClose, 1 - f.fourFingerSpread);
  const notSpreadSyin = Math.max(0.35, 1 - f.fourFingerSpread * 0.55);

  const score =
    fourStraightFingers * 0.34 +
    verticalPalm * 0.34 +
    f.openPalmFlat * 0.13 +
    Math.max(f.fourFingerClose, f.fourFingerFan * 0.75) * 0.12 +
    thumbTuckedOrSide * 0.08 +
    fourFingerOpen * 0.08 +
    closeFingerCue * 0.08 +
    f.fiveFingerShape * 0.03;

  return Math.max(0, Math.min(1, score * notTwoOrThreeFinger * notCurled * notSideways * notSpreadSyin * 1.95));
}
