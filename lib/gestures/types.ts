import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type CharacterKey =
  | "alif" | "ba" | "ta" | "sha" | "dal" | "jim" | "ha" | "kha"
  | "dzal" | "ra" | "zai" | "sin" | "syin" | "shad" | "dad" | "tha"
  | "zha" | "ain" | "gain" | "fa" | "qaf" | "kaf" | "lam" | "mim"
  | "nun" | "waw" | "haa" | "ya" | "alifMaqsurah" | "taMarbutah"
  | "hamzah" | "lamAlif";
export type HarakatKey = "fathah" | "kasrah" | "dammah" | "fathatain" | "kasratain" | "dammatain" | "sukun";
export type FingerName = "thumb" | "index" | "middle" | "ring" | "pinky";
export type FingerScores = Record<FingerName, number>;

export type KnownCharacter = {
  key: CharacterKey;
  label: string;
  arabic: string;
  referenceSrc: string;
};

export type KnownHarakat = {
  key: HarakatKey;
  label: string;
  referenceSrc: string;
  instruction: string;
  direction: string;
};

export type MotionSample = {
  time: number;
  x: number;
  y: number;
};

export type CollectionLabel = CharacterKey | HarakatKey;

export type CollectedSample = {
  id: string;
  label: CollectionLabel;
  kind: "character" | "harakat";
  timestamp: string;
  handedness: string;
  landmarks: Array<{ x: number; y: number; z: number }>;
  motionTrail: MotionSample[];
};

export type Connection = {
  start: number;
  end: number;
};

export type LiveDetection = {
  id: string;
  character: KnownCharacter | null;
  characterAccuracy: number;
  harakat: KnownHarakat | null;
  harakatAccuracy: number;
  combinedArabic: string | null;
  handedness: string;
  fingerScores: FingerScores;
  motionDirection: string;
};

export type GestureFeatures = {
  fingerScores: FingerScores;
  indexRaised: number;
  middleRaised: number;
  ringRaised: number;
  pinkyRaised: number;
  thumbRaised: number;
  thumbIndexGap: number;
  thumbMiddleGap: number;
  thumbPinkyGap: number;
  indexSideways: number;
  indexDiagonal: number;
  thumbCurved: number;
  curvedHand: number;
  extendedCount: number;
  oneFingerShape: number;
  twoFingerShape: number;
  threeFingerShape: number;
  fourFingerShape: number;
  fiveFingerShape: number;
  curledShape: number;
  indexMiddlePair: number;
  threeFingerFan: number;
  threeFingerClose: number;
  fourFingerFan: number;
  thumbUpOnly: number;
  indexUpOnly: number;
  openPalmFlat: number;
  fullFist: number;
  partialCurl: number;
  thumbSideways: number;
  twoFingerSideways: number;
  wristAngle: number;
  indexCurvedUp: number;
  thumbTouchIndex: number;
  fingerCurvature: number;
  fourFingerClose: number;
  thumbIndexLShape: number;
  closedFistBase: number;
  indexPinkyUp: number;
  thumbDown: number;
  looseFist: number;
  sideFist: number;
  thumbPinkySpread: number;
  extensionRatio: number;
  indexMiddleCrossed: number;
};
