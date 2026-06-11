import { chromium } from "@playwright/test";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";

// CFF アイコンタイル: ダーク地 + #FFF マーク（public/logo/color-function_logo.svg）。
// マークは「#」(HEX 記法) と「FF」(Follows Function) を兼ねたブランドシンボル。
// maskable はセーフゾーン（中心 80% 円）に収まるよう縮小する。
const MARK_SVG = readFileSync("public/logo/color-function_logo.svg", "utf8")
  .replace(/fill="black"/g, 'fill="#f4f4f2"')
  .replace('width="300" height="300"', 'width="100%" height="100%"');

const html = (size, safe) => `<!doctype html><html><head>
<style>
  * { margin: 0; }
  body { width: ${size}px; height: ${size}px; overflow: hidden; }
  .tile {
    width: 100%; height: 100%;
    background: #16161a;
    display: flex; align-items: center; justify-content: center;
  }
  .mark {
    width: 100%; height: 100%;
    transform: scale(${safe ? 0.8 : 1});
  }
</style></head><body>
<div class="tile"><div class="mark">${MARK_SVG}</div></div>
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
