"use client";

import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import { useColorStore, type Unit, type View } from "@/store/useColorStore";

/** v2 セグメント: 枠付き・アクティブ=反転＋上辺2pxアクセントティック。 */
const segClass =
  "border-border-strong border-r border-t-2 border-t-transparent bg-transparent px-3.5 py-1.5 " +
  "text-[12.5px] font-medium text-text-2 last:border-r-0 " +
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
      <span className="text-text-3 font-mono text-[9px] tracking-[0.16em] uppercase">
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
        className="border-border-strong inline-flex overflow-hidden rounded-[2px] border"
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

  return (
    <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
      <Segmented<Unit>
        label="単位 / Unit"
        value={unit}
        options={[
          { key: "single", label: "単色" },
          { key: "pair", label: "ペア" },
          { key: "palette", label: "パレット" },
        ]}
        onChange={setUnit}
      />
      <Segmented<View>
        label="観点 / View"
        value={view}
        options={[
          { key: "verify", label: "検証" },
          { key: "design", label: "設計" },
        ]}
        onChange={setView}
      />
    </div>
  );
}
