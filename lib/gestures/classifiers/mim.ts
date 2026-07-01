import type { GestureFeatures } from "../types";

export function scoreMim(f: GestureFeatures): number {
  const noThumb = 1 - Math.max(f.thumbRaised, f.thumbSideways * 0.6);
  const noIndex = 1 - Math.max(f.indexRaised, f.fingerScores.index * 0.75);
  const noMiddle = 1 - Math.max(f.middleRaised, f.fingerScores.middle * 0.75);
  const noRing = 1 - Math.max(f.ringRaised, f.fingerScores.ring * 0.75);
  const noPinky = 1 - Math.max(f.pinkyRaised, f.fingerScores.pinky * 0.75);
  const allCurled = noIndex * noMiddle * noRing * noPinky * noThumb;

  return (
    f.fullFist * 0.34 +
    f.closedFistBase * 0.26 +
    allCurled * 0.18 +
    f.curledShape * 0.08 +
    f.curvedHand * 0.06 +
    f.looseFist * 0.05 +
    f.sideFist * 0.03
  );
}