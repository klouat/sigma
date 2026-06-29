import type { GestureFeatures } from "../types";

export function scoreSyin(f: GestureFeatures): number {
  return (
    f.fourFingerFan * 0.4 +
    f.fourFingerShape * 0.22 +
    f.fingerScores.index * 0.12 +
    f.fingerScores.middle * 0.1 +
    f.fingerScores.ring * 0.08 +
    f.fingerScores.pinky * 0.06 +
    (1 - f.fingerScores.thumb) * 0.02
  );
}
