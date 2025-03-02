import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { defaultBaseColor } from "@/const/colorConst";

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: defaultBaseColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <motion.h1
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
            }}
          >
            <Image
              src="/color-function_big-logo.svg"
              alt="Color Function"
              width={300}
              height={300}
            />
          </motion.h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
