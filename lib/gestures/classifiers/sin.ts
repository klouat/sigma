import type { GestureFeatures } from "../types";

export function scoreSin(f: GestureFeatures): number {
  return (
    f.openPalmFlat * 0.5 +
    f.fiveFingerShape * 0.22 +
    f.fingerScores.index * 0.08 +
    f.fingerScores.middle * 0.08 +
    f.fingerScores.ring * 0.06 +
    f.fingerScores.pinky * 0.06
  );
}
