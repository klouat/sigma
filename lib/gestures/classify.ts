import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { GestureFeatures } from "./types";
import { clamp, computeGestureFeatures } from "./features";
import { CHARACTER_MARGIN_THRESHOLD, CHARACTER_THRESHOLD, KNOWN_CHARACTERS } from "./constants";
import { scoreAlif } from "./classifiers/alif";
import { scoreBa } from "./classifiers/ba";
import { scoreTa } from "./classifiers/ta";
import { scoreSha } from "./classifiers/sha";
import { scoreDal } from "./classifiers/dal";
import { scoreJim } from "./classifiers/jim";
import { scoreHa } from "./classifiers/ha";
import { scoreKha } from "./classifiers/kha";
import { scoreDzal } from "./classifiers/dzal";
import { scoreRa } from "./classifiers/ra";
import { scoreZai } from "./classifiers/zai";
import { scoreSin } from "./classifiers/sin";
import { scoreSyin } from "./classifiers/syin";
import { scoreShad } from "./classifiers/shad";
import { scoreDad } from "./classifiers/dad";
import { scoreTha } from "./classifiers/tha";
import { scoreZha } from "./classifiers/zha";
import { scoreAin } from "./classifiers/ain";
import { scoreGain } from "./classifiers/gain";
import { scoreQaf } from "./classifiers/qaf";
import { scoreKaf } from "./classifiers/kaf";
import { scoreLam } from "./classifiers/lam";
import { scoreMim } from "./classifiers/mim";
import { scoreNun } from "./classifiers/nun";
import { scoreWaw } from "./classifiers/waw";
import { scoreHaa } from "./classifiers/haa";
import { scoreAlifMaqsurah } from "./classifiers/alif-maqsurah";
import { scoreTaMarbutah } from "./classifiers/ta-marbutah";
import { scoreHamzah } from "./classifiers/hamzah";
import { scoreLamAlif } from "./classifiers/lam-alif";

const SCORERS: Record<string, (f: GestureFeatures) => number> = {
  alif: scoreAlif,
  ba: scoreBa,
  ta: scoreTa,
  sha: scoreSha,
  dal: scoreDal,
  jim: scoreJim,
  ha: scoreHa,
  kha: scoreKha,
  dzal: scoreDzal,
  ra: scoreRa,
  zai: scoreZai,
  sin: scoreSin,
  syin: scoreSyin,
  shad: scoreShad,
  dad: scoreDad,
  tha: scoreTha,
  zha: scoreZha,
  ain: scoreAin,
  gain: scoreGain,
  qaf: scoreQaf,
  kaf: scoreKaf,
  lam: scoreLam,
  mim: scoreMim,
  nun: scoreNun,
  waw: scoreWaw,
  haa: scoreHaa,
  alifMaqsurah: scoreAlifMaqsurah,
  taMarbutah: scoreTaMarbutah,
  hamzah: scoreHamzah,
  lamAlif: scoreLamAlif,
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
