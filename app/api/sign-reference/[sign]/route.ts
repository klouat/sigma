import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

const SIGN_FILES: Record<string, string> = {
  alif: "alif.png",
  ba: "ba.png",
  ta: "Ta.png",
  sha: "Ṡa.png",
  dal: "Dal.png",
  jim: "Jim.png",
  ha: "Ḥa.png",
  kha: "Kha.png",
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
  const buffer = await readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
