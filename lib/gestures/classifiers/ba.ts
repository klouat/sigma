import type { GestureFeatures } from "../types";

export function scoreBa(f: GestureFeatures): number {
  const thumbTucked = Math.max(0, 1 - f.thumbIndexGap / 0.9);
  const notClosedFist = Math.max(0, 1 - f.closedFistBase * 0.7);
  const onlyIndexRaised =
    f.indexRaised *
    f.indexVertical *
    (1 - f.middleRaised * 0.75) *
    (1 - f.ringRaised * 0.75) *
    (1 - f.pinkyRaised * 0.75);
  const mimPinkyCue = Math.max(
    f.indexPinkyUp,
    f.thumbPinkySpread,
    f.fingerScores.pinky * 0.65,
    f.pinkyRaised * 0.65
  );
  const notMim = Math.max(0, 1 - mimPinkyCue * 0.45);
  const raCue = Math.max(
    f.indexHorizontal * 1.2,
    f.indexSideways,
    f.indexCurvedUp * (1 - f.indexVertical * 0.7),
    f.indexDiagonal * (1 - f.indexVertical * 0.6)
  );
  const notRaSideways = Math.max(0, 1 - raCue * 0.95);
  const taaCue =
    f.indexVertical *
    Math.max(f.middleExtendedSideways, f.middleSideways, f.thumbSideways * 0.8) *
    Math.max(0, 1 - f.ringRaised * 0.75) *
    Math.max(0, 1 - f.pinkyRaised * 0.75);
  const notTaa = Math.max(0.15, 1 - taaCue * 0.9);
  const score =
    (
      onlyIndexRaised * 0.46 +
      f.indexUpOnly * 0.24 +
      f.indexVertical * 0.12 +
      f.fingerScores.index * 0.13 +
      thumbTucked * 0.16 +
      f.oneFingerShape * 0.04 +
      (1 - f.thumbIndexLShape) * 0.02 +
      (1 - f.fingerScores.middle) * 0.03 +
      (1 - f.fingerScores.ring) * 0.03 +
      (1 - f.fingerScores.pinky) * 0.02
    ) * notClosedFist * notMim * notRaSideways * notTaa;

  return Math.min(1, score * 1.15);
}
