// src/components/DeleteColumnDialog.tsx
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
import { useDeleteColumnMutation, GetBoardDocument } from "@/gql/generated";
import { Trash2 } from "lucide-react";

export function DeleteColumnDialog({
  columnId,
  boardId,
}: {
  columnId: string;
  boardId: string;
}) {
  const [open, setOpen] = useState(false);
  const [deleteColumn, { loading, error }] = useDeleteColumnMutation({
    refetchQueries: [{ query: GetBoardDocument, variables: { id: boardId } }],
  });

  const onDelete = async () => {
    await deleteColumn({ variables: { id: columnId } });
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className="cursor-pointer"
          variant="ghost"
          size="sm"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Column</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the column and all its cards. Are you
            sure?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
