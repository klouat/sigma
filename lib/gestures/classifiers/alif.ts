import type { GestureFeatures } from "../types";

export function scoreAlif(f: GestureFeatures): number {
  return (
    f.thumbUpOnly * 0.48 +
    f.fingerScores.thumb * 0.18 +
    f.oneFingerShape * 0.18 +
    (1 - f.fingerScores.index) * 0.06 +
    (1 - f.fingerScores.middle) * 0.04 +
    (1 - f.fingerScores.ring) * 0.03 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
