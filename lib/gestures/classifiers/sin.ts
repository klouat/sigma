import type { GestureFeatures } from "../types";

export function scoreSin(f: GestureFeatures): number {
  return (
    f.fourFingerClose * 0.34 +
    f.fourFingerShape * 0.24 +
    f.openPalmFlat * 0.18 +
    f.fingerScores.index * 0.08 +
    f.fingerScores.middle * 0.07 +
    f.fingerScores.ring * 0.05 +
    f.fingerScores.pinky * 0.03 +
    (1 - f.fingerScores.thumb) * 0.01
  );
}
