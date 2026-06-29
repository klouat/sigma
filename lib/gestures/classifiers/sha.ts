import type { GestureFeatures } from "../types";

export function scoreSha(f: GestureFeatures): number {
  return (
    f.threeFingerFan * 0.38 +
    f.threeFingerShape * 0.2 +
    f.fingerScores.index * 0.14 +
    f.fingerScores.middle * 0.12 +
    f.fingerScores.ring * 0.1 +
    (1 - f.fingerScores.thumb) * 0.03 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
