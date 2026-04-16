import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { ScreenShell } from "../components/ScreenShell";
import { invitation } from "../data/invitation";

const REWARDS = [
  { icon: "★", label: "EXP 획득", value: "+500 XP" },
  { icon: "♦", label: "칭호 해금", value: "[ 귀빈 ]" },
  { icon: "✦", label: "아이템 획득", value: "럭키카야의 부적 x 1" },
];

export function RsvpScreen() {
  const [choice, setChoice] = useState<string | null>(null);
  const [showClearScreen, setShowClearScreen] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const role = useMemo(() => {
    if (!choice) {
      return null;
    }

    const roleIndex = Math.floor(Math.random() * invitation.rsvp.roles.length);
    return invitation.rsvp.roles[roleIndex];
  }, [choice]);

  const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY as
    | string
    | undefined;

  useEffect(
    () => () => {
      if (clearTimerRef.current) {
        clearTimeout(clearTimerRef.current);
      }
    },
    [],
  );

  function initializeKakao() {
    if (!kakaoKey || !window.Kakao || window.Kakao.isInitialized()) {
      return;
    }

    window.Kakao.init(kakaoKey);
  }

  function handleChoice(option: string) {
    if (choice) {
      return;
    }

    setChoice(option);
    clearTimerRef.current = setTimeout(() => setShowClearScreen(true), 420);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#b99b64", "#d5bd8a", "#f2eadf", "#FEE500"],
      shapes: ["square"],
      gravity: 0.9,
    });
  }

  async function handleKakaoShare() {
    const text = `[QUEST CLEAR] 오늘의 역할은 ${role ?? "파티원"}입니다.`;
    const shareUrl = window.location.href;
    const imageUrl = new URL("/preview.png", window.location.origin).href;

    initializeKakao();

    if (window.Kakao?.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "Birthday Invitation",
          description: text,
          imageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: "초대장 보기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "Birthday Invitation",
        text,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(`${text} ${shareUrl}`);
    setShareMessage("카카오 키가 없어서 링크를 복사했습니다.");
  }

  return (
    <ScreenShell
      title={showClearScreen ? "최종 클리어" : invitation.rsvp.title}
      progress={100}
    >
      <AnimatePresence mode="wait">
        {!showClearScreen ? (
          <motion.div
            key="rsvp-choice"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="border-2 border-[#b99b64] bg-[#11100f] p-4"
          >
            <p className="mb-1 text-[13px] font-bold tracking-widest text-[#b99b64]">
              ▶ FINAL QUEST #007
            </p>
            <p className="mb-4 text-[13px] leading-relaxed tracking-wide text-[#9a9080]">
              참석 여부를 선택하여 퀘스트를 완료하세요.
            </p>

            <div className="grid gap-2.5">
              {invitation.rsvp.choices.map((option, index) => {
                const isSelected = choice === option;
                const isDimmed = choice !== null && choice !== option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleChoice(option)}
                    disabled={choice !== null}
                    aria-pressed={isSelected}
                    className={`flex min-h-[52px] w-full items-center gap-3 border-2 px-4 text-[13px] font-bold tracking-wide transition-all duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5bd8a] active:scale-[0.99] ${
                      isSelected
                        ? "border-[#b99b64] bg-[#b99b64] text-[#11100f]"
                        : isDimmed
                          ? "cursor-not-allowed border-[#343029] text-[#555047]"
                          : "border-[#b99b64] bg-[#1a1815] text-[#f2eadf] hover:bg-[#b99b64] hover:text-[#11100f]"
                    }`}
                  >
                    <span>▶</span>
                    <span className="flex-1">[ {option} ]</span>
                    <span>{index === 0 ? "★" : "✦"}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : choice && role ? (
          <motion.div
            key="rsvp-clear"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="border-2 border-[#b99b64] bg-[#0d0d14] p-5"
          >
            <p className="mb-1 animate-pulse text-center text-xl font-bold tracking-widest text-[#b99b64]">
              ★ QUEST CLEAR ★
            </p>
            <p className="mb-3 text-center text-[11px] font-bold tracking-widest text-[#777064]">
              모든 조건 달성 완료
            </p>

            {REWARDS.map((reward) => (
              <div
                key={reward.label}
                className="mb-2 flex items-center gap-3 border border-[#343029] bg-[#1a1815] px-3 py-2"
              >
                <span className="w-5 shrink-0 text-center text-base text-[#b99b64]">
                  {reward.icon}
                </span>
                <span className="flex-1 text-[12px] font-bold tracking-wide text-[#d8cbbb]">
                  {reward.label}
                </span>
                <span className="text-[12px] font-bold tracking-wide text-[#b99b64]">
                  {reward.value}
                </span>
              </div>
            ))}

            <div className="my-4 h-px bg-[#2a2720]" />
            <p className="text-center text-[12px] font-bold tracking-widest text-[#d8cbbb]">
              {invitation.rsvp.done}
            </p>
            <p className="mt-2 text-center text-2xl font-bold tracking-wide text-[#b99b64]">
              [ {role} ]
            </p>

            <button
              type="button"
              onClick={handleKakaoShare}
              className="mt-5 flex w-full items-center justify-center gap-2 bg-[#FEE500] py-3 text-[12px] font-bold tracking-widest text-[#191600] transition hover:bg-[#f5da00] active:scale-[0.99]"
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
            {shareMessage ? (
              <p
                aria-live="polite"
                className="mt-2 text-center text-[10px] font-bold tracking-widest text-[#d5bd8a]"
              >
                {shareMessage}
              </p>
            ) : null}
            <p className="mt-1.5 text-center text-[10px] font-bold tracking-widest text-[#555047]">
              파티원에게 클리어 소식을 알립니다
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ScreenShell>
  );
}
