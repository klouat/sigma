import type { GestureFeatures } from "../types";

export function scoreShad(f: GestureFeatures): number {
  const allFingersDown =
    (1 - f.indexRaised) *
    (1 - f.middleRaised * 0.85) *
    (1 - f.ringRaised * 0.85) *
    (1 - f.pinkyRaised * 0.85);

  return (
    (
      f.sideFist * 0.48 +
      f.fullFist * 0.28 +
      f.curledShape * 0.1 +
      f.thumbSideways * 0.06 +
      (1 - f.fingerScores.index) * 0.06 +
      (1 - f.fingerScores.middle) * 0.04 +
      (1 - f.fingerScores.ring) * 0.02 +
      (1 - f.fingerScores.pinky) * 0.02
    ) * allFingersDown
  );
}
