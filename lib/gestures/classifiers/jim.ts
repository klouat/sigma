import { scoreAround } from "../features";
import type { GestureFeatures } from "../types";

export function scoreJim(f: GestureFeatures): number {
  const noRaisedIndex = 1 - Math.max(f.indexRaised, f.fingerScores.index * 0.75);
  const notSideFist = 1 - f.sideFist * 0.85;
  const notFullFist = 1 - f.fullFist * 0.55;
  const thumbIndexCurve = scoreAround(f.thumbIndexGap, 0.26, 0.18);

  return (
    (
      thumbIndexCurve * 0.56 +
      f.curvedHand * 0.18 +
      f.curledShape * 0.1 +
      (1 - f.fingerScores.thumb) * 0.05 +
      scoreAround(f.thumbMiddleGap, 0.52, 0.22) * 0.06 +
      scoreAround(f.thumbPinkyGap, 0.88, 0.32) * 0.04
    ) *
    Math.max(0, noRaisedIndex) *
    Math.max(0, notSideFist) *
    Math.max(0, notFullFist)
  );
}
