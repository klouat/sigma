import type { GestureFeatures } from "../types";

export function scoreTa(f: GestureFeatures): number {
  return (
    f.indexMiddlePair * 0.42 +
    f.twoFingerShape * 0.22 +
    f.fingerScores.index * 0.14 +
    f.fingerScores.middle * 0.14 +
    (1 - f.fingerScores.thumb) * 0.04 +
    (1 - f.fingerScores.ring) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
