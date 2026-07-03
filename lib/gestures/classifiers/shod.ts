import type { GestureFeatures } from "../types";

export function scoreShod(f: GestureFeatures): number {
  const compactFist =
    f.fullFist * 0.45 +
    f.closedFistBase * 0.25 +
    f.curledShape * 0.12 +
    (1 - f.fingerScores.index) * 0.05 +
    (1 - f.fingerScores.middle) * 0.05 +
    (1 - f.fingerScores.ring) * 0.04 +
    (1 - f.fingerScores.pinky) * 0.04;
  const openFingerPenalty =
    Math.max(f.indexRaised, f.middleRaised, f.ringRaised, f.pinkyRaised) * 0.55 +
    f.thumbUpOnly * 0.35 +
    f.thumbSideways * 0.45 +
    f.thumbPinkySpread * 0.35 +
    f.indexExtendedSideways * 0.45 +
    f.middleExtendedSideways * 0.45 +
    f.indexMiddleSidewaysPair * 0.75;

  return Math.max(0, compactFist - openFingerPenalty);
}
