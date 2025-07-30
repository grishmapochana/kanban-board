"use client";

import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import {
  useAddColumnMutation,
  useGetBoardQuery,
  useUpdateCardPositionMutation,
  useUpdateColumnPositionMutation,
} from "@/gql/generated";

import Column from "./Column";
import Card from "./Card";

import CreateColumnDialog from "./CreateColumnDialog";

export default function Board({ activeBoardId }: { activeBoardId: string }) {
  const [columns, setColumns] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"column" | "card" | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const isUpdatingRef = useRef(false);

  const { data, loading, error, refetch } = useGetBoardQuery({
    skip: !activeBoardId,
    variables: { id: activeBoardId },
  });

  const [updateColumnPosition] = useUpdateColumnPositionMutation();
  const [updateCardPosition] = useUpdateCardPositionMutation();
  const [createColumn] = useAddColumnMutation(); // Your Hasura mutation

  useEffect(() => {
    if (!isUpdatingRef.current && data?.boards[0]?.columns) {
      // const dbCols = data.boards[0].columns;
      // const sameOrder =
      //   dbCols.map((c: any) => c.id).join(",") ===
      //   columns.map((c: any) => c.id).join(",");
      // if (!sameOrder) setColumns(dbCols);
      setColumns(data?.boards[0]?.columns);
    }
  }, [data]);

  if (loading) return <p>Loading board…</p>;
  if (error) return <p>{error.message}</p>;
  if (!data?.boards[0]) return <p>No board found</p>;

  const handleDragStart = (event: any) => {
    const { active } = event;
    const isColumn = columns.some((col) => col.id === active.id);
    const isCard = columns.some((col) =>
      col.cards.some((card: any) => card.id === active.id)
    );
    setActiveType(isColumn ? "column" : isCard ? "card" : null);
    setActiveId(active.id);
  };

  function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    isUpdatingRef.current = true;

    if (activeType === "column") {
      const oldIndex = columns.findIndex((col) => col.id === active.id);
      const newIndex = columns.findIndex((col) => col.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const newCols = arrayMove(columns, oldIndex, newIndex);
      setColumns(newCols);

      await Promise.all(
        newCols.map((col, idx) =>
          updateColumnPosition({
            variables: { id: col.id, position: idx },
            optimisticResponse: {
              update_columns_by_pk: {
                id: col.id,
                position: idx,
                __typename: "columns",
              },
            },
          })
        )
      );
    }

    if (activeType === "card") {
      const newCols = [...columns];
      const sourceCol = newCols.find((col) =>
        col.cards.some((card: any) => card.id === active.id)
      );
      let destCol = newCols.find((col) =>
        col.cards.some((card: any) => card.id === over.id)
      );
      if (!destCol) destCol = newCols.find((col) => col.id === over.id);
      if (!sourceCol || !destCol) return;

      if (sourceCol.id === destCol.id) {
        const reorderCards = reorder(
          sourceCol.cards,
          active.data.current.sortable.index,
          over.data.current.sortable.index
        );
        const updated = reorderCards.map((card: any, idx) => ({
          ...card,
          position: idx,
        }));
        const updatedCols = newCols.map((col) =>
          col.id === sourceCol.id ? { ...col, cards: updated } : col
        );
        setColumns(updatedCols);

        await Promise.all(
          updated.map((card) =>
            updateCardPosition({
              variables: {
                id: card.id,
                column_id: sourceCol.id,
                position: card.position,
              },
              optimisticResponse: {
                update_cards_by_pk: {
                  id: card.id,
                  column_id: sourceCol.id,
                  position: card.position,
                  __typename: "cards",
                },
              },
            })
          )
        );
      } else {
        const sourceCards = [...sourceCol.cards];
        const destCards = [...destCol.cards];
        const [movedCard] = sourceCards.splice(
          active.data.current.sortable.index,
          1
        );
        destCards.splice(over.data.current.sortable.index, 0, {
          ...movedCard,
        });

        const updatedSrc = sourceCards.map((card, idx) => ({
          ...card,
          position: idx,
        }));
        const updatedDst = destCards.map((card, idx) => ({
          ...card,
          position: idx,
        }));

        const updatedCols = newCols.map((col) => {
          if (col.id === sourceCol.id) return { ...col, cards: updatedSrc };
          if (col.id === destCol.id) return { ...col, cards: updatedDst };
          return col;
        });

        setColumns(updatedCols);

        await Promise.all([
          ...updatedSrc.map((card) =>
            updateCardPosition({
              variables: {
                id: card.id,
                column_id: sourceCol.id,
                position: card.position,
              },
              optimisticResponse: {
                update_cards_by_pk: {
                  id: card.id,
                  column_id: sourceCol.id,
                  position: card.position,
                  __typename: "cards",
                },
              },
            })
          ),
          ...updatedDst.map((card) =>
            updateCardPosition({
              variables: {
                id: card.id,
                column_id: destCol.id,
                position: card.position,
              },
              optimisticResponse: {
                update_cards_by_pk: {
                  id: card.id,
                  column_id: destCol.id,
                  position: card.position,
                  __typename: "cards",
                },
              },
            })
          ),
        ]);
      }
    }

    setActiveId(null);
    setActiveType(null);
    isUpdatingRef.current = false;
    await refetch();
  };

  const handleAddColumn = async (name: string) => {
    const position = columns.length; // or use max + 1 if using floats
    await createColumn({
      variables: {
        name,
        position,
        board_id: activeBoardId,
      },
    });

    await refetch(); // to update board
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((col) => col.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex justify-center items-center">
          <div className="w-full mx-5 lg:mx-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => (
              <Column key={column.id} column={column} boardId={activeBoardId} />
            ))}
            <CreateColumnDialog onCreate={handleAddColumn} />
          </div>
        </div>
      </SortableContext>
      <DragOverlay>
        {activeId && activeType === "column" && (
          <Column
            column={columns.find((col) => col.id === activeId)}
            isOverlay
          />
        )}
        {activeId &&
          activeType === "card" &&
          (() => {
            const card = columns
              .flatMap((col) => col.cards)
              .find((card) => card.id === activeId);
            return card ? <Card card={card} isOverlay /> : null;
          })()}
      </DragOverlay>
    </DndContext>
  );
}
