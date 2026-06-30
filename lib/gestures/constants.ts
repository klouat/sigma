import type { CSSProperties } from "react";
import type { CharacterKey, HarakatKey, KnownCharacter, KnownHarakat } from "./types";

export const KNOWN_CHARACTERS: KnownCharacter[] = [
  { key: "dal", label: "Dal", arabic: "\u062F", referenceSrc: "/api/sign-reference/dal" },
  { key: "dzal", label: "Dzal", arabic: "\u0630", referenceSrc: "/api/sign-reference/dzal" },
  { key: "ra", label: "Ra", arabic: "\u0631", referenceSrc: "/api/sign-reference/ra" },
  { key: "zai", label: "Zai", arabic: "\u0632", referenceSrc: "/api/sign-reference/zai" },
  { key: "sin", label: "Sin", arabic: "\u0633", referenceSrc: "/api/sign-reference/sin" },
  { key: "syin", label: "Syin", arabic: "\u0634", referenceSrc: "/api/sign-reference/syin" },
  { key: "shad", label: "\u1E62ad", arabic: "\u0635", referenceSrc: "/api/sign-reference/shad" },
  { key: "dad", label: "\u1E0Cad", arabic: "\u0636", referenceSrc: "/api/sign-reference/dad" },
  { key: "tha", label: "\u1E6Ca", arabic: "\u0637", referenceSrc: "/api/sign-reference/tha" },
  { key: "zha", label: "\u1E92a", arabic: "\u0638", referenceSrc: "/api/sign-reference/zha" },
  { key: "ain", label: "\u02BFain", arabic: "\u0639", referenceSrc: "/api/sign-reference/ain" },
  { key: "gain", label: "Gain", arabic: "\u063A", referenceSrc: "/api/sign-reference/gain" },
  { key: "fa", label: "Fa", arabic: "\u0641", referenceSrc: "/api/sign-reference/fa" },
  { key: "qaf", label: "Qaf", arabic: "\u0642", referenceSrc: "/api/sign-reference/qaf" },
  { key: "kaf", label: "Kaf", arabic: "\u0643", referenceSrc: "/api/sign-reference/kaf" },
  { key: "lam", label: "Lam", arabic: "\u0644", referenceSrc: "/api/sign-reference/lam" },
  { key: "mim", label: "Mim", arabic: "\u0645", referenceSrc: "/api/sign-reference/mim" },
  { key: "nun", label: "Nun", arabic: "\u0646", referenceSrc: "/api/sign-reference/nun" },
  { key: "waw", label: "Waw", arabic: "\u0648", referenceSrc: "/api/sign-reference/waw" },
  { key: "haa", label: "Ha", arabic: "\u0647", referenceSrc: "/api/sign-reference/haa" },
  { key: "ya", label: "Ya", arabic: "\u064A", referenceSrc: "/api/sign-reference/ya" },
  { key: "alifMaqsurah", label: "Alif Maqsurah", arabic: "\u0649", referenceSrc: "/api/sign-reference/alif-maqsurah" },
  { key: "taMarbutah", label: "Ta Marbutah", arabic: "\u0629", referenceSrc: "/api/sign-reference/ta-marbutah" },
  { key: "kha", label: "Kha", arabic: "\u062E", referenceSrc: "/api/sign-reference/kha" },
  { key: "ha", label: "\u1E24a", arabic: "\u062D", referenceSrc: "/api/sign-reference/ha" },
  { key: "jim", label: "Jim", arabic: "\u062C", referenceSrc: "/api/sign-reference/jim" },
  { key: "sha", label: "\u1E60a", arabic: "\u0634", referenceSrc: "/api/sign-reference/sha" },
  { key: "ta", label: "Ta", arabic: "\u062A", referenceSrc: "/api/sign-reference/ta" },
  { key: "ba", label: "Ba", arabic: "\u0628", referenceSrc: "/api/sign-reference/ba" },
  { key: "alif", label: "Alif", arabic: "\u0627", referenceSrc: "/api/sign-reference/alif" },
];

