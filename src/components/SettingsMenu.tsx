"use client";

import {
  DialogTrigger,
  Button,
  Popover,
  Dialog,
  Heading,
  ToggleButtonGroup,
  ToggleButton,
} from "react-aria-components";
import { Settings } from "iconoir-react";
import { useTheme, setTheme, type Theme } from "@/lib/theme";
import { useLocale, setLocale, useT } from "@/lib/i18n/locale";
import { type Locale } from "@/lib/i18n/messages";
import { segCompactClass } from "./segmented";

/**
 * 設定メニュー（ギア）。テーマ（明暗）と言語の切替をひとつに集約する。
 * 値はそれぞれ localStorage に保持され、次回訪問時も適用される。
 */
export function SettingsMenu() {
  const theme = useTheme();
  const locale = useLocale();
  const t = useT();

  return (
    <DialogTrigger>
      <Button
        aria-label={t("settings.open")}
        className="cff-control text-text-2 hover:border-accent hover:text-accent flex size-9 items-center justify-center"
      >
        <Settings width={15} height={15} aria-hidden />
      </Button>
      <Popover className="border-border-strong bg-surface rounded-panel shadow-overlay w-[290px] border">
        <Dialog className="outline-none">
          <div className="border-border flex items-center gap-[9px] border-b px-[18px] py-3.5">
            <Settings
              width={13}
              height={13}
              strokeWidth={2}
              className="text-accent"
              aria-hidden
            />
            <Heading slot="title" className="text-sm font-bold">
              {t("settings.title")}
            </Heading>
          </div>
          <div className="flex flex-col gap-4 p-[18px]">
            <div className="flex items-center justify-between gap-3">
              <span className="text-text-3 text-meta font-mono tracking-[0.12em] uppercase">
                {t("settings.theme")}
              </span>
              <ToggleButtonGroup
                selectionMode="single"
                disallowEmptySelection
                aria-label={t("settings.theme")}
                selectedKeys={[theme]}
                onSelectionChange={(keys) => {
                  const next = [...keys][0] as Theme | undefined;
                  if (next) setTheme(next);
                }}
                className="border-border-strong rounded-control inline-flex overflow-hidden border"
              >
                <ToggleButton id="light" className={segCompactClass}>
                  {t("settings.light")}
                </ToggleButton>
                <ToggleButton id="dark" className={segCompactClass}>
                  {t("settings.dark")}
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="text-text-3 text-meta font-mono tracking-[0.12em] uppercase">
                {t("settings.language")}
              </span>
              <ToggleButtonGroup
                selectionMode="single"
                disallowEmptySelection
                aria-label={t("settings.language")}
                selectedKeys={[locale]}
                onSelectionChange={(keys) => {
                  const next = [...keys][0] as Locale | undefined;
                  if (next) setLocale(next);
                }}
                className="border-border-strong rounded-control inline-flex overflow-hidden border"
              >
                {/* 言語名はそれぞれの言語で固定表記 */}
                <ToggleButton id="ja" className={segCompactClass}>
                  日本語
                </ToggleButton>
                <ToggleButton id="en" className={segCompactClass}>
                  English
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
