import type { GestureFeatures } from "../types";

export function scoreZai(f: GestureFeatures): number {
  return (
    f.indexDiagonal * 0.46 +
    f.oneFingerShape * 0.18 +
    f.fingerScores.index * 0.14 +
    (1 - f.fingerScores.middle) * 0.08 +
    (1 - f.fingerScores.ring) * 0.07 +
    (1 - f.fingerScores.pinky) * 0.07
  );
}
