"use client";

import {
  Select,
  Button,
  Popover,
  ListBox,
  ListBoxItem,
  SelectValue,
} from "react-aria-components";
import { NavArrowDown } from "iconoir-react";
import { COLOR_FORMATS, type ColorFormat } from "@/core/color/format";
import { useColorFormat, setColorFormat } from "@/lib/colorFormat";
import { useT } from "@/lib/i18n/locale";

/**
 * アプリ内カラーコードの表示形式セレクタ（HEX/RGB/HSL/HSV、既定 HEX）。
 * 値は localStorage に保持され、テーマ・言語と同様に全体へ即時反映される。
 */
export function ColorFormatSelect() {
  const format = useColorFormat();
  const t = useT();

  return (
    <Select
      selectedKey={format}
      onSelectionChange={(key) => setColorFormat(key as ColorFormat)}
      aria-label={t("format.label")}
    >
      <Button className="cff-control text-text-2 hover:text-text inline-flex h-9 items-center gap-1.5 px-3 font-mono text-[12px] tracking-[0.06em]">
        <SelectValue>{format.toUpperCase()}</SelectValue>
        <NavArrowDown width={12} height={12} aria-hidden />
      </Button>
      <Popover className="border-border-strong bg-surface rounded-panel shadow-overlay min-w-[var(--trigger-width)] border p-1">
        <ListBox className="outline-none">
          {COLOR_FORMATS.map((f) => (
            <ListBoxItem
              key={f}
              id={f}
              textValue={f.toUpperCase()}
              className="rounded-control data-[focused]:bg-surface-2 cursor-default px-3 py-1.5 font-mono text-[12px] tracking-[0.06em] outline-none data-[selected]:bg-(--text) data-[selected]:text-(--bg)"
            >
              {f.toUpperCase()}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}
