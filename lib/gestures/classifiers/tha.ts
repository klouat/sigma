import type { GestureFeatures } from "../types";

export function scoreTha(f: GestureFeatures): number {
  return (
    f.thumbUpOnly * 0.3 +
    f.partialCurl * 0.28 +
    f.oneFingerShape * 0.18 +
    f.fingerScores.thumb * 0.12 +
    (1 - f.fingerScores.index) * 0.05 +
    (1 - f.fingerScores.middle) * 0.04 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
