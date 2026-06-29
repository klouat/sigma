import type { GestureFeatures } from "../types";

export function scoreDad(f: GestureFeatures): number {
  return (
    f.fullFist * 0.24 +
    f.curledShape * 0.22 +
    f.thumbSideways * 0.48 +
    (1 - f.fingerScores.index) * 0.02 +
    (1 - f.fingerScores.middle) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
