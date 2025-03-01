"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type TranslationType = {
  sidebar: {
    contrast: string;
    hsv: string;
  };
};

type TranslationContextType = {
  t: TranslationType;
  locale: string;
  setLocale: (locale: string) => void;
  isLoading: boolean;
};

const defaultTranslations: TranslationType = {
  sidebar: {
    contrast: "WCAG2.0 コントラスト基準",
    hsv: "HSV 色分析",
  },
};

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [translations, setTranslations] =
    useState<TranslationType>(defaultTranslations);
  const [locale, setLocale] = useState("ja");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/locales/${locale}/common.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
        setTranslations(defaultTranslations);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  return (
    <TranslationContext.Provider
      value={{ t: translations, locale, setLocale, isLoading }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};
