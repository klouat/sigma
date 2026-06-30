import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

const SIGN_FILES: Record<string, string> = {
  alif: "alif.png",
  ba: "ba.png",
  ta: "Ta.png",
  tha: "Ṭa.png",
  sha: "Ṡa.png",
  sin: "Sin.png",
  syin: "Syin.png",
  dal: "Dal.png",
  dzal: "Dzal.png",
  ra: "Ra.png",
  zai: "Zai.png",
  jim: "Jim.png",
  ha: "Ḥa.png",
  kha: "Kha.png",
  shad: "Ṣad.png",
  dad: "Ḍad.png",
  zha: "Ẓa.png",
  ain: "ʿain.png",
  gain: "Gain.png",
  fa: "Fa.png",
  qaf: "Qaf.png",
  kaf: "Kaf.png",
  lam: "Lam.png",
  mim: "Mim.png",
  nun: "Nun.png",
  waw: "Waw.png",
  haa: "Ha.png",
  ya: "Ya.png",
  "alif-maqsurah": "Alif Maqsurah.png",
  "ta-marbutah": "Ta Marbutah.png",
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
