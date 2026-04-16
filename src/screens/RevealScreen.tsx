import { motion } from "framer-motion";
import { PrimaryButton } from "../components/PrimaryButton";
import { ScreenShell } from "../components/ScreenShell";
import { invitation } from "../data/invitation";

type RevealScreenProps = {
  onRsvp: () => void;
};

export function RevealScreen({ onRsvp }: RevealScreenProps) {
  const items = [
    ["날짜", invitation.party.date],
    ["시간", invitation.party.time],
    ["장소", invitation.party.location],
    ["드레스 코드", invitation.party.dressCode],
  ];

  return (
    <ScreenShell
      title={invitation.party.title}
      body={invitation.party.message}
      progress={100}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.36, ease: "easeOut" }}
        className="space-y-3 border-2 border-[#b99b64] bg-[#11100f] p-4"
      >
        <p className="bg-[#b99b64] px-3 py-2 text-center text-[12px] font-bold tracking-widest text-[#11100f]">
          [ DINNER INVITATION TICKET ]
        </p>
        {items.map(([label, value]) => (
          <div
            key={label}
            className="border-b border-[#343029] pb-3 last:border-b-0 last:pb-0"
          >
            <p className="text-[11px] font-bold tracking-widest text-[#b99b64]">
              ▶ {label}
            </p>
            <p className="mt-1 text-[17px] font-bold leading-snug tracking-wide text-[#f2eadf]">
              {value}
            </p>
          </div>
        ))}
      </motion.div>
      <PrimaryButton onClick={onRsvp}>참석 확정하러 가기</PrimaryButton>
    </ScreenShell>
  );
}
