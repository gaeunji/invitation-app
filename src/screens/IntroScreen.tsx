import { motion } from "framer-motion";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenShell } from "../components/ScreenShell";
import { invitation } from "../data/invitation";

type IntroScreenProps = {
  onStart: () => void;
};

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <ScreenShell
      eyebrow={invitation.intro.eyebrow}
      title={invitation.intro.title}
      body={invitation.intro.body}
      progress={0}
      titleClassName="text-[26px]"
      bodyClassName="text-xs leading-6"
    >
      <motion.div
        className="border-2 border-[#343029] bg-[#1a1815] p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <p className="text-[11px] font-bold tracking-widest text-[#b99b64]">
          ▶ MAIN QUEST #001
        </p>
        <p className="mt-3 text-[18px] font-bold leading-snug tracking-wide text-[#f2eadf]">
          퀘스트를 깨고 초대장을 받으시게나
        </p>
        <div className="mt-4 h-2 border border-[#343029] bg-[#11100f]">
          <div className="h-full w-1/5 bg-[#b99b64]" />
        </div>
      </motion.div>
      <PrimaryButton onClick={onStart}>{invitation.intro.cta}</PrimaryButton>
    </ScreenShell>
  );
}
