// Adapted from DavidHDev/rbp-portfolio (React Bits Pro portfolio template).
// License (template README): free to use in personal and commercial projects;
// the template itself may not be resold or redistributed.

import type { CSSProperties, ReactNode } from "react";

type Props = {
  size?: number;
  className?: string;
  style?: CSSProperties;
};

export function DottedPattern({
  size = 10,
  className,
  style,
}: Props): ReactNode {
  return (
    <div
      aria-hidden="true"
      className={`text-foreground/15 shadow-xl/5 ${className ?? ""}`}
      style={{
        backgroundImage:
          "radial-gradient(circle, currentColor 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        ...style,
      }}
    />
  );
}
