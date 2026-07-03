import type { GestureFeatures } from "../types";

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function scoreDzal(f: GestureFeatures): number {
  const openCGap = clamp01((f.thumbIndexGap - 0.68) / 0.62);
  const indexCShape = Math.max(
    f.indexHorizontal,
    f.indexSideways,
    f.indexDiagonal * 0.7,
    f.indexCurvedUp * Math.max(0, 1 - f.indexVertical * 0.85) * 0.85
  );
  const thumbOpenSide = Math.max(
    f.thumbSideways,
    f.fingerScores.thumb * 0.55,
    f.thumbPinkySpread * 0.45,
    openCGap * 0.55
  );
  const curledOtherFingers =
    (1 - f.fingerScores.middle) * 0.24 +
    (1 - f.fingerScores.ring) * 0.26 +
    (1 - f.fingerScores.pinky) * 0.24 +
    (1 - f.middleRaised) * 0.08 +
    (1 - f.ringRaised) * 0.09 +
    (1 - f.pinkyRaised) * 0.09;
  const thumbIndexC =
    openCGap *
    Math.max(f.thumbIndexLShape, openCGap * 0.8, thumbOpenSide * 0.55) *
    indexCShape *
    thumbOpenSide *
    curledOtherFingers *
    Math.max(0.5, 1 - f.indexVertical * 0.45);
  const noisyThumbIndexC =
    openCGap *
    indexCShape *
    thumbOpenSide *
    Math.max(0.45, curledOtherFingers) *
    Math.max(0.55, 1 - f.indexVertical * 0.35);
  const sidewaysTwoFingers =
    f.indexMiddleSidewaysPair *
    Math.max(f.indexExtendedSideways, f.indexHorizontal, f.indexSideways) *
    Math.max(f.middleExtendedSideways, f.middleHorizontal, f.middleSideways);
  const notCShape = Math.max(0.35, 1 - thumbIndexC * 0.75);
  const notVerticalSign = Math.max(0.4, 1 - Math.max(f.indexVertical, f.middleRaised) * 0.55);
  const notBaIndex = Math.max(0.08, 1 - f.indexVertical * 1.1) * Math.max(0.2, 1 - f.indexUpOnly * 0.85);
  const notFist = Math.max(0.25, 1 - f.fullFist * 0.5);

  const cScore =
    thumbIndexC * 0.66 +
    noisyThumbIndexC * 0.22 +
    openCGap * 0.12 +
    indexCShape * 0.09 +
    thumbOpenSide * 0.08 +
    curledOtherFingers * 0.06;
  const twoFingerScore =
    sidewaysTwoFingers * 0.62 +
    f.indexMiddleSidewaysPair * 0.22 +
    curledOtherFingers * 0.12 +
    Math.min(f.indexExtendedSideways, f.middleExtendedSideways) * 0.14;

  return Math.max(
    0,
    Math.min(
      1,
      Math.max(
        cScore * notBaIndex * 1.9,
        twoFingerScore * notCShape * notVerticalSign * notFist * 2.2
      )
    )
  );
}
