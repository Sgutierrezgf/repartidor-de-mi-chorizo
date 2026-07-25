import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

const variantClass: Record<Variant, string> = {
  primary:
    "bg-blood text-surface hover:bg-blood-hover disabled:opacity-50",
  secondary:
    "bg-ink text-surface hover:bg-ink/90 disabled:opacity-50",
  ghost:
    "bg-transparent text-ink border border-line hover:bg-paper-deep/60 disabled:opacity-50",
};

export const Button = ({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${variantClass[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
