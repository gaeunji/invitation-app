import { motion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { ScreenShell } from "../components/ScreenShell";
import { invitation } from "../data/invitation";
import {
  createStarterPieces,
  isPuzzleSolved,
  swapPieces,
  type PuzzlePiece,
} from "../lib/puzzle";

const PUZZLE_SIZE = 3;

const scatter = [
  { x: -9, y: -7, rotate: -7 },
  { x: 7, y: -11, rotate: 5 },
  { x: 10, y: 5, rotate: -4 },
  { x: -11, y: 8, rotate: 6 },
  { x: 5, y: 4, rotate: -3 },
  { x: -6, y: -10, rotate: 8 },
  { x: 8, y: 10, rotate: -6 },
  { x: -8, y: 6, rotate: 4 },
  { x: 6, y: -5, rotate: -5 },
];

type PuzzleScreenProps = {
  onBack: () => void;
  onComplete: () => void;
};

type DragState = {
  pieceId: number;
  slotIndex: number;
  pointerId: number;
  dx: number;
  dy: number;
  startX: number;
  startY: number;
  startRotate: number;
};

export function PuzzleScreen({ onBack, onComplete }: PuzzleScreenProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const pieceRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [pieces, setPieces] = useState<PuzzlePiece[]>(() =>
    createStarterPieces(PUZZLE_SIZE),
  );
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState<
    number | null
  >(null);
  const [activeDragPieceId, setActiveDragPieceId] = useState<number | null>(
    null,
  );
  const [hoverSlotIndex, setHoverSlotIndex] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  const slots = useMemo(
    () =>
      Array.from({ length: PUZZLE_SIZE * PUZZLE_SIZE }, (_, index) => index),
    [],
  );

  useEffect(() => {
    if (!solved) {
      return;
    }

    const timer = window.setTimeout(onComplete, 1800);
    return () => window.clearTimeout(timer);
  }, [onComplete, solved]);

  useEffect(() => {
    if (!solved && isPuzzleSolved(pieces)) {
      setSolved(true);
    }
  }, [pieces, solved]);

  function getSlotFromPoint(clientX: number, clientY: number) {
    const board = boardRef.current;
    if (!board) {
      return null;
    }

    const rect = board.getBoundingClientRect();
    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      return null;
    }

    const col = Math.min(
      PUZZLE_SIZE - 1,
      Math.max(
        0,
        Math.floor(((clientX - rect.left) / rect.width) * PUZZLE_SIZE),
      ),
    );
    const row = Math.min(
      PUZZLE_SIZE - 1,
      Math.max(
        0,
        Math.floor(((clientY - rect.top) / rect.height) * PUZZLE_SIZE),
      ),
    );
    return row * PUZZLE_SIZE + col;
  }

  function swapAndCheck(firstIndex: number, secondIndex: number) {
    if (firstIndex === secondIndex || solved) {
      return;
    }

    const nextPieces = swapPieces(pieces, firstIndex, secondIndex);
    setPieces(nextPieces);
  }

  function handlePointerDown(
    slotIndex: number,
    piece: PuzzlePiece,
    event: PointerEvent<HTMLButtonElement>,
  ) {
    if (solved) {
      return;
    }

    const isCorrectlyPlaced = piece.correctIndex === slotIndex;
    const offset = isCorrectlyPlaced
      ? { x: 0, y: 0, rotate: 0 }
      : scatter[piece.id];

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pieceId: piece.id,
      slotIndex,
      pointerId: event.pointerId,
      dx: 0,
      dy: 0,
      startX: offset.x,
      startY: offset.y,
      startRotate: offset.rotate,
    };
    setActiveDragPieceId(piece.id);
    setHoverSlotIndex(slotIndex);
    setKeyboardSelectedIndex(null);
  }

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    const currentDrag = dragRef.current;
    if (!currentDrag || solved) return;

    currentDrag.dx += event.movementX;
    currentDrag.dy += event.movementY;

    const draggedElement = pieceRefs.current[currentDrag.slotIndex];
    if (draggedElement) {
      // translate3d를 사용하여 GPU 가속 활용
      draggedElement.style.transform = `translate3d(${currentDrag.startX + currentDrag.dx}px, ${
        currentDrag.startY + currentDrag.dy
      }px, 0) rotate(${currentDrag.startRotate}deg) scale(1.06)`;

      // 드래그 중에는 transition을 없애야 즉각적으로 반응함
      draggedElement.style.transition = "none";
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    const currentDrag = dragRef.current;
    if (!currentDrag) {
      return;
    }

    const targetSlot = getSlotFromPoint(event.clientX, event.clientY);
    const targetPiece = targetSlot === null ? null : pieces[targetSlot];

    if (targetSlot !== null && targetPiece) {
      swapAndCheck(currentDrag.slotIndex, targetSlot);
    }

    dragRef.current = null;
    setActiveDragPieceId(null);
    setHoverSlotIndex(null);
  }

  function handleKeyboardSwap(
    index: number,
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (keyboardSelectedIndex === null) {
      setKeyboardSelectedIndex(index);
      return;
    }

    swapAndCheck(keyboardSelectedIndex, index);
    setKeyboardSelectedIndex(null);
  }

  function resetPuzzle() {
    setPieces(createStarterPieces(PUZZLE_SIZE));
    setKeyboardSelectedIndex(null);
    dragRef.current = null;
    setActiveDragPieceId(null);
    setHoverSlotIndex(null);
    setSolved(false);
  }

  return (
    <ScreenShell
      title={invitation.puzzle.title}
      body={invitation.puzzle.body}
      progress={solved ? 33 : 0}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label="뒤로 가기"
        className="absolute left-5 top-5 grid h-10 w-10 place-items-center border-2 border-[#b99b64] bg-[#11100f] text-xl font-bold leading-none text-[#b99b64] transition hover:bg-[#b99b64] hover:text-[#11100f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-[#11100f] focus-visible:outline-[#d5bd8a]"
      >
        {"<"}
      </button>
      <div className="space-y-4">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={resetPuzzle}
            className="min-h-10 shrink-0 border-2 border-[#b99b64] bg-[#1a1815] px-3 text-[12px] font-bold tracking-widest text-[#f2eadf] transition hover:bg-[#b99b64] hover:text-[#11100f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d5bd8a]"
          >
            ▶ 다시 섞기
          </button>
        </div>

        <div
          ref={boardRef}
          className="relative aspect-square w-full touch-none overflow-hidden border-2 border-[#b99b64] bg-[#11100f]"
        >
          <div className="absolute inset-0 grid grid-cols-3">
            {slots.map((slot) => (
              <div
                key={slot}
                className={`border border-dashed ${
                  hoverSlotIndex === slot
                    ? "border-[#b99b64] bg-[#272219]"
                    : "border-[#343029] bg-[#1a1815]"
                }`}
              />
            ))}
          </div>

          {slots.map((slotIndex) => {
            const piece = pieces[slotIndex];
            const pieceRow = Math.floor(piece.correctIndex / PUZZLE_SIZE);
            const pieceCol = piece.correctIndex % PUZZLE_SIZE;
            const slotRow = Math.floor(slotIndex / PUZZLE_SIZE);
            const slotCol = slotIndex % PUZZLE_SIZE;
            const isKeyboardSelected = keyboardSelectedIndex === slotIndex;
            const isDragged = activeDragPieceId === piece.id;
            const isCorrectlyPlaced = piece.correctIndex === slotIndex;
            const isSnapped = isCorrectlyPlaced;
            const offset =
              isSnapped || solved
                ? { x: 0, y: 0, rotate: 0 }
                : scatter[piece.id];

            return (
              <button
                key={piece.id}
                ref={(element) => {
                  pieceRefs.current[slotIndex] = element;
                }}
                type="button"
                aria-label={`퍼즐 조각 ${piece.correctIndex + 1}`}
                aria-pressed={isKeyboardSelected || isDragged}
                onPointerDown={(event) =>
                  handlePointerDown(slotIndex, piece, event)
                }
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={() => {
                  dragRef.current = null;
                  setActiveDragPieceId(null);
                  setHoverSlotIndex(null);
                }}
                onKeyDown={(event) => handleKeyboardSwap(slotIndex, event)}
                className={`absolute cursor-grab overflow-visible border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-offset-[#11100f] focus-visible:outline-[#d5bd8a] active:cursor-grabbing ${
                  isDragged ? "" : "transition-transform duration-200"
                } ${
                  isKeyboardSelected
                    ? "ring-2 ring-[#b99b64] ring-offset-2 ring-offset-[#11100f]"
                    : ""
                }`}
                style={{
                  left: `${slotCol * (100 / PUZZLE_SIZE)}%`,
                  top: `${slotRow * (100 / PUZZLE_SIZE)}%`,
                  width: `${100 / PUZZLE_SIZE}%`,
                  height: `${100 / PUZZLE_SIZE}%`,
                  zIndex: isDragged ? 30 : 10 + piece.id,
                  transform: isDragged
                    ? undefined // handlePointerMove에서 직접 제어하므로 초기값은 비워둠
                    : `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${offset.rotate}deg) scale(${isSnapped ? 1 : 1})`,
                  willChange: isDragged ? "transform" : "auto", // 브라우저 최적화 힌트
                }}
              >
                <span
                  className={`absolute inset-0 bg-cover bg-no-repeat ${
                    isSnapped || solved
                      ? ""
                      : "drop-shadow-[0_8px_14px_rgba(0,0,0,0.35)]"
                  }`}
                  style={{
                    backgroundImage: `url(${invitation.puzzle.image})`,
                    backgroundSize: `${PUZZLE_SIZE * 100}% ${PUZZLE_SIZE * 100}%`,
                    backgroundPosition: `${(pieceCol / (PUZZLE_SIZE - 1)) * 100}% ${
                      (pieceRow / (PUZZLE_SIZE - 1)) * 100
                    }%`,
                    clipPath:
                      isDragged || isSnapped || solved
                        ? "none"
                        : "polygon(8% 8%, 38% 8%, 44% 0, 56% 0, 62% 8%, 92% 8%, 92% 38%, 100% 44%, 100% 56%, 92% 62%, 92% 92%, 62% 92%, 56% 100%, 44% 100%, 38% 92%, 8% 92%, 8% 62%, 0 56%, 0 44%, 8% 38%)",
                  }}
                />
                <span className="absolute right-2 top-2 z-10 grid h-6 w-6 place-items-center bg-[#b99b64] text-[11px] font-bold text-[#11100f]">
                  {piece.correctIndex + 1}
                </span>
              </button>
            );
          })}
        </div>

        <img
          src={invitation.puzzle.image}
          alt={invitation.puzzle.imageAlt}
          className="sr-only"
        />

        {solved ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-2 border-[#b99b64] bg-[#11100f] p-4 text-center text-[16px] font-bold tracking-widest text-[#b99b64]"
          >
            {invitation.puzzle.success}
          </motion.div>
        ) : null}
      </div>
    </ScreenShell>
  );
}
