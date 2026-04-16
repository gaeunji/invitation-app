export type PuzzlePiece = {
  id: number;
  correctIndex: number;
};

export function createSolvedPieces(size: number): PuzzlePiece[] {
  return Array.from({ length: size * size }, (_, index) => ({
    id: index,
    correctIndex: index,
  }));
}

export function createStarterPieces(size: number): PuzzlePiece[] {
  const pieces = createSolvedPieces(size);
  if (pieces.length !== 9) {
    return pieces;
  }

  const starterOrder = [4, 0, 7, 2, 8, 1, 6, 3, 5];
  return starterOrder.map((pieceIndex) => pieces[pieceIndex]);
}

export function swapPieces(pieces: PuzzlePiece[], firstIndex: number, secondIndex: number) {
  const next = [...pieces];
  [next[firstIndex], next[secondIndex]] = [next[secondIndex], next[firstIndex]];
  return next;
}

export function isPuzzleSolved(pieces: PuzzlePiece[]) {
  return pieces.every((piece, index) => piece.correctIndex === index);
}
