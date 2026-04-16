import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { ScreenShell } from "./components/ScreenShell";
import { invitation } from "./data/invitation";

declare global {
  interface Window {
    Kakao?: {
      isInitialized: () => boolean;
      Share: {
        sendDefault: (options: {
          objectType: "text";
          text: string;
          link: {
            mobileWebUrl: string;
            webUrl: string;
          };
        }) => void;
      };
    };
  }
}

const REWARDS_ATTEND = [
  { icon: "★", label: "EXP 획득", value: "+500 XP" },
  { icon: "♦", label: "칭호 해금", value: "[ 귀빈 ]" },
  { icon: "✦", label: "아이템 획득", value: "식사권 × 1" },
];

const REWARDS_DECLINE = [
  { icon: "✕", label: "페널티", value: "소중한 추억 손실" },
  { icon: "♡", label: "마음만으로도 감사합니다", value: "" },
];

export function RsvpScreen() {
  const [choice, setChoice] = useState<string | null>(null);
  const [expWidth, setExpWidth] = useState(0);
  const expRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAttending = choice === invitation.rsvp.choices[0];

  function handleChoice(option: string) {
    if (choice) return;
    setChoice(option);

    expRef.current = setTimeout(() => setExpWidth(100), 80);

    if (option === invitation.rsvp.choices[0]) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#b99b64", "#d5bd8a", "#f2eadf", "#FEE500"],
        shapes: ["square"],
        gravity: 0.9,
      });
    }
  }

  useEffect(
    () => () => {
      if (expRef.current) clearTimeout(expRef.current);
    },
    [],
  );

  function handleKakaoShare() {
    const text = isAttending
      ? "[QUEST CLEAR] 참석하겠습니다! 당일 뵙겠습니다 ★"
      : "[QUEST FAILED] 아쉽게도 불참하겠습니다. 마음은 함께합니다.";
    if (window.Kakao?.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: "text",
        text,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      });
    }
  }

  return (
    <ScreenShell title={invitation.rsvp.title} body={invitation.rsvp.body}>
      {/* 픽셀 패널 헤더 */}
      <div className="mb-1 flex items-center justify-between bg-[#b99b64] px-3 py-1.5">
        <span className="font-mono text-[11px] tracking-widest text-[#11100f]">
          [ QUEST LOG ]
        </span>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 w-1.5 bg-[#11100f] opacity-40" />
          ))}
        </div>
      </div>

      {/* 퀘스트 정보 */}
      <div className="mb-1 border-2 border-[#b99b64] bg-[#11100f] p-4">
        <p className="mb-1 font-mono text-[13px] tracking-widest text-[#b99b64]">
          ▶ 메인 퀘스트 #007
        </p>
        <p className="mb-4 text-[13px] leading-relaxed text-[#9a9080]">
          {invitation.rsvp.body}
        </p>

        {/* EXP 바 */}
        <div className="mb-4">
          <div className="mb-1 flex justify-between font-mono text-[11px] text-[#777064]">
            <span>진행도</span>
            <span>{expWidth}%</span>
          </div>
          <div className="h-2 border border-[#343029] bg-[#1e1c18]">
            <div
              className="h-full bg-[#b99b64] transition-all duration-700 ease-out"
              style={{ width: `${expWidth}%` }}
            />
          </div>
        </div>

        {/* 선택 버튼 */}
        <div className="grid gap-2.5">
          {invitation.rsvp.choices.map((option, i) => {
            const isSelected = choice === option;
            const isDimmed = choice !== null && choice !== option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleChoice(option)}
                disabled={isDimmed}
                aria-pressed={isSelected}
                className={`
                  flex min-h-[52px] w-full items-center gap-3 border-2 px-4
                  font-mono text-[13px] tracking-wide transition-all duration-100
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5bd8a]
                  active:scale-[0.99]
                  ${
                    isSelected
                      ? "border-[#b99b64] bg-[#b99b64] text-[#11100f]"
                      : isDimmed
                        ? "cursor-not-allowed border-[#343029] text-[#555047]"
                        : "border-[#b99b64] bg-[#1a1815] text-[#f2eadf] hover:bg-[#b99b64] hover:text-[#11100f]"
                  }
                `}
              >
                <span>▶</span>
                <span className="flex-1">[ {option} ]</span>
                <span className="text-base">{i === 0 ? "⚔" : "✕"}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 결과 카드 */}
      <AnimatePresence>
        {choice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`border-2 bg-[#0d0d14] p-5 ${
              isAttending ? "border-[#b99b64]" : "border-[#A32D2D]"
            }`}
          >
            {/* 배너 */}
            <p
              className={`mb-1 text-center font-mono text-xl tracking-widest ${
                isAttending ? "animate-pulse text-[#b99b64]" : "text-[#E24B4A]"
              }`}
            >
              {isAttending ? "★ QUEST CLEAR ★" : "✕ QUEST FAILED ✕"}
            </p>
            <p className="mb-3 text-center font-mono text-[11px] tracking-widest text-[#777064]">
              {isAttending ? "모든 조건 달성 완료" : "불참 선택 — 퀘스트 포기"}
            </p>

            {/* 보상 목록 */}
            {(isAttending ? REWARDS_ATTEND : REWARDS_DECLINE).map((r, i) => (
              <div
                key={i}
                className={`mb-2 flex items-center gap-3 border px-3 py-2 ${
                  isAttending
                    ? "border-[#343029] bg-[#1a1815]"
                    : "border-[#2a1a1a] bg-[#1a1815]"
                }`}
              >
                <span
                  className={`w-5 shrink-0 text-center text-base ${
                    !isAttending && i === 0
                      ? "text-[#E24B4A]"
                      : "text-[#b99b64]"
                  }`}
                >
                  {r.icon}
                </span>
                <span
                  className={`flex-1 font-mono text-[12px] ${
                    !isAttending && i === 0
                      ? "text-[#777064]"
                      : "text-[#d8cbbb]"
                  }`}
                >
                  {r.label}
                </span>
                {r.value && (
                  <span className="font-mono text-[12px] text-[#b99b64]">
                    {r.value}
                  </span>
                )}
              </div>
            ))}

            {/* 구분선 */}
            <div className="my-4 h-px bg-[#2a2720]" />

            {/* 카카오 공유 버튼 */}
            <button
              type="button"
              onClick={handleKakaoShare}
              className="flex w-full items-center justify-center gap-2 bg-[#FEE500] py-3 font-mono text-[12px] tracking-widest text-[#191600] transition hover:bg-[#f5da00] active:scale-[0.99]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#191600"
                aria-hidden="true"
              >
                <path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.7 1.5 5.1 3.8 6.6l-.97 3.5 4.02-2.65c.99.18 2.02.27 3.07.27 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
              </svg>
              카카오톡으로 공유
            </button>
            <p className="mt-1.5 text-center font-mono text-[10px] tracking-widest text-[#555047]">
              파티원에게 {isAttending ? "클리어" : "불참"} 소식을 알립니다
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </ScreenShell>
  );
}
