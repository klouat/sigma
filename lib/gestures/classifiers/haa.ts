import type { GestureFeatures } from "../types";

export function scoreHaa(f: GestureFeatures): number {
  return (
    f.looseFist * 0.48 +
    f.curledShape * 0.22 +
    (1 - f.fingerScores.thumb) * 0.08 +
    (1 - f.fingerScores.index) * 0.08 +
    (1 - f.fingerScores.middle) * 0.06 +
    (1 - f.fingerScores.ring) * 0.04 +
    (1 - f.fingerScores.pinky) * 0.04
  );
}
