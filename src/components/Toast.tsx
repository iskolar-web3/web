import { motion, AnimatePresence } from "framer-motion";
import { HiCheckCircle, HiXCircle } from "react-icons/hi2";
import type { JSX } from "react";

interface ToastProps {
  visible: boolean;
  type: "success" | "error";
  title: string;
  message: string;
}

export default function Toast({ visible, type, title, message }: ToastProps): JSX.Element {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 500 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 500 }}
          transition={{
            type: "spring",
            stiffness: 800,
            damping: 28,
          }}
          className="fixed top-6 right-4 z-[1000] w-[350px] h-[55px] rounded-lg flex items-center justify-end shadow-lg"
          style={{
            backgroundColor: type === "success" ? "#31D0AA" : "#EF4444",
          }}
        >
          <div className="flex items-center w-[345px] h-[55px] bg-[#F0F7FF] rounded-lg px-3 py-2 gap-3 opacity-80">
            <div className="flex items-center justify-center">
              {type === "success" ? (
                <HiCheckCircle size={30} className="text-[#31D0AA]" />
              ) : (
                <HiXCircle size={30} className="text-[#EF4444]" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm text-primary leading-tight">
                {title}
              </p>
              <p className="text-xs text-primary opacity-85 leading-tight">
                {message}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
