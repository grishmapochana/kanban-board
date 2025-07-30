interface Board {
  name: string;
  columns: Column[];
  id: string;
}
// type ColumnProps = {
//   column: GetBoardsQuery["boards"][0]["columns"][0];
// };

// type CardProps = {
//   card: GetBoardsQuery["boards"][0]["columns"][0]["cards"][0];
// };

// type BoardProps = {
//   board: GetBoardsQuery["boards"][0];
// };

interface Column {
  id: Typed;
  name: string;
  position: number;
  cards: Card[];
}

interface Card {
  id: string;
  name: string;
  position: number;
  user?: User | null; // allow missing
}

interface User {
  id: string;
  displayName: string;
  avatarUrl: string;
}
