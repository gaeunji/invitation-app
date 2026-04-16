import type { ReactNode } from "react";

type ScreenShellProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  progress?: number;
  titleClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
};

export function ScreenShell({
  eyebrow,
  title,
  body,
  progress,
  titleClassName = "",
  bodyClassName = "",
  children,
}: ScreenShellProps) {
  const progressValue =
    progress === undefined ? null : Math.max(0, Math.min(100, progress));

  return (
    <section className="flex w-full flex-1 flex-col justify-center gap-4 py-4 font-mono">
      <div className="border-2 border-[#b99b64] bg-[#11100f]">
        <div className="flex items-center justify-between bg-[#b99b64] px-3 py-1.5">
          <span className="text-[11px] font-bold tracking-widest text-[#11100f]">
            [ QUEST LOG ]
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map((dot) => (
              <span key={dot} className="h-1.5 w-1.5 bg-[#11100f] opacity-40" />
            ))}
          </div>
        </div>
        <div className="p-4">
        {eyebrow ? (
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#b99b64]">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={`text-[24px] font-bold leading-tight tracking-wide text-[#f2eadf] ${titleClassName}`}
        >
          {title}
        </h1>
        {body ? (
          <p
            className={`mt-3 text-[13px] leading-relaxed tracking-wide text-[#9a9080] ${bodyClassName}`}
          >
            {body}
          </p>
        ) : null}
        {progressValue !== null ? (
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-[11px] font-bold tracking-widest text-[#777064]">
              <span>진행도</span>
              <span>{Math.round(progressValue)}%</span>
            </div>
            <div className="h-2 border border-[#343029] bg-[#1e1c18]">
              <div
                className="h-full bg-[#b99b64] transition-all duration-700 ease-out"
                style={{ width: `${progressValue}%` }}
              />
            </div>
          </div>
        ) : null}
        </div>
      </div>
      {children}
    </section>
  );
}