export const KNOWN_HARAKAT: KnownHarakat[] = [
  {
    key: "fathah",
    label: "Fathah",
    referenceSrc: "/api/harakat-reference/fathah",
    instruction: "Form Alif or Ba, then move the hand horizontally.",
    direction: "Horizontal movement",
  },
  {
    key: "kasrah",
    label: "Kasrah",
    referenceSrc: "/api/harakat-reference/kasrah",
    instruction: "Form Alif or Ba, then move the hand downward.",
    direction: "Downward movement",
  },
  {
    key: "dammah",
    label: "Dammah",
    referenceSrc: "/api/harakat-reference/dammah",
    instruction: "Form Alif or Ba, then move the hand in a curve downward.",
    direction: "Curved downward movement",
  },
  {
    key: "fathatain",
    label: "Fathatain",
    referenceSrc: "/api/harakat-reference/fathatain",
    instruction: "Form character, then move the hand horizontally back and forth.",
    direction: "Double horizontal movement",
  },
  {
    key: "kasratain",
    label: "Kasratain",
    referenceSrc: "/api/harakat-reference/kasratain",
    instruction: "Form V shape (index and middle fingers), then move downward.",
    direction: "Downward movement with V shape",
  },
  {
    key: "dammatain",
    label: "Dammatain",
    referenceSrc: "/api/harakat-reference/dammatain",
    instruction: "Form V shape (index and middle fingers), then move in a curve downward.",
    direction: "Curved downward movement with V shape",
  },
  {
    key: "sukun",
    label: "Sukun",
    referenceSrc: "/api/harakat-reference/sukun",
    instruction: "Form character and hold it completely still.",
    direction: "Hold still without movement",
  },
];

export const HAND_MODEL_PATH = "/models/hand_landmarker.task";
export const HAND_WASM_PATH = "/mediapipe/wasm";
export const UI_REFRESH_MS = 120;
export const CHARACTER_THRESHOLD = 80;
export const CHARACTER_MARGIN_THRESHOLD = 8;
export const HARAKAT_CHARACTER_THRESHOLD = 80;
export const HARAKAT_THRESHOLD = 80;
export const MOVEMENT_DISTANCE_THRESHOLD = 0.08;
export const MOTION_HISTORY_MS = 1200;
export const TRAIL_POINT_LIMIT = 18;

export const CHARACTER_COLORS: Record<CharacterKey | "unknown", string> = {
  alif: "#00ed64",
  ba: "#53b7f2",
  ta: "#9cdbff",
  tha: "#5bc0be",
  sha: "#7cd7c2",
  sin: "#3aafa9",
  syin: "#2b7a78",
  dal: "#f2be5c",
  dzal: "#e0a830",
  ra: "#ff9f1c",
  zai: "#ffbf69",
  jim: "#f08f8f",
  ha: "#c1a6ff",
  kha: "#a9d17e",
  shad: "#d4a373",
  dad: "#b5838d",
  zha: "#e07a5f",
  ain: "#81b29a",
  gain: "#f2cc8f",
  fa: "#e5989b",
  qaf: "#6d597a",
  kaf: "#b56576",
  lam: "#eaac8b",
  mim: "#355070",
  nun: "#6d6875",
  waw: "#b5838d",
  haa: "#ffcdb2",
  ya: "#e5989b",
  alifMaqsurah: "#ffb4a2",
  taMarbutah: "#e76f51",
  unknown: "#d7e1dc",
};

export const HARAKAT_COLORS: Record<HarakatKey | "unknown", string> = {
  fathah: "#00ed64",
  kasrah: "#53b7f2",
  dammah: "#ff9f1c",
  fathatain: "#2ec4b6",
  kasratain: "#011627",
  dammatain: "#e71d36",
  sukun: "#9c89b8",
  unknown: "#d7e1dc",
};

export const MIRROR_STYLE = {
  transform: "scaleX(-1)",
} satisfies CSSProperties;
