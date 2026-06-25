import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";

const HARAKAT_FILES: Record<string, string> = {
  fathah: "brave_JQkfKyj1F9.png",
  kasrah: "brave_v3D1fsS6R0.png",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ kind: string }> }
) {
  const { kind } = await context.params;
  const fileName = HARAKAT_FILES[kind];

  if (!fileName) {
    return NextResponse.json({ error: "Unknown harakat reference." }, { status: 404 });
  }

  const filePath = join(process.cwd(), "harakat", fileName);
  const buffer = await readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
