import type { ReactNode } from "react";

type Tone = "ok" | "warn" | "neutral" | "blood";

const toneClass: Record<Tone, string> = {
  ok: "bg-ok/15 text-ok",
  warn: "bg-warn/15 text-warn",
  neutral: "bg-paper-deep text-ink-muted",
  blood: "bg-blood/10 text-blood",
};

export const StatusPill = ({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) => (
  <span
    className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold tracking-wide ${toneClass[tone]}`}
  >
    {children}
  </span>
);
