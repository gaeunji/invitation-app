import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScreenShell } from "../components/ScreenShell";
import { invitation } from "../data/invitation";

type CardDrawScreenProps = {
  onComplete: () => void;
};

type CardPhase = "idle" | "revealing" | "returning" | "shuffling" | "success";

type Card = {
  id: number;
  label: string;
  isLucky: boolean;
};

type SelectedCard = {
  id: number;
  x: number;
  y: number;
  left: number;
  top: number;
  width: number;
  height: number;
};

function shuffleCards(cards: Card[]) {
  const nextCards = [...cards];

  for (let index = nextCards.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextCards[index], nextCards[swapIndex]] = [
      nextCards[swapIndex],
      nextCards[index],
    ];
  }

  return nextCards;
}

export function CardDrawScreen({ onComplete }: CardDrawScreenProps) {
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const timersRef = useRef<number[]>([]);
  const [cards, setCards] = useState<Card[]>(() => {
    const luckyIndex = Math.floor(
      Math.random() * invitation.cardDraw.cards.length,
    );

    return shuffleCards(
      invitation.cardDraw.cards.map((label, index) => ({
        id: index,
        label,
        isLucky: index === luckyIndex,
      })),
    );
  });
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const [phase, setPhase] = useState<CardPhase>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const selectedCardData = useMemo(
    () => cards.find((card) => card.id === selectedCard?.id) ?? null,
    [cards, selectedCard],
  );

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  function queueTimer(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timersRef.current.push(timer);
  }

  function drawCard(card: Card, slotIndex: number) {
    if (phase !== "idle") {
      return;
    }

    const cardElement = cardRefs.current[slotIndex];

    if (!cardElement) {
      return;
    }

    const rect = cardElement.getBoundingClientRect();
    const centerX = window.innerWidth / 2 - (rect.left + rect.width / 2);
    const centerY = window.innerHeight / 2 - (rect.top + rect.height / 2);

    setSelectedCard({
      id: card.id,
      x: centerX,
      y: centerY,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setPhase("revealing");

    if (!card.isLucky) {
      setMessage(invitation.cardDraw.retry);
      queueTimer(() => setPhase("returning"), 800);
      queueTimer(() => {
        setSelectedCard(null);
        setMessage(null);
        setPhase("shuffling");
        setCards((current) => shuffleCards(current));
      }, 1100);
      queueTimer(() => setPhase("idle"), 1600);
      return;
    }

    setPhase("success");
    setMessage(invitation.cardDraw.success);
    queueTimer(onComplete, 2500);
  }

  return (
    <ScreenShell
      title={invitation.cardDraw.title}
      body={invitation.cardDraw.body}
      progress={phase === "success" ? 100 : 67}
    >
      <div className="grid grid-cols-2 gap-3 border-2 border-[#343029] bg-[#1a1815] p-3">
        {cards.map((card, index) => {
          const isSelected = selectedCard?.id === card.id;
          const shouldHide =
            selectedCard !== null &&
            (phase === "revealing" ||
              phase === "success" ||
              (phase === "returning" && isSelected));

          return (
            <motion.button
              key={card.id}
              layout
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              type="button"
              onClick={() => drawCard(card, index)}
              disabled={phase !== "idle"}
              aria-label={`${card.label} 뒤집기`}
              aria-pressed={isSelected}
              animate={{
                opacity: shouldHide ? 0 : 1,
                rotate: phase === "shuffling" ? [0, -2, 2, 0] : 0,
              }}
              transition={{ duration: 0.52, ease: "easeInOut" }}
              className="group relative aspect-[2/3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-[#11100f] focus-visible:outline-[#d5bd8a] disabled:cursor-default"
              style={{ perspective: "900px" }}
            >
              <CardFace card={card} isFrontVisible={false} />
            </motion.button>
          );
        })}
      </div>

      {selectedCard && selectedCardData ? (
        <motion.div
          className="pointer-events-none fixed z-50"
          initial={false}
          animate={{
            x:
              phase === "revealing" || phase === "success" ? selectedCard.x : 0,
            y:
              phase === "revealing" || phase === "success" ? selectedCard.y : 0,
            scale: phase === "revealing" || phase === "success" ? 1.35 : 1,
          }}
          transition={{ duration: 0.52, ease: "easeInOut" }}
          style={{
            left: selectedCard.left,
            top: selectedCard.top,
            width: selectedCard.width,
            height: selectedCard.height,
            perspective: "900px",
            transformOrigin: "center",
          }}
        >
          <CardFace
            card={selectedCardData}
            isFrontVisible={phase === "revealing" || phase === "success"}
          />
        </motion.div>
      ) : null}

      <div aria-live="polite" className="min-h-16">
        {message && selectedCardData ? (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 p-4 text-center text-[13px] font-bold tracking-wide ${
              selectedCardData.isLucky
                ? "border-[#b99b64] bg-[#11100f] text-[#b99b64]"
                : "border-[#343029] bg-[#1a1815] text-[#d5bd8a]"
            }`}
          >
            {message}
          </motion.p>
        ) : null}
      </div>
    </ScreenShell>
  );
}

function CardFace({
  card,
  isFrontVisible,
}: {
  card: Card;
  isFrontVisible: boolean;
}) {
  return (
    <motion.span
      initial={false}
      animate={{ rotateY: isFrontVisible ? 180 : 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={`relative block h-full w-full ${
        isFrontVisible ? "is-flipped" : ""
      }`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <span
        className="absolute inset-0 grid place-items-center border-2 border-[#b99b64] bg-[#11100f] p-3 text-center text-lg font-black text-[#d5bd8a] shadow-[0_14px_30px_rgba(0,0,0,0.24)] transition group-hover:-translate-y-1 group-hover:bg-[#1a1815]"
        style={{ backfaceVisibility: "hidden" }}
      >
        ?
      </span>
      <span
        className={`absolute inset-0 grid place-items-center border-2 p-3 text-center font-bold shadow-[0_14px_30px_rgba(0,0,0,0.24)] ${
          card.isLucky
            ? "border-[#b99b64] bg-[#b99b64] text-[#11100f]"
            : "border-[#343029] bg-[#1a1815] text-[#bcb1a2]"
        }`}
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <span className={card.isLucky ? "text-4xl" : "text-2xl"}>
          {card.isLucky ? "🍀" : "꽝"}
        </span>
      </span>
    </motion.span>
  );
}
