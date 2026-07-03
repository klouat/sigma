import type { CSSProperties } from "react";
import type { CharacterKey, HarakatKey, KnownCharacter, KnownHarakat } from "./types";

export const KNOWN_CHARACTERS: KnownCharacter[] = [
  { key: "alif", label: "Alif", arabic: "\u0627", referenceSrc: "/api/sign-reference/alif" },
  { key: "ba", label: "Ba", arabic: "\u0628", referenceSrc: "/api/sign-reference/ba" },
  { key: "ta", label: "Ta", arabic: "\u062A", referenceSrc: "/api/sign-reference/ta" },
  { key: "tsa", label: "Tsa", arabic: "\u062B", referenceSrc: "/api/sign-reference/tsa" },
  { key: "jim", label: "Jim", arabic: "\u062C", referenceSrc: "/api/sign-reference/jim" },
  { key: "mim", label: "Mim", arabic: "\u0645", referenceSrc: "/api/sign-reference/mim" },
  { key: "shod", label: "Shod", arabic: "\u0635", referenceSrc: "/api/sign-reference/shod" },
  { key: "ra", label: "Ra", arabic: "\u0631", referenceSrc: "/api/sign-reference/ra" },
  { key: "zai", label: "Zai", arabic: "\u0632", referenceSrc: "/api/sign-reference/zai" },
  { key: "dal", label: "Dal", arabic: "\u062F", referenceSrc: "/api/sign-reference/dal" },
  { key: "dzal", label: "Dzal", arabic: "\u0630", referenceSrc: "/api/sign-reference/dzal" },
  { key: "sin", label: "Sin", arabic: "\u0633", referenceSrc: "/api/sign-reference/sin" },
  { key: "syin", label: "Syin", arabic: "\u0634", referenceSrc: "/api/sign-reference/syin" },
  { key: "dhod", label: "Dhod", arabic: "\u0636", referenceSrc: "/api/sign-reference/dhod" },
  { key: "taa", label: "Taa", arabic: "\u0637", referenceSrc: "/api/sign-reference/taa" },
  { key: "zho", label: "Zho", arabic: "\u0638", referenceSrc: "/api/sign-reference/zho" },
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
export const CHARACTER_THRESHOLD = 55;
export const CHARACTER_MARGIN_THRESHOLD = 0;
export const HARAKAT_CHARACTER_THRESHOLD = 80;
export const HARAKAT_THRESHOLD = 80;
export const MOVEMENT_DISTANCE_THRESHOLD = 0.08;
export const MOTION_HISTORY_MS = 1200;
export const TRAIL_POINT_LIMIT = 18;

export const CHARACTER_COLORS: Record<CharacterKey | "unknown", string> = {
  alif: "#00ed64",
  ba: "#53b7f2",
  ta: "#9cdbff",
  tsa: "#7cd7c2",
  jim: "#f08f8f",
  mim: "#355070",
  shod: "#d4a373",
  ra: "#ff9f1c",
  zai: "#ffbf69",
  dal: "#f2be5c",
  dzal: "#f7c948",
  sin: "#2ec4b6",
  syin: "#00a896",
  dhod: "#c77dff",
  taa: "#48cae4",
  zho: "#00b4d8",
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
