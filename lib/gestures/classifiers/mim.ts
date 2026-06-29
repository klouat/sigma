import type { GestureFeatures } from "../types";

export function scoreMim(f: GestureFeatures): number {
  return (
    f.indexUpOnly * 0.46 +
    f.closedFistBase * 0.22 +
    f.oneFingerShape * 0.16 +
    f.fingerScores.index * 0.08 +
    (1 - f.fingerScores.middle) * 0.03 +
    (1 - f.fingerScores.ring) * 0.03 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
