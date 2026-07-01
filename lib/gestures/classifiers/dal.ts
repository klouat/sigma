import type { GestureFeatures } from "../types";

export function scoreDal(f: GestureFeatures): number {
  return (
    f.twoFingerSideways * 0.42 +
    f.twoFingerShape * 0.22 +
    f.fingerScores.index * 0.12 +
    f.fingerScores.middle * 0.1 +
    (1 - f.fingerScores.thumb) * 0.04 +
    (1 - f.fingerScores.ring) * 0.08 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
