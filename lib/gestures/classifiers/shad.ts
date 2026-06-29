import type { GestureFeatures } from "../types";

export function scoreShad(f: GestureFeatures): number {
  return (
    f.fullFist * 0.52 +
    f.curledShape * 0.24 +
    (1 - f.thumbSideways) * 0.1 +
    (1 - f.fingerScores.thumb) * 0.06 +
    (1 - f.fingerScores.index) * 0.04 +
    (1 - f.fingerScores.pinky) * 0.04
  );
}
