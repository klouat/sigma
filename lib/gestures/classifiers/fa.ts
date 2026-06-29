import type { GestureFeatures } from "../types";

export function scoreFa(f: GestureFeatures): number {
  return (
    f.indexCurvedUp * 0.44 +
    f.thumbTouchIndex * 0.24 +
    f.oneFingerShape * 0.16 +
    f.fingerScores.index * 0.08 +
    (1 - f.fingerScores.middle) * 0.04 +
    (1 - f.fingerScores.ring) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
