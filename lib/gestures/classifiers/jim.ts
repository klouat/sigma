import { scoreAround } from "../features";
import type { GestureFeatures } from "../types";

export function scoreJim(f: GestureFeatures): number {
  return (
    scoreAround(f.thumbIndexGap, 0.26, 0.18) * 0.55 +
    f.curledShape * 0.14 +
    f.curvedHand * 0.16 +
    (1 - f.fingerScores.thumb) * 0.05 +
    scoreAround(f.thumbMiddleGap, 0.52, 0.22) * 0.06 +
    scoreAround(f.thumbPinkyGap, 0.88, 0.32) * 0.04
  );
}
