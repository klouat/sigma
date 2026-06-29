import type { GestureFeatures } from "../types";

export function scoreKaf(f: GestureFeatures): number {
  return (
    f.fourFingerClose * 0.46 +
    f.fourFingerShape * 0.22 +
    f.fingerScores.index * 0.1 +
    f.fingerScores.middle * 0.08 +
    f.fingerScores.ring * 0.06 +
    f.fingerScores.pinky * 0.05 +
    (1 - f.fingerScores.thumb) * 0.03
  );
}
