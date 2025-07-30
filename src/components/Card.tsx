import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EditCardDialog } from "./EditCardDailog";
import { DeleteCardDialog } from "./DeleteCardDialog";
import Image from "next/image";

export default function Card({
  card,
  isOverlay,
  boardId,
}: {
  card: Card;
  isOverlay?: boolean;
  boardId: string;
}) {
  const {
    attributes,
    listeners,
    transform,
    transition,
    setNodeRef,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <div className="bg-white/20 h-18 rounded p-3 mb-2 shadow "></div>;
  }
  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      {...(isOverlay ? {} : attributes)}
      {...(isOverlay ? {} : listeners)}
      style={style}
      className={`bg-white rounded p-3 mb-2 shadow text-sm ${
        isOverlay ? "opacity-80 scale-105" : ""
      }`}
    >
      <p>{card.name}</p>

      {card.user && (
        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex gap-2 items-center">
            {" "}
            {/* <img
              src={
                card.user.avatarUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${card.user.displayName}`
              }
              alt={card.user.displayName}
              className="w-6 h-6 rounded-full"
            /> */}
            <Image
              alt="avatarUrl"
              src={
                card.user.avatarUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${card.user.displayName}`
              }
              width={35}
              height={35}
              className="rounded-full"
            />
            <span>{card.user.displayName}</span>
          </div>
          <div className="mt-2 flex space-x-1">
            <EditCardDialog
              cardId={card.id}
              initialName={card.name}
              initialUserId={card.user.id}
              boardId={boardId}
            />
            <DeleteCardDialog cardId={card.id} boardId={boardId} />
          </div>
        </div>
      )}
    </div>
  );
}
