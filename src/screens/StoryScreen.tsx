import { motion } from "framer-motion";
import { useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { storySteps } from "../data/invitation";

type StoryScreenProps = {
  onDone: () => void;
};

export function StoryScreen({ onDone }: StoryScreenProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const step = storySteps[stepIndex];
  const storyProgress = 33 + (stepIndex / storySteps.length) * 34;

  function choose(choice: (typeof storySteps)[number]["choices"][number]) {
    setFeedback(choice.feedback);

    if (!choice.isCorrect || isAdvancing) {
      return;
    }

    setIsAdvancing(true);

    window.setTimeout(() => {
      setFeedback(null);
      setIsAdvancing(false);

      if (stepIndex === storySteps.length - 1) {
        onDone();
        return;
      }

      setStepIndex((current) => current + 1);
    }, 1500);
  }

  return (
    <ScreenShell
      title="2차 검문: 기억 테스트"
      body={`질문 ${stepIndex + 1} / ${storySteps.length}`}
      progress={
        isAdvancing
          ? 33 + ((stepIndex + 1) / storySteps.length) * 34
          : storyProgress
      }
    >
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 border-2 border-[#b99b64] bg-[#11100f] p-4"
      >
        <p className="text-[11px] font-bold tracking-widest text-[#b99b64]">
          ▶ MEMORY CHECK #{String(stepIndex + 1).padStart(3, "0")}
        </p>
        <p className="text-[22px] font-bold leading-snug tracking-wide text-[#f2eadf]">
          {step.text}
        </p>
        <div className="grid gap-3">
          {step.choices.map((choice) => (
            <button
              key={choice.label}
              type="button"
              onClick={() => choose(choice)}
              disabled={isAdvancing}
              className="flex min-h-[52px] items-center gap-3 border-2 border-[#b99b64] bg-[#1a1815] px-4 text-left text-[13px] font-bold tracking-wide text-[#f2eadf] transition hover:bg-[#b99b64] hover:text-[#11100f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-[#11100f] focus-visible:outline-[#d5bd8a] active:scale-[0.99] disabled:cursor-wait"
            >
              <span>▶</span>
              <span>[ {choice.label} ]</span>
            </button>
          ))}
        </div>
      </motion.div>
      {feedback && (
        <p
          aria-live="polite"
          className="border-2 border-[#343029] bg-[#1a1815] p-4 text-center text-[13px] font-bold tracking-wide text-[#d5bd8a]"
        >
          {feedback}
        </p>
      )}
    </ScreenShell>
  );
}
