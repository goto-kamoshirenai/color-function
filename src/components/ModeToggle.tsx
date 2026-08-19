"use client";

import { useId } from "react";
import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import { useColorStore, type Unit, type View } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";

/** v2 セグメント: 枠付き・アクティブ=反転＋上辺2pxアクセントティック。 */
const segClass =
  "border-border-strong border-r border-t-2 border-t-transparent bg-transparent px-3.5 py-1.5 " +
  "text-control font-medium text-text-2 last:border-r-0 " +
  "data-[selected]:border-t-accent data-[selected]:bg-(--text) data-[selected]:font-semibold data-[selected]:text-(--bg) " +
  "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40";

type SegOption<T extends string> = {
  key: T;
  label: string;
  disabled?: boolean;
  reason?: string;
};

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: SegOption<T>[];
  onChange: (v: T) => void;
}) {
  const reasonId = useId();
  const withReason = options.filter((o) => o.disabled && o.reason);

  return (
    <div className="flex items-center gap-[9px]">
      {/* ラベルは小画面では非表示（グループの aria-label は維持） */}
      <span className="text-text-3 text-meta hidden font-mono tracking-[0.16em] uppercase sm:inline">
        {label}
      </span>
      <ToggleButtonGroup
        selectionMode="single"
        disallowEmptySelection
        aria-label={label}
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          // react-aria の Key（string|number）を、渡した選択肢の key 集合で絞る
          const next = options.find((o) => o.key === [...keys][0]);
          if (next) onChange(next.key);
        }}
        className="border-border-strong rounded-control inline-flex overflow-hidden border"
      >
        {options.map((o) => (
          <ToggleButton
            key={o.key}
            id={o.key}
            // 色数不足の単位は真に無効化する（フォーカス・選択自体を通さない）。
            // 無効な要素に tooltip は届かないため、理由は sr-only テキストを
            // aria-describedby で関連付けて伝える。
            isDisabled={o.disabled}
            aria-describedby={
              o.disabled && o.reason ? `${reasonId}-${o.key}` : undefined
            }
            className={segClass}
          >
            {o.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {withReason.map((o) => (
        <span key={o.key} id={`${reasonId}-${o.key}`} className="sr-only">
          {o.reason}
        </span>
      ))}
    </div>
  );
}

export function ModeToggle() {
  const unit = useColorStore((s) => s.unit);
  const view = useColorStore((s) => s.view);
  const count = useColorStore((s) => s.palette.length);
  const setUnit = useColorStore((s) => s.setUnit);
  const setView = useColorStore((s) => s.setView);
  const t = useT();

  return (
    <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
      <Segmented<Unit>
        label={t("mode.unit")}
        value={unit}
        options={[
          { key: "single", label: t("unit.single") },
          {
            key: "pair",
            label: t("unit.pair"),
            disabled: count < 2,
            reason: t("mode.needPair"),
          },
          {
            key: "palette",
            label: t("unit.palette"),
            disabled: count < 3,
            reason: t("mode.needPalette"),
          },
        ]}
        onChange={setUnit}
      />
      <Segmented<View>
        label={t("mode.view")}
        value={view}
        options={[
          { key: "verify", label: t("view.verify") },
          { key: "design", label: t("view.design") },
        ]}
        onChange={setView}
      />
    </div>
  );
}
