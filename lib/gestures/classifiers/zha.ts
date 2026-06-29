import type { GestureFeatures } from "../types";

export function scoreZha(f: GestureFeatures): number {
  return (
    f.thumbSideways * 0.46 +
    f.oneFingerShape * 0.18 +
    f.partialCurl * 0.14 +
    f.fingerScores.thumb * 0.1 +
    (1 - f.fingerScores.index) * 0.05 +
    (1 - f.fingerScores.middle) * 0.04 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
