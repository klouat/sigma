import { scoreAround } from "../features";
import type { GestureFeatures } from "../types";

export function scoreHa(f: GestureFeatures): number {
  return (
    scoreAround(f.thumbIndexGap, 0.55, 0.24) * 0.44 +
    f.curledShape * 0.12 +
    f.curvedHand * 0.18 +
    scoreAround(f.thumbMiddleGap, 0.72, 0.28) * 0.16 +
    scoreAround(f.thumbPinkyGap, 1.02, 0.34) * 0.06 +
    (1 - f.fingerScores.thumb) * 0.04
  );
}
