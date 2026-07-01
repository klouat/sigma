import type { GestureFeatures } from "../types";

export function scoreAlifMaqsurah(f: GestureFeatures): number {
  const noIndex = 1 - Math.max(f.indexRaised, f.fingerScores.index * 0.7);
  const noMiddle = 1 - Math.max(f.middleRaised, f.fingerScores.middle * 0.7);
  const noRing = 1 - Math.max(f.ringRaised, f.fingerScores.ring * 0.7);
  const threeCurled = noIndex * noMiddle * noRing;

  const thumbOut = Math.max(f.thumbRaised, f.thumbSideways);
  const pinkyOut = Math.max(f.pinkyRaised, f.fingerScores.pinky);

  // Only fire when pinky and thumb are genuinely extended
  const pinkyGate = Math.max(0, (pinkyOut - 0.3) * 1.4);
  const thumbGate = Math.max(0, (thumbOut - 0.2) * 1.25);

  const thumbPinkyOnly = pinkyGate * thumbGate * threeCurled;
  const wideGap = Math.min(Math.max((f.thumbPinkyGap - 0.8) * 1.2, 0), 1);

  return (
    thumbPinkyOnly * 0.42 +
    wideGap * 0.2 +
    f.thumbPinkySpread * 0.16 +
    pinkyGate * 0.08 +
    thumbGate * 0.06 +
    threeCurled * 0.05 +
    f.extensionRatio * 0.03
  );
}