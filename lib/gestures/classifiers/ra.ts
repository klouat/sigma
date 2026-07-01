import type { GestureFeatures } from "../types";

export function scoreRa(f: GestureFeatures): number {
  const nonFist = Math.max(0, 1 - f.fullFist * 0.85);

  return (
    (
      f.thumbCurved * 0.38 +
      f.oneFingerShape * 0.24 +
      f.fingerScores.thumb * 0.16 +
      (1 - f.fingerScores.index) * 0.08 +
      (1 - f.fingerScores.middle) * 0.05 +
      (1 - f.fingerScores.ring) * 0.05 +
      (1 - f.fingerScores.pinky) * 0.04
    ) * nonFist
  );
}
