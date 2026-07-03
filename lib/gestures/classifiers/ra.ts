import type { GestureFeatures } from "../types";

export function scoreRa(f: GestureFeatures): number {
  const openCGap = Math.max(0, Math.min(1, (f.thumbIndexGap - 1.05) / 0.45));
  const thumbOpenCue = Math.max(
    f.fingerScores.thumb * 0.55,
    f.thumbRaised * 0.65,
    f.thumbSideways * 1.15,
    f.thumbIndexLShape * 0.75,
    f.thumbPinkySpread,
    openCGap * 0.85
  );
  const thumbFolded = Math.max(0, 1 - thumbOpenCue * 0.9);
  const notOpenThumb = Math.max(0.12, 1 - thumbOpenCue * 1.22);
  const curledBase =
    (1 - f.fingerScores.middle) * 0.32 +
    (1 - f.fingerScores.ring) * 0.28 +
    (1 - f.fingerScores.pinky) * 0.24 +
    thumbFolded * 0.16;
  const indexOnlySideways =
    f.indexHorizontal *
    curledBase *
    (1 - f.middleRaised * 0.8) *
    (1 - f.ringRaised * 0.8) *
    (1 - f.pinkyRaised * 0.8);
  const oneIndexCurledBase =
    f.fingerScores.index *
    curledBase *
    Math.max(f.indexHorizontal, f.indexDiagonal * 0.75, f.indexCurvedUp * 0.75) *
    (1 - f.middleRaised * 0.9) *
    (1 - f.ringRaised * 0.9) *
    (1 - f.pinkyRaised * 0.9);
  const bentIndexRa =
    f.indexCurvedUp *
    curledBase *
    (1 - f.middleRaised * 0.9) *
    (1 - f.ringRaised * 0.9) *
    (1 - f.pinkyRaised * 0.9);
  const oneCurvedIndex =
    Math.max(f.indexCurvedUp, f.indexHorizontal * 0.85) *
    Math.max(f.indexHorizontal, f.indexSideways, f.indexDiagonal * 0.7) *
    (1 - f.middleRaised * 0.85) *
    (1 - f.ringRaised * 0.85) *
    (1 - f.pinkyRaised * 0.85);
  const notBaVertical = Math.max(0.45, 1 - f.indexVertical * 0.65);

  const score =
    oneIndexCurledBase * 0.3 +
    bentIndexRa * 0.24 +
    oneCurvedIndex * 0.2 +
    indexOnlySideways * 0.14 +
    f.indexCurvedUp * 0.08 +
    Math.max(f.indexHorizontal, f.indexSideways, f.indexDiagonal * 0.75) * 0.08 +
    curledBase * 0.06 +
    thumbFolded * 0.08;

  return Math.max(0, Math.min(1, score * notBaVertical * notOpenThumb * 3.05));
}
