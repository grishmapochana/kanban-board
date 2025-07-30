import React, { useId, useMemo } from "react";
import Card from "./Card";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditColumnDialog } from "./EditColumnDialog";
import { DeleteColumnDialog } from "./DeleteColumnDialog";
import { CreateCardDialog } from "./CreateCardDialog";

function Column({ column, isOverlay, boardId }: any) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: column.id,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  if (isDragging) {
    return (
      <div className="p-4 w-full max-h-[500px] rounded-md shadow cursor-grab bg-white/30 flex flex-col "></div>
    );
  }

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      style={style}
      className={`p-4 mt-10 w-full max-h-fit rounded-md shadow cursor-grab bg-red-500/20 flex flex-col ${
        isOverlay ? "opacity-80 scale-105" : ""
      }`}
    >
      <div className="flex gap-4 items-center justify-center mb-2 text-white">
        <h2 className="font-bold text-xl text-white  flex-1">{column.name}</h2>
        <EditColumnDialog
          columnId={column.id}
          initialName={column.title}
          boardId={boardId}
        />
        <DeleteColumnDialog columnId={column.id} boardId={boardId} />
        <p className="text-center px-2 py-1 rounded font-bold bg-red-600/20">
          {column.cards.length}
        </p>
      </div>

      <div className="flex-1">
        <SortableContext
          items={column.cards.map((c: any) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.length > 0 ? (
            column.cards.map((card: any) => (
              <Card key={card.id} card={card} boardId={boardId} />
            ))
          ) : (
            <div className="text-white h-10 rounded flex items-center justify-center text-xs">
              Drop here
            </div>
          )}
        </SortableContext>
      </div>
      <div>
        <div className="mt-4 text-end">
          <CreateCardDialog
            columnId={column.id}
            boardId={boardId}
            columnCards={column.cards}
          />
        </div>
      </div>
    </div>
  );
}

export default Column;
