// components/EditColumnDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  useUpdateColumnMutation,
  GetBoardDocument,
  useGetBoardQuery,
} from "@/gql/generated";
import Edit from "./icons/Edit";
import { Edit2 } from "lucide-react";

export function EditColumnDialog({
  columnId,
  initialName,
  boardId,
}: {
  columnId: string;
  initialName: string;
  boardId: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);

  const [updateColumn, { loading }] = useUpdateColumnMutation({
    refetchQueries: [{ query: GetBoardDocument, variables: { id: boardId } }],
  });

  const onSave = async () => {
    if (!name.trim()) return;
    await updateColumn({ variables: { id: columnId, name } });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        className="cursor-pointer"
        variant="ghost"
        size="default"
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation(); // ← Prevent dnd-kit from seeing this click
          setOpen(true);
        }}
      >
        <Edit2 />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
        </DialogHeader>
        <Input
          onChange={(e) => setName(e.target.value)}
          placeholder="New column Name"
        />
        <DialogFooter className="mt-4 space-x-2">
          <Button
            variant="secondary"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={onSave} disabled={loading}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
