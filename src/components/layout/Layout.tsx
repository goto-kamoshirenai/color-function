"use client";

import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useMyColorStore } from "@/store/myColorStore";
import { TranslationProvider } from "@/contexts/TranslationContext";
import SplashScreen from "../elements/SplashScreen";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { baseColorA } = useMyColorStore();
  return (
    <TranslationProvider>
      <div style={{ backgroundColor: baseColorA, minHeight: "100vh" }}>
        <SplashScreen />
        <Header />
        <Sidebar />
        {children}
      </div>
    </TranslationProvider>
  );
};

export default Layout;
