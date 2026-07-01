import { clamp, scoreAround } from "../features";
import type { GestureFeatures } from "../types";

export function scoreKha(f: GestureFeatures): number {
  const noRaisedIndex = 1 - Math.max(f.indexRaised, f.fingerScores.index * 0.75);

  return (
    (
      scoreAround(f.thumbIndexGap, 0.78, 0.28) * 0.34 +
      f.curledShape * 0.1 +
      f.curvedHand * 0.16 +
      scoreAround(f.thumbMiddleGap, 0.95, 0.3) * 0.18 +
      scoreAround(f.thumbPinkyGap, 1.18, 0.34) * 0.12 +
      clamp(1 - Math.abs(f.fingerScores.thumb - 0.45) / 0.45, 0, 1) * 0.1
    ) * Math.max(0, noRaisedIndex)
  );
}
