import type { Metadata } from "next";
import { ArabicSignDetector } from "@/components/arabic-sign-detector";

export const metadata: Metadata = {
  title: "Arabic Sign Detector",
  description:
    "Live webcam detector for Arabic harakat Fathah and Kasrah with skeleton overlay.",
};

export default function ArabicDetectorPage() {
  return <ArabicSignDetector />;
}
