import type { GestureFeatures } from "../types";

export function scoreSha(f: GestureFeatures): number {
  return (
    f.threeFingerClose * 0.42 +
    f.threeFingerShape * 0.22 +
    f.fingerScores.index * 0.12 +
    f.fingerScores.middle * 0.1 +
    f.fingerScores.ring * 0.1 +
    (1 - f.fingerScores.thumb) * 0.04 +
    (1 - f.fingerScores.pinky) * 0.04
  );
}
