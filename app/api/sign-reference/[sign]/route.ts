import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

const SIGN_FILES: Record<string, string> = {
  alif: "alif.png",
  ba: "ba.png",
  ta: "Ta.png",
  tsa: "Tsa.png",
  jim: "Jim.png",
  mim: "mim.png",
  shod: "shod.png",
  ra: "ro.png",
  zai: "zai.png",
  dal: "dal.png",
  dzal: "dzal.png",
  sin: "sin.png",
  syin: "syin.png",
  dhod: "Dhod.png",
  taa: "Tho.png",
  zho: "Tho.png",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ sign: string }> }
) {
  const { sign } = await context.params;
  const fileName = SIGN_FILES[sign];

  if (!fileName) {
    return NextResponse.json({ error: "Unknown sign reference." }, { status: 404 });
  }

  const filePath = join(process.cwd(), "huruf", fileName);
  let buffer: Buffer;

  try {
    buffer = await readFile(filePath);
  } catch {
    return NextResponse.json(
      { error: "Sign reference image is missing." },
      { status: 404 }
    );
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
