import type { GestureFeatures } from "../types";

export function scoreDzal(f: GestureFeatures): number {
  return (
    f.threeFingerClose * 0.24 +
    f.threeFingerShape * 0.16 +
    f.indexSideways * 0.26 +
    f.wristAngle * 0.14 +
    f.fingerScores.index * 0.08 +
    f.fingerScores.middle * 0.06 +
    f.fingerScores.ring * 0.04 +
    (1 - f.fingerScores.thumb) * 0.02 +
    (1 - f.fingerScores.pinky) * 0.00
  );
}
