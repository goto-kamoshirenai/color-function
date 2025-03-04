import { motion, AnimatePresence } from "framer-motion";
import React, { ReactNode } from "react";

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  backgroundColor?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  children,
  backgroundColor = "white",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 !pointer-events-auto"
            style={{ pointerEvents: "auto", zIndex: 51 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-0 m-auto w-[80vw] h-[80vh] rounded-xl shadow-elevation-3 p-6 z-[1000] overflow-y-auto"
            style={{
              backgroundColor,
            }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalWrapper;
