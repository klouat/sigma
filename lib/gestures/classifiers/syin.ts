import type { GestureFeatures } from "../types";

export function scoreSyin(f: GestureFeatures): number {
  return (
    f.fiveFingerShape * 0.34 +
    f.openPalmFlat * 0.22 +
    f.fingerScores.thumb * 0.12 +
    f.fingerScores.index * 0.1 +
    f.fingerScores.middle * 0.08 +
    f.fingerScores.ring * 0.07 +
    f.fingerScores.pinky * 0.07
  );
}
