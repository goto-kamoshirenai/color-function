"use client";

import Image from "next/image";
import React from "react";
import { usePanelStore } from "@/store/panelStore";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useMyColorStore } from "@/store/myColorStore";

const MENU_ITEMS = [
  { id: "home", label: "ホーム" },
  { id: "color-picker", label: "カラーピッカー" },
  { id: "history", label: "履歴" },
  { id: "settings", label: "設定" },
] as const;

const menuVariants = {
  hidden: { y: -40 },
  visible: { y: 0 },
  exit: { opacity: 0, y: -80 },
};

const iconContainerVariants = {
  hidden: { y: -40, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Header = () => {
  const { isNavigationOpen, toggleNavigation } = usePanelStore();
  const { baseColorA } = useMyColorStore();
  return (
    <header className="fixed top-0 left-0 w-full h-32 z-50">
      <div className="flex items-center p-4 relative z-50">
        <div onClick={toggleNavigation}>
          <Image
            src={
              isNavigationOpen
                ? "/color-function_menu.svg"
                : "/color-function_logo.svg"
            }
            alt="logo"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isNavigationOpen && (
          <>
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-0 w-64 h-screen -z-10"
              style={{ backgroundColor: baseColorA }}
            />
            <motion.nav
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="fixed top-0 left-4 h-full bg-transparent z-40"
            >
              <div className="relative pt-16 flex ">
                <motion.div
                  variants={iconContainerVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-y-2"
                >
                  {MENU_ITEMS.map((item) => (
                    <div key={`icon-${item.id}`} className="h-10">
                      <Image
                        src={`/color-function_list.svg`}
                        alt={item.label}
                        width={40}
                        height={40}
                      />
                    </div>
                  ))}
                </motion.div>
                <motion.div
                  variants={textContainerVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="absolute left-12 top-16 flex flex-col gap-y-2 pt-1"
                >
                  {MENU_ITEMS.map((item) => (
                    <div
                      key={`text-${item.id}`}
                      className="h-10 flex items-center"
                    >
                      <Link
                        href="#"
                        className="text-black border-b border-gray-400 whitespace-nowrap"
                      >
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </motion.div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
