import type { GestureFeatures } from "../types";

export function scoreAin(f: GestureFeatures): number {
  return (
    f.twoFingerSideways * 0.44 +
    f.twoFingerShape * 0.2 +
    f.fingerScores.index * 0.14 +
    f.fingerScores.middle * 0.12 +
    (1 - f.fingerScores.thumb) * 0.04 +
    (1 - f.fingerScores.ring) * 0.03 +
    (1 - f.fingerScores.pinky) * 0.03
  );
}
