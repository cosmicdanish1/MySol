import React, { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
}

export const AuroraBackground = ({
  className,
  children,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center transition-colors duration-500",
        className
      )}
      {...props}
    >
      {/* Mesh Gradient Background Layer (Hardware-accelerated via transform-gpu) */}
      <div className="absolute inset-0 -z-20 transform-gpu pointer-events-none opacity-50 dark:opacity-40">
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-300 via-sky-200 to-purple-200 dark:from-indigo-900 dark:via-zinc-950 dark:to-purple-950 animate-slow-spin transform-gpu"></div>
      </div>
      
      {/* Radial soft ambient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(255,255,255,0.65)_100%)] dark:bg-[radial-gradient(circle_at_center,_transparent_20%,_rgba(9,9,11,0.75)_100%)] pointer-events-none"></div>

      {children}
    </div>
  );
};
