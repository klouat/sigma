import type { GestureFeatures } from "../types";

export function scoreHaa(f: GestureFeatures): number {
  const allFingersDown =
    (1 - f.indexRaised) *
    (1 - f.middleRaised * 0.85) *
    (1 - f.ringRaised * 0.85) *
    (1 - f.pinkyRaised * 0.85);

  return (
    (
      f.looseFist * 0.42 +
      f.fullFist * 0.2 +
      f.curledShape * 0.16 +
      (1 - f.sideFist) * 0.1 +
      (1 - f.fingerScores.index) * 0.05 +
      (1 - f.fingerScores.middle) * 0.03 +
      (1 - f.fingerScores.ring) * 0.02 +
      (1 - f.fingerScores.pinky) * 0.02
    ) * allFingersDown
  );
}
