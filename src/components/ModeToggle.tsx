"use client";

import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import { useColorStore, type Unit, type View } from "@/store/useColorStore";
import { useT } from "@/lib/i18n/locale";

/** v2 セグメント: 枠付き・アクティブ=反転＋上辺2pxアクセントティック。 */
const segClass =
  "border-border-strong border-r border-t-2 border-t-transparent bg-transparent px-3.5 py-1.5 " +
  "text-control font-medium text-text-2 last:border-r-0 " +
  "data-[selected]:border-t-accent data-[selected]:bg-(--text) data-[selected]:font-semibold data-[selected]:text-(--bg)";

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { key: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-[9px]">
      <span className="text-text-3 text-meta font-mono tracking-[0.16em] uppercase">
        {label}
      </span>
      <ToggleButtonGroup
        selectionMode="single"
        disallowEmptySelection
        aria-label={label}
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const next = [...keys][0] as T | undefined;
          if (next) onChange(next);
        }}
        className="border-border-strong rounded-control inline-flex overflow-hidden border"
      >
        {options.map((o) => (
          <ToggleButton key={o.key} id={o.key} className={segClass}>
            {o.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  );
}

export function ModeToggle() {
  const unit = useColorStore((s) => s.unit);
  const view = useColorStore((s) => s.view);
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
          { key: "pair", label: t("unit.pair") },
          { key: "palette", label: t("unit.palette") },
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
