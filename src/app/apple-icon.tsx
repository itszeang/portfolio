import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// iOS home-screen icon: same "bay" mark as icon.svg, as the PNG Safari requires.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  // ImageResponse only bundles a regular weight; the bold mark needs its own font.
  const bold = await readFile(
    join(process.cwd(), "node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf"),
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#ff85b3",
          fontFamily: "Geist",
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: "-4px",
          paddingBottom: 12,
        }}
      >
        bay
      </div>
    ),
    { ...size, fonts: [{ name: "Geist", data: bold, weight: 700, style: "normal" }] },
  );
}
