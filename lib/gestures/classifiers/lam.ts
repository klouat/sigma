import type { GestureFeatures } from "../types";

export function scoreLam(f: GestureFeatures): number {
  return (
    f.thumbIndexLShape * 0.5 +
    f.twoFingerShape * 0.2 +
    f.fingerScores.thumb * 0.12 +
    f.fingerScores.index * 0.1 +
    (1 - f.fingerScores.middle) * 0.04 +
    (1 - f.fingerScores.ring) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
