import type { GestureFeatures } from "../types";

export function scoreBa(f: GestureFeatures): number {
  const thumbTucked = Math.max(0, 1 - f.thumbIndexGap / 0.9);
  const notClosedFist = Math.max(0, 1 - f.closedFistBase * 0.7);
  const onlyIndexRaised =
    f.indexRaised *
    (1 - f.middleRaised * 0.75) *
    (1 - f.ringRaised * 0.75) *
    (1 - f.pinkyRaised * 0.75);

  return (
    (
      onlyIndexRaised * 0.42 +
      f.indexUpOnly * 0.22 +
      f.fingerScores.index * 0.12 +
      thumbTucked * 0.18 +
      f.oneFingerShape * 0.04 +
      (1 - f.thumbIndexLShape) * 0.02 +
      (1 - f.fingerScores.middle) * 0.03 +
      (1 - f.fingerScores.ring) * 0.03 +
      (1 - f.fingerScores.pinky) * 0.02
    ) * notClosedFist
  );
}
