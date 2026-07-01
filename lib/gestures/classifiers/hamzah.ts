import type { GestureFeatures } from "../types";

export function scoreHamzah(f: GestureFeatures): number {
  const hamzahThumbCue = f.thumbTouchIndex;
  const pinkyDown = 1 - Math.max(f.pinkyRaised, f.fingerScores.pinky * 0.85);
  const noThumbPinkySpread = 1 - f.thumbPinkySpread;
  const onlyIndexRaised =
    f.indexRaised *
    (1 - f.middleRaised * 0.75) *
    (1 - f.ringRaised * 0.75) *
    pinkyDown;

  return (
    (
      hamzahThumbCue * 0.48 +
      f.indexCurvedUp * 0.14 +
      onlyIndexRaised * 0.16 +
      f.oneFingerShape * 0.08 +
      f.fingerScores.index * 0.06 +
      (1 - f.fingerScores.middle) * 0.04 +
      (1 - f.fingerScores.ring) * 0.03 +
      (1 - f.fingerScores.pinky) * 0.03
    ) *
    hamzahThumbCue *
    Math.max(0, pinkyDown) *
    Math.max(0, noThumbPinkySpread)
  );
}
