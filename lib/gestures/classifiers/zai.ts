import type { GestureFeatures } from "../types";

export function scoreZai(f: GestureFeatures): number {
  const onlyIndexRaised =
    f.indexRaised *
    (1 - f.middleRaised * 0.85) *
    (1 - f.ringRaised * 0.85) *
    (1 - f.pinkyRaised * 0.85);
  const notFist = Math.max(0, 1 - Math.max(f.fullFist, f.sideFist) * 0.85);

  return (
    (
      f.indexDiagonal * 0.34 +
      onlyIndexRaised * 0.28 +
      f.oneFingerShape * 0.14 +
      f.fingerScores.index * 0.1 +
      (1 - f.fingerScores.middle) * 0.06 +
      (1 - f.fingerScores.ring) * 0.04 +
      (1 - f.fingerScores.pinky) * 0.04
    ) * notFist
  );
}
