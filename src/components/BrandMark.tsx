import type { SVGProps } from "react";

/**
 * #FFF ブランドマーク（public/logo/color-function_logo.svg と同パス）。
 * fill は currentColor なのでテキスト色（テーマ）に追従する。
 */
export const MARK_PATHS = [
  "M124.9 57.4478H144.815L52.315 242.448H32.3999L124.9 57.4478Z",
  "M155.69 57.4478H175.605L83.1048 242.448H63.1897L155.69 57.4478Z",
  "M186.349 57.4478H206.264L113.763 242.448H93.8484L186.349 57.4478Z",
  "M217.007 57.4478H236.923L144.422 242.448H124.507L217.007 57.4478Z",
  "M247.666 57.4478H267.581L175.081 242.448H155.166L247.666 57.4478Z",
  "M87.6905 120.075H243.867L237.447 133.177H81.2705L87.6905 120.075Z",
  "M65.1551 166.457H127.652L121.232 179.559H58.7351L65.1551 166.457Z",
];

export function BrandMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 300 300" fill="currentColor" {...props}>
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
