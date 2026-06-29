import type { GestureFeatures } from "../types";

export function scoreNun(f: GestureFeatures): number {
  return (
    f.indexPinkyUp * 0.48 +
    f.twoFingerShape * 0.2 +
    f.fingerCurvature * 0.14 +
    f.fingerScores.index * 0.06 +
    f.fingerScores.pinky * 0.06 +
    (1 - f.fingerScores.middle) * 0.03 +
    (1 - f.fingerScores.ring) * 0.03
  );
}
