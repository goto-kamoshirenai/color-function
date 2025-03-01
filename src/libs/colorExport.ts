type ColorSettings = {
  mainColorA: string;
  mainColorB?: string;
  baseColorA: string;
  baseColorB?: string;
  accentColorA: string;
  accentColorB?: string;
  textColorA: string;
  textColorB?: string;
};

export type ExportFormat =
  | "csv"
  | "tailwind-js"
  | "tailwind-ts"
  | "css"
  | "sass"
  | "json";

const generateTailwindConfig = (
  colors: ColorSettings,
  isTypeScript: boolean = false
): string => {
  const configContent = `${
    isTypeScript ? 'import type { Config } from "tailwindcss";\n\n' : ""
  }${
    isTypeScript ? "const config: Config = {" : "module.exports = {"
  }\n  theme: {
    extend: {
      colors: {
        main: {
          a: "${colors.mainColorA}",
          ${colors.mainColorB ? `b: "${colors.mainColorB}",` : ""}
        },
        base: {
          a: "${colors.baseColorA}",
          ${colors.baseColorB ? `b: "${colors.baseColorB}",` : ""}
        },
        accent: {
          a: "${colors.accentColorA}",
          ${colors.accentColorB ? `b: "${colors.accentColorB}",` : ""}
        },
        text: {
          a: "${colors.textColorA}",
          ${colors.textColorB ? `b: "${colors.textColorB}",` : ""}
        },
      },
    },
  },
};${isTypeScript ? "\n\nexport default config;" : ""}`;

  return configContent;
};

const generateCSSVariables = (colors: ColorSettings): string => {
  return `:root {
  --color-main-a: ${colors.mainColorA};
  ${colors.mainColorB ? `--color-main-b: ${colors.mainColorB};` : ""}
  --color-base-a: ${colors.baseColorA};
  ${colors.baseColorB ? `--color-base-b: ${colors.baseColorB};` : ""}
  --color-accent-a: ${colors.accentColorA};
  ${colors.accentColorB ? `--color-accent-b: ${colors.accentColorB};` : ""}
  --color-text-a: ${colors.textColorA};
  ${colors.textColorB ? `--color-text-b: ${colors.textColorB};` : ""}
}`;
};

const generateSassVariables = (colors: ColorSettings): string => {
  return `$color-main-a: ${colors.mainColorA};
${colors.mainColorB ? `$color-main-b: ${colors.mainColorB};` : ""}
$color-base-a: ${colors.baseColorA};
${colors.baseColorB ? `$color-base-b: ${colors.baseColorB};` : ""}
$color-accent-a: ${colors.accentColorA};
${colors.accentColorB ? `$color-accent-b: ${colors.accentColorB};` : ""}
$color-text-a: ${colors.textColorA};
${colors.textColorB ? `$color-text-b: ${colors.textColorB};` : ""}`;
};

const generateJSON = (colors: ColorSettings): string => {
  return JSON.stringify(colors, null, 2);
};

const generateCSV = (colors: ColorSettings): string => {
  const headers = [
    "mainColorA",
    "mainColorB",
    "baseColorA",
    "baseColorB",
    "accentColorA",
    "accentColorB",
    "textColorA",
    "textColorB",
  ];
  const values = [
    colors.mainColorA,
    colors.mainColorB,
    colors.baseColorA,
    colors.baseColorB,
    colors.accentColorA,
    colors.accentColorB,
    colors.textColorA,
    colors.textColorB,
  ];

  return `${headers.join(",")}\n${values.join(",")}`;
};

export const generatePreviewContent = (
  colors: ColorSettings,
  format: ExportFormat = "csv"
): string => {
  switch (format) {
    case "tailwind-js":
      return generateTailwindConfig(colors, false);
    case "tailwind-ts":
      return generateTailwindConfig(colors, true);
    case "css":
      return generateCSSVariables(colors);
    case "sass":
      return generateSassVariables(colors);
    case "json":
      return generateJSON(colors);
    default:
      return generateCSV(colors);
  }
};

export const exportColorSettings = (
  colors: ColorSettings,
  format: ExportFormat = "csv"
): void => {
  const content = generatePreviewContent(colors, format);
  let filename = "color-settings";

  switch (format) {
    case "tailwind-js":
      filename = "tailwind.config.js";
      break;
    case "tailwind-ts":
      filename = "tailwind.config.ts";
      break;
    case "sass":
      filename = `${filename}.scss`;
      break;
    default:
      filename = `${filename}.${format}`;
  }

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const parseColorSettings = (csvText: string): string[] => {
  const [, valueRow] = csvText.trim().split("\n");
  return valueRow.split(",");
};
