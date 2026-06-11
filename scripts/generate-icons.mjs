import { chromium } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

// CFF ロゴタイル: ダーク地 + Archivo Black ワードマーク + アクセントベースライン
// + レジストレーション十字（製図モチーフ）。maskable はセーフゾーンへ縮小。
const html = (size, safe) => `<!doctype html><html><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@900&display=block" rel="stylesheet">
<style>
  * { margin: 0; }
  body { width: ${size}px; height: ${size}px; overflow: hidden; }
  .tile {
    position: relative; width: 100%; height: 100%;
    background: #16161a;
    display: flex; align-items: center; justify-content: center;
  }
  .inner {
    position: relative;
    display: flex; flex-direction: column; align-items: center;
    transform: scale(${safe ? 0.74 : 1});
  }
  .word {
    font-family: 'Archivo', sans-serif; font-weight: 900;
    color: #f4f4f2; font-size: ${size * 0.34}px;
    letter-spacing: -0.04em; line-height: 1;
  }
  .base {
    width: ${size * 0.58}px; height: ${Math.max(1, size * 0.05)}px;
    background: #4d82e8; margin-top: ${size * 0.06}px;
  }
  .cross { position: absolute; background: #43434a; }
  .cross.h { width: ${size * 0.07}px; height: ${Math.max(1, size * 0.008)}px; }
  .cross.v { width: ${Math.max(1, size * 0.008)}px; height: ${size * 0.07}px; }
  .tr.h { top: ${size * 0.085}px; right: ${size * 0.055}px; }
  .tr.v { top: ${size * 0.055}px; right: ${size * 0.085}px; }
  .bl.h { bottom: ${size * 0.085}px; left: ${size * 0.055}px; }
  .bl.v { bottom: ${size * 0.055}px; left: ${size * 0.085}px; }
</style></head><body>
<div class="tile">
  <span class="cross h tr"></span><span class="cross v tr"></span>
  <span class="cross h bl"></span><span class="cross v bl"></span>
  <div class="inner"><div class="word">CFF</div><div class="base"></div></div>
</div>
</body></html>`;

/** PNG 群を PNG 埋め込み形式の ICO に束ねる（Vista+ / 全モダンブラウザ対応）。 */
function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = [];
  const datas = [];
  for (const { size, buf } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    entries.push(e);
    datas.push(buf);
  }
  return Buffer.concat([header, ...entries, ...datas]);
}

const browser = await chromium.launch();

async function render(size, safe) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
  });
  await page.setContent(html(size, safe), { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.load("900 100px Archivo");
    await document.fonts.ready;
  });
  const buf = await page.screenshot({ type: "png" });
  await page.close();
  return buf;
}

// Canvas で再エンコードし RGBA の PNG にする（Next は ICO 内に RGBA を要求する）
async function toRgba(buf, size) {
  const page = await browser.newPage();
  const dataUrl = await page.evaluate(
    async ({ b64, size }) => {
      const img = new Image();
      img.src = "data:image/png;base64," + b64;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      canvas.getContext("2d").drawImage(img, 0, 0);
      return canvas.toDataURL("image/png");
    },
    { b64: buf.toString("base64"), size },
  );
  await page.close();
  return Buffer.from(dataUrl.split(",")[1], "base64");
}

mkdirSync("public/icons", { recursive: true });

writeFileSync("public/icons/icon-192.png", await render(192, false));
writeFileSync("public/icons/icon-512.png", await render(512, false));
writeFileSync("public/icons/icon-maskable-192.png", await render(192, true));
writeFileSync("public/icons/icon-maskable-512.png", await render(512, true));
writeFileSync("src/app/apple-icon.png", await render(180, false));
writeFileSync("src/app/icon.png", await render(32, false));
writeFileSync(
  "src/app/favicon.ico",
  buildIco([
    { size: 16, buf: await toRgba(await render(16, false), 16) },
    { size: 32, buf: await toRgba(await render(32, false), 32) },
    { size: 48, buf: await toRgba(await render(48, false), 48) },
  ]),
);

await browser.close();
console.log("done");
