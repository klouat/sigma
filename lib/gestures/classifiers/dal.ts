import type { GestureFeatures } from "../types";

export function scoreDal(f: GestureFeatures): number {
  const openCGap = Math.max(0, Math.min(1, (f.thumbIndexGap - 1.05) / 0.45));
  const openThumbForC =
    Math.max(f.thumbSideways, f.fingerScores.thumb * 0.65, f.thumbPinkySpread * 0.55) *
    Math.max(openCGap, f.thumbIndexLShape * 0.55);
  const thumbIndexOpenC =
    openThumbForC *
    openCGap *
    f.thumbIndexLShape *
    Math.max(f.indexHorizontal, f.indexSideways, f.indexDiagonal * 0.75) *
    (1 - f.middleRaised * 0.9) *
    (1 - f.ringRaised * 0.9) *
    (1 - f.pinkyRaised * 0.9);
  const curledOtherFingers =
    (1 - f.fingerScores.middle) * 0.34 +
    (1 - f.fingerScores.ring) * 0.28 +
    (1 - f.fingerScores.pinky) * 0.24 +
    (1 - f.fingerScores.thumb) * 0.14;
  const notTwoFinger =
    Math.max(0.35, 1 - f.indexMiddlePair * 0.75) *
    Math.max(0.45, 1 - f.fingerScores.middle * 0.65) *
    Math.max(0.2, 1 - f.indexMiddleSidewaysPair * 0.9);

  const score =
    thumbIndexOpenC * 0.58 +
    openCGap * 0.14 +
    openThumbForC * 0.16 +
    Math.max(f.indexHorizontal, f.indexSideways, f.indexDiagonal * 0.75) * 0.16 +
    curledOtherFingers * 0.06;

  return Math.max(0, Math.min(1, score * notTwoFinger * 1.9));
}
