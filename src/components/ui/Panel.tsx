import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export const Panel = ({ children, className = "" }: PanelProps) => {
  return (
    <div
      className={`rounded-lg border border-line bg-surface p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
};
