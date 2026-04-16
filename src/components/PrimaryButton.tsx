import type { ButtonHTMLAttributes, ReactNode } from "react";

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  tone?: "hot" | "paper";
};

export function PrimaryButton({ children, tone = "hot", className = "", ...props }: PrimaryButtonProps) {
  const toneClass =
    tone === "hot"
      ? "border-[#b99b64] bg-[#b99b64] text-[#11100f] hover:bg-[#d5bd8a] focus-visible:outline-[#d5bd8a]"
      : "border-[#b99b64] bg-[#1a1815] text-[#f2eadf] hover:bg-[#b99b64] hover:text-[#11100f] focus-visible:outline-[#b99b64]";

  return (
    <button
      className={`min-h-[52px] border-2 px-5 py-3 font-mono text-[13px] font-bold tracking-widest transition active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-[#11100f] ${toneClass} ${className}`}
      {...props}
    >
      <span className="mr-2">▶</span>
      {children}
    </button>
  );
}
