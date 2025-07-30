"use client";
import Board from "@/components/Board";
import Header from "@/components/Header";
import { useGetBoardsQuery } from "@/gql/generated";
import { useEffect, useState } from "react";

export default function Home() {
  const { data, loading, error } = useGetBoardsQuery();
  const [activeBoardId, setActiveBoardId] = useState<string>("");

  // Auto-select first board when loaded
  useEffect(() => {
    if (data?.boards?.length && !activeBoardId) {
      setActiveBoardId(data.boards[0].id);
    }
  }, [data, activeBoardId]);

  return (
    <main className="h-screen w-full ">
      <Header
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
      />

      {activeBoardId ? (
        <Board activeBoardId={activeBoardId} />
      ) : (
        <p className="p-4">Please select a board!</p>
      )}
    </main>
  );
}
