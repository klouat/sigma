import type { GestureFeatures } from "../types";

export function scoreZai(f: GestureFeatures): number {
  const closedRingPinky =
    (1 - f.ringRaised * 0.85) *
    (1 - f.pinkyRaised * 0.85) *
    (1 - f.fingerScores.ring * 0.45) *
    (1 - f.fingerScores.pinky * 0.45);
  const closeTwoFingerPair =
    f.indexMiddlePair *
    Math.min(f.fingerScores.index, f.fingerScores.middle) *
    closedRingPinky;
  const bentPairCue = Math.max(
    f.twoFingerSideways,
    f.indexMiddleCrossed * 0.85,
    f.indexDiagonal * 0.75,
    f.indexCurvedUp * 0.7
  );
  const twoCurvedSideways =
    bentPairCue *
    closeTwoFingerPair;
  const notTaVertical = Math.max(0.5, 1 - Math.max(0, f.indexVertical - bentPairCue * 0.35) * 0.5);
  const closeTwoFingerPose =
    closeTwoFingerPair * 0.3 +
    bentPairCue * 0.24 +
    f.indexMiddlePair * 0.18 +
    f.twoFingerShape * 0.1 +
    (1 - f.fingerScores.ring) * 0.08 +
    (1 - f.fingerScores.pinky) * 0.08 +
    (1 - f.fingerScores.thumb) * 0.02;

  const score = twoCurvedSideways * 0.48 + closeTwoFingerPose * 0.52;

  return Math.max(0, Math.min(1, score * notTaVertical * 2.15));
}
