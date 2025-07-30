// src/components/DeleteCardDialog.tsx
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteCardMutation, GetBoardDocument } from "@/gql/generated";
import { Trash2 } from "lucide-react";

export function DeleteCardDialog({
  cardId,
  boardId,
}: {
  cardId: string;
  boardId: string;
}) {
  const [open, setOpen] = useState(false);
  const [deleteCard, { loading }] = useDeleteCardMutation({
    refetchQueries: [{ query: GetBoardDocument, variables: { id: boardId } }],
  });

  const onDelete = async () => {
    await deleteCard({ variables: { id: cardId } });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Card</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the card. Continue?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={loading}>
            {loading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
