import type { GestureFeatures } from "../types";

export function scoreTaMarbutah(f: GestureFeatures): number {
  return (
    f.indexMiddleCrossed * 0.52 +
    f.twoFingerShape * 0.2 +
    f.fingerScores.index * 0.1 +
    f.fingerScores.middle * 0.08 +
    (1 - f.fingerScores.thumb) * 0.04 +
    (1 - f.fingerScores.ring) * 0.03 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
