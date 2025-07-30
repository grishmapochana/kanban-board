import { getCardsGroupedByColumn } from "@/lib/api/api";
import { create } from "zustand";

interface BoardState {
  board: Board;
  setBoard: (board: Board) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  setBoard: (board) => set({ board }),
}));
