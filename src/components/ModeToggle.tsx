"use client";

import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import { useColorStore, type Unit, type View } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";

/** v2 セグメント: 枠付き・アクティブ=反転＋上辺2pxアクセントティック。 */
const segClass =
  "border-border-strong border-r border-t-2 border-t-transparent bg-transparent px-3.5 py-1.5 " +
  "text-control font-medium text-text-2 last:border-r-0 " +
  "data-[selected]:border-t-accent data-[selected]:bg-(--text) data-[selected]:font-semibold data-[selected]:text-(--bg)";

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
          const next = [...keys][0] as T | undefined;
          if (!next) return;
          // 無効な単位（色数不足）は選択させない。aria-disabled で操作は通すが握り潰す。
          if (options.find((o) => o.key === next)?.disabled) return;
          onChange(next);
        }}
        className="border-border-strong rounded-control inline-flex overflow-hidden border"
      >
        {options.map((o) => (
          <ToggleButton
            key={o.key}
            id={o.key}
            aria-disabled={o.disabled || undefined}
            className={
              segClass + (o.disabled ? " cursor-not-allowed opacity-40" : "")
            }
          >
            {/* 無効時はラベルを span で包み、native title で理由を示す
                （aria-disabled だが操作自体は通すので hover で title が出る）。 */}
            <span title={o.disabled ? o.reason : undefined}>{o.label}</span>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
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
