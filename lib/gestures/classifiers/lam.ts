import type { GestureFeatures } from "../types";

export function scoreLam(f: GestureFeatures): number {
  return (
    f.thumbSideways * 0.44 +
    Math.min(f.thumbIndexGap / 1.0, 1) * 0.28 +
    f.fingerScores.index * 0.1 +
    f.fingerScores.thumb * 0.08 +
    f.thumbIndexLShape * 0.04 +
    (1 - f.fingerScores.middle) * 0.03 +
    (1 - f.fingerScores.ring) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.01
  );
}
