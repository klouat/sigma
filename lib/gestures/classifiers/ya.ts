import type { GestureFeatures } from "../types";

export function scoreYa(f: GestureFeatures): number {
  return (
    f.thumbPinkySpread * 0.5 +
    f.twoFingerShape * 0.22 +
    f.fingerScores.thumb * 0.1 +
    f.fingerScores.pinky * 0.08 +
    (1 - f.fingerScores.index) * 0.04 +
    (1 - f.fingerScores.middle) * 0.03 +
    (1 - f.fingerScores.ring) * 0.03
  );
}
