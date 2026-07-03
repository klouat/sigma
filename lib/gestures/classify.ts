import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { CharacterKey, GestureFeatures } from "./types";
import { clamp, computeGestureFeatures } from "./features";
import { CHARACTER_MARGIN_THRESHOLD, CHARACTER_THRESHOLD, KNOWN_CHARACTERS } from "./constants";
import { scoreAlif } from "./classifiers/alif";
import { scoreBa } from "./classifiers/ba";
import { scoreTa } from "./classifiers/ta";
import { scoreTsa } from "./classifiers/tsa";
import { scoreJim } from "./classifiers/jim";
import { scoreMim } from "./classifiers/mim";
import { scoreShod } from "./classifiers/shod";
import { scoreRa } from "./classifiers/ra";
import { scoreZai } from "./classifiers/zai";
import { scoreDal } from "./classifiers/dal";
import { scoreDzal } from "./classifiers/dzal";
import { scoreSin } from "./classifiers/sin";
import { scoreSyin } from "./classifiers/syin";
import { scoreDhod } from "./classifiers/dhod";
import { scoreTaa } from "./classifiers/taa";
import { scoreZho } from "./classifiers/zho";

const SCORERS: Record<CharacterKey, (f: GestureFeatures) => number> = {
  alif: scoreAlif,
  ba: scoreBa,
  ta: scoreTa,
  tsa: scoreTsa,
  jim: scoreJim,
  mim: scoreMim,
  shod: scoreShod,
  ra: scoreRa,
  zai: scoreZai,
  dal: scoreDal,
  dzal: scoreDzal,
  sin: scoreSin,
  syin: scoreSyin,
  dhod: scoreDhod,
  taa: scoreTaa,
  zho: scoreZho,
};

export function classifyCharacter(landmarks: NormalizedLandmark[]) {
  const features = computeGestureFeatures(landmarks);

  const scores = KNOWN_CHARACTERS.map((character) => {
    const scorer = SCORERS[character.key];
    const rawScore = scorer(features);
    return {
      character,
      accuracy: Math.round(clamp(rawScore, 0, 1) * 1000) / 10,
    };
  }).sort((left, right) => right.accuracy - left.accuracy);

  return {
    character:
      scores[0].accuracy >= CHARACTER_THRESHOLD &&
      scores[0].accuracy - (scores[1]?.accuracy ?? 0) >= CHARACTER_MARGIN_THRESHOLD
        ? scores[0].character
        : null,
    accuracy: scores[0].accuracy,
    fingerScores: features.fingerScores,
    features,
  };
}
