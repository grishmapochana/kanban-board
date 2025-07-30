"use client";

import { useGetBoardsQuery } from "@/gql/generated";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function BoardList({
  activeBoardId,
  setActiveBoardId,
}: {
  activeBoardId: string;
  setActiveBoardId: (id: string) => void;
}) {
  const { data, loading, error } = useGetBoardsQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      {/* <select
        
        onChange={(e) => setActiveBoardId(e.target.value)}
        className="outline-none"
      >
        {data?.boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
      </select> */}
      <Select
        value={activeBoardId}
        onValueChange={setActiveBoardId}
        disabled={loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading && "loading.."} />
        </SelectTrigger>
        <SelectContent>
          {data?.boards.map((board) => (
            <SelectItem key={board.id} value={board.id}>
              {board.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
