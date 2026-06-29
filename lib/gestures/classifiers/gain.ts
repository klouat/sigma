import type { GestureFeatures } from "../types";

export function scoreGain(f: GestureFeatures): number {
  return (
    f.twoFingerSideways * 0.4 +
    f.twoFingerShape * 0.2 +
    f.wristAngle * 0.18 +
    f.fingerScores.index * 0.1 +
    f.fingerScores.middle * 0.08 +
    (1 - f.fingerScores.thumb) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.02
  );
}
