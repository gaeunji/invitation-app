import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { CardDrawScreen } from "./screens/CardDrawScreen";
import { IntroScreen } from "./screens/IntroScreen";
import { PuzzleScreen } from "./screens/PuzzleScreen";
import { RevealScreen } from "./screens/RevealScreen";
import { RsvpScreen } from "./screens/RsvpScreen";
import { StoryScreen } from "./screens/StoryScreen";

type Step = "intro" | "puzzle" | "story" | "card" | "reveal" | "rsvp";

const screenVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function App() {
  const [step, setStep] = useState<Step>("intro");

  return (
    <main className="min-h-screen bg-[#11100f] font-mono text-[#ede6da]">
      <div className="fixed inset-0 -z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(185,155,100,0.14),transparent_34%),linear-gradient(180deg,#11100f_0%,#171512_100%)]" />
      <div className="fixed inset-x-0 top-0 -z-0 h-1 bg-[#b99b64]" />
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={screenVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-1"
          >
            {step === "intro" && (
              <IntroScreen onStart={() => setStep("puzzle")} />
            )}
            {step === "puzzle" && (
              <PuzzleScreen
                onBack={() => setStep("intro")}
                onComplete={() => setStep("story")}
              />
            )}
            {step === "story" && <StoryScreen onDone={() => setStep("card")} />}
            {step === "card" && (
              <CardDrawScreen onComplete={() => setStep("reveal")} />
            )}
            {step === "reveal" && (
              <RevealScreen onRsvp={() => setStep("rsvp")} />
            )}
            {step === "rsvp" && <RsvpScreen />}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}

export default App;
