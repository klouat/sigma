import type { GestureFeatures } from "../types";

export function scoreAlifMaqsurah(f: GestureFeatures): number {
  return (
    f.thumbPinkySpread * 0.44 +
    f.extensionRatio * 0.2 +
    f.twoFingerShape * 0.18 +
    f.fingerScores.thumb * 0.06 +
    f.fingerScores.pinky * 0.06 +
    (1 - f.fingerScores.index) * 0.03 +
    (1 - f.fingerScores.middle) * 0.03
  );
}
