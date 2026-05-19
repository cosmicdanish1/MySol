import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the text */
  className?: string;
}

export function ContainerTextFlip({
  words = ["MySol", "Danish", "MY AI"],
  interval = 3000,
  className,
}: ContainerTextFlipProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words, interval]);

  return (
    <span className="inline-flex items-center justify-center relative overflow-hidden h-[1.4em] min-w-[85px] px-3 py-1 rounded-xl bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-500/20 dark:border-indigo-400/20 shadow-sm align-middle select-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className={cn(
            "text-base md:text-lg font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap leading-none",
            className
          )}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
