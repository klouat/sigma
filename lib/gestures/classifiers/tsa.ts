import type { GestureFeatures } from "../types";

export function scoreTsa(f: GestureFeatures): number {
  const threeUp = Math.min(f.fingerScores.index, f.fingerScores.middle, f.fingerScores.ring);
  const pinkyFolded = Math.max(0, 1 - Math.max(f.fingerScores.pinky, f.pinkyRaised));
  const thumbNotOpen = Math.max(0, 1 - Math.max(f.fingerScores.thumb, f.thumbRaised) * 0.85);
  const exactThree =
    threeUp *
    pinkyFolded *
    Math.max(0.45, thumbNotOpen) *
    Math.max(0.2, 1 - f.fiveFingerShape * 0.9);
  const notOpenPalm =
    Math.max(0.15, 1 - f.openPalmFlat * 0.6) *
    Math.max(0.12, 1 - f.fourFingerClose * 0.9) *
    Math.max(0.12, 1 - f.fourFingerSpread * 0.9);

  const score =
    exactThree * 0.44 +
    f.threeFingerClose * pinkyFolded * 0.24 +
    f.threeFingerShape * pinkyFolded * 0.16 +
    threeUp * 0.08 +
    pinkyFolded * 0.06 +
    thumbNotOpen * 0.02;

  return Math.max(0, Math.min(1, score * notOpenPalm * 1.7));
}
