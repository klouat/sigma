import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

type DatasetSample = {
  id: string;
  label: string;
  kind: "character" | "harakat";
  timestamp: string;
  handedness: string;
  landmarks: Array<{ x: number; y: number; z: number }>;
  motionTrail: Array<{ time: number; x: number; y: number }>;
};

const DATASET_DIR = join(process.cwd(), "dataset");

export async function POST(request: Request) {
  const sample = (await request.json()) as DatasetSample;

  if (
    !sample ||
    !sample.id ||
    !sample.label ||
    !sample.kind ||
    !sample.timestamp ||
    !sample.handedness ||
    !Array.isArray(sample.landmarks) ||
    !Array.isArray(sample.motionTrail)
  ) {
    return NextResponse.json({ error: "Invalid sample payload." }, { status: 400 });
  }

  await mkdir(DATASET_DIR, { recursive: true });

  const fileName =
    sample.kind === "character" ? `characters-${sample.label}.jsonl` : `harakat-${sample.label}.jsonl`;
  const filePath = join(DATASET_DIR, fileName);

  await appendFile(filePath, `${JSON.stringify(sample)}\n`, "utf8");

  return NextResponse.json({ ok: true, fileName });
}
