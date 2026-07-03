import type { GestureFeatures } from "../types";

export function scoreMim(f: GestureFeatures): number {
  const pinkyOnly =
    f.pinkyRaised *
    f.fingerScores.pinky *
    (1 - f.indexRaised * 0.95) *
    (1 - f.middleRaised * 0.85) *
    (1 - f.ringRaised * 0.85);
  const curledOtherFingers =
    (1 - f.fingerScores.index) * 0.36 +
    (1 - f.fingerScores.middle) * 0.28 +
    (1 - f.fingerScores.ring) * 0.22 +
    (1 - f.fingerScores.thumb) * 0.14;
  const notHorns = 1 - f.indexPinkyUp;

  const score =
    pinkyOnly * 0.62 +
    f.pinkyRaised * 0.16 +
    f.fingerScores.pinky * 0.12 +
    curledOtherFingers * 0.1;

  return Math.max(0, Math.min(1, score * notHorns * 1.35));
}
