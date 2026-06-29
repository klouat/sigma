import type { GestureFeatures } from "../types";

export function scoreWaw(f: GestureFeatures): number {
  return (
    f.thumbDown * 0.52 +
    f.oneFingerShape * 0.2 +
    f.fingerScores.thumb * 0.1 +
    (1 - f.fingerScores.index) * 0.06 +
    (1 - f.fingerScores.middle) * 0.05 +
    (1 - f.fingerScores.ring) * 0.04 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
