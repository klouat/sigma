import type { GestureFeatures } from "../types";

export function scoreDhod(f: GestureFeatures): number {
  const thumbExtendedOut = Math.max(
    f.thumbSideways,
    f.thumbPinkySpread * 0.9,
    Math.max(0, Math.min(1, (f.thumbPinkyGap - 1.05) / 0.75))
  );
  const curledFingers =
    (1 - f.fingerScores.index) * 0.26 +
    (1 - f.fingerScores.middle) * 0.26 +
    (1 - f.fingerScores.ring) * 0.23 +
    (1 - f.fingerScores.pinky) * 0.2 +
    f.fullFist * 0.05;
  const thumbOut =
    thumbExtendedOut * 0.7 +
    f.thumbSideways * 0.16 +
    f.thumbPinkySpread * 0.08 +
    Math.max(0, 1 - f.thumbRaised * 0.65) * 0.06;
  const noRaisedFingers =
    (1 - f.indexRaised * 0.9) *
    (1 - f.middleRaised * 0.9) *
    (1 - f.ringRaised * 0.9) *
    (1 - f.pinkyRaised * 0.9);
  const notOpenPalm = Math.max(0.1, 1 - f.openPalmFlat * 0.9) * Math.max(0.1, 1 - f.fiveFingerShape * 0.85);
  const notMim = Math.max(0.15, 1 - f.pinkyRaised * 0.95);
  const notIndexPose = Math.max(0.12, 1 - Math.max(f.indexVertical, f.indexSideways, f.indexExtendedSideways) * 0.8);
  const notAlif =
    Math.max(0.08, 1 - f.thumbUpOnly * 1.15) *
    Math.max(0.28, 1 - f.thumbRaised * 0.75) *
    Math.max(0.35, thumbExtendedOut);

  const score =
    curledFingers * 0.36 +
    thumbOut * 0.4 +
    f.sideFist * 0.12 +
    f.looseFist * 0.06 +
    noRaisedFingers * 0.06;

  return Math.max(0, Math.min(1, score * noRaisedFingers * notOpenPalm * notMim * notIndexPose * notAlif * 2.45));
}
