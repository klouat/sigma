import type { GestureFeatures } from "../types";

export function scoreTaa(f: GestureFeatures): number {
  const uprightIndex =
    f.indexRaised *
    f.indexVertical *
    f.fingerScores.index *
    Math.max(0.35, 1 - f.indexSideways * 0.6);
  const sidewaysBar = Math.max(
    f.middleExtendedSideways,
    f.middleSideways * f.fingerScores.middle,
    f.thumbSideways * 0.75,
    f.thumbIndexLShape * 0.65
  );
  const foldedLowerFingers =
    (1 - f.fingerScores.ring) * 0.34 +
    (1 - f.fingerScores.pinky) * 0.34 +
    (1 - f.ringRaised) * 0.16 +
    (1 - f.pinkyRaised) * 0.16;
  const notPlainBa = Math.max(0.2, sidewaysBar);
  const notOpenPalm =
    Math.max(0.2, 1 - f.openPalmFlat * 0.8) *
    Math.max(0.2, 1 - f.fourFingerClose * 0.8) *
    Math.max(0.2, 1 - f.fourFingerSpread * 0.8);
  const notTsa = Math.max(0.25, 1 - f.threeFingerClose * 0.75);
  const zhoThumbCue = Math.max(f.thumbRaised, f.fingerScores.thumb * 0.9, f.thumbPinkySpread * 0.7);
  const notZho = Math.max(0.22, 1 - zhoThumbCue * f.middleExtendedSideways * 0.85);

  const score =
    uprightIndex * 0.38 +
    sidewaysBar * 0.28 +
    foldedLowerFingers * 0.16 +
    f.indexVertical * 0.08 +
    Math.max(f.thumbSideways, f.thumbIndexLShape) * 0.1;

  return Math.max(0, Math.min(1, score * notPlainBa * notOpenPalm * notTsa * notZho * 1.7));
}
