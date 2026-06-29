import type { GestureFeatures } from "../types";

export function scoreDzal(f: GestureFeatures): number {
  return (
    f.threeFingerClose * 0.42 +
    f.threeFingerShape * 0.22 +
    f.fingerScores.index * 0.14 +
    f.fingerScores.middle * 0.12 +
    f.fingerScores.ring * 0.06 +
    (1 - f.fingerScores.thumb) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
