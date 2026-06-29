import type { GestureFeatures } from "../types";

export function scoreQaf(f: GestureFeatures): number {
  return (
    f.indexMiddlePair * 0.38 +
    f.twoFingerShape * 0.2 +
    f.fingerCurvature * 0.2 +
    f.fingerScores.index * 0.1 +
    f.fingerScores.middle * 0.08 +
    (1 - f.fingerScores.thumb) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
