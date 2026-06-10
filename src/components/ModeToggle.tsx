"use client";

import { ToggleButtonGroup, ToggleButton } from "react-aria-components";
import { useColorStore, type Unit, type View } from "@/store/useColorStore";

const segClass =
  "px-2.5 py-1 text-xs font-medium text-text-2 border-b-2 border-transparent " +
  "data-[selected]:text-text data-[selected]:border-accent " +
  "hover:text-text focus-visible:outline-2 focus-visible:outline-accent";

export function ModeToggle() {
  const unit = useColorStore((s) => s.unit);
  const view = useColorStore((s) => s.view);
  const setUnit = useColorStore((s) => s.setUnit);
  const setView = useColorStore((s) => s.setView);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <div className="flex items-center gap-2">
        <span className="text-text-3 font-mono text-[10px] tracking-widest">
          単位
        </span>
        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[unit]}
          onSelectionChange={(keys) => {
            const next = [...keys][0] as Unit | undefined;
            if (next) setUnit(next);
          }}
          className="flex"
        >
          <ToggleButton id="single" className={segClass}>
            単色
          </ToggleButton>
          <ToggleButton id="pair" className={segClass}>
            ペア
          </ToggleButton>
          <ToggleButton id="palette" className={segClass}>
            パレット
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-text-3 font-mono text-[10px] tracking-widest">
          観点
        </span>
        <ToggleButtonGroup
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[view]}
          onSelectionChange={(keys) => {
            const next = [...keys][0] as View | undefined;
            if (next) setView(next);
          }}
          className="flex"
        >
          <ToggleButton id="verify" className={segClass}>
            検証
          </ToggleButton>
          <ToggleButton id="design" className={segClass}>
            設計
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
}
