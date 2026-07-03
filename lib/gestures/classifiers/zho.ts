import type { GestureFeatures } from "../types";

export function scoreZho(f: GestureFeatures): number {
  const uprightIndex =
    f.indexRaised *
    f.indexVertical *
    f.fingerScores.index *
    Math.max(0.35, 1 - f.indexSideways * 0.6);
  const sidewaysBar = Math.max(
    f.middleExtendedSideways,
    f.middleSideways * f.fingerScores.middle,
    f.thumbIndexLShape * 0.7
  );
  const raisedThumb = Math.max(
    f.thumbRaised,
    f.fingerScores.thumb * 0.9,
    f.thumbPinkySpread * 0.7
  );
  const foldedLowerFingers =
    (1 - f.fingerScores.ring) * 0.34 +
    (1 - f.fingerScores.pinky) * 0.34 +
    (1 - f.ringRaised) * 0.16 +
    (1 - f.pinkyRaised) * 0.16;
  const notOpenPalm =
    Math.max(0.2, 1 - f.openPalmFlat * 0.8) *
    Math.max(0.2, 1 - f.fourFingerClose * 0.8) *
    Math.max(0.2, 1 - f.fourFingerSpread * 0.8);
  const notTsa = Math.max(0.25, 1 - f.threeFingerClose * 0.75);

  const score =
    uprightIndex * 0.34 +
    sidewaysBar * 0.24 +
    raisedThumb * 0.22 +
    foldedLowerFingers * 0.12 +
    Math.max(f.thumbRaised, f.thumbPinkySpread * 0.75) * 0.08;

  return Math.max(0, Math.min(1, score * sidewaysBar * raisedThumb * notOpenPalm * notTsa * 2.25));
}
