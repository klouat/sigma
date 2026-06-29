import type { GestureFeatures } from "../types";

export function scoreDal(f: GestureFeatures): number {
  return (
    f.indexSideways * 0.46 +
    f.fingerScores.index * 0.12 +
    f.oneFingerShape * 0.16 +
    (1 - f.fingerScores.middle) * 0.1 +
    (1 - f.fingerScores.ring) * 0.08 +
    (1 - f.fingerScores.pinky) * 0.08
  );
}
