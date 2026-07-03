import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: ["public/mediapipe/wasm/**"],
  },
  ...nextCoreWebVitals,
];

export default config;
