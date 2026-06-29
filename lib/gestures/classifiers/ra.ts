import type { GestureFeatures } from "../types";

export function scoreRa(f: GestureFeatures): number {
  return (
    f.thumbCurved * 0.46 +
    f.oneFingerShape * 0.2 +
    f.fingerScores.thumb * 0.14 +
    (1 - f.fingerScores.index) * 0.08 +
    (1 - f.fingerScores.middle) * 0.05 +
    (1 - f.fingerScores.ring) * 0.04 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
