import type { GestureFeatures } from "../types";

export function scoreBa(f: GestureFeatures): number {
  return (
    f.indexUpOnly * 0.48 +
    f.fingerScores.index * 0.18 +
    f.oneFingerShape * 0.18 +
    (1 - f.fingerScores.thumb) * 0.06 +
    (1 - f.fingerScores.middle) * 0.04 +
    (1 - f.fingerScores.ring) * 0.03 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
