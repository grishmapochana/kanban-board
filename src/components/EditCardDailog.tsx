// src/components/EditCardDialog.tsx
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
  useGetUsersQuery,
  useUpdateCardMutation,
  GetBoardDocument,
} from "@/gql/generated";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Edit2 } from "lucide-react";

export function EditCardDialog({
  cardId,
  initialName,
  initialUserId,
  boardId,
}: {
  cardId: string;
  initialName: string;
  initialUserId: string;
  boardId: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [userId, setUserId] = useState(initialUserId);

  const { data: usersData, loading: usersLoading } = useGetUsersQuery();

  console.log({ usersData });

  const [updateCard, { loading }] = useUpdateCardMutation({
    refetchQueries: [{ query: GetBoardDocument, variables: { id: boardId } }],
  });

  const onSave = async () => {
    if (!name.trim() || !userId) return;
    await updateCard({ variables: { id: cardId, name, userId } });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Edit2 className="h-4 w-4 outline-none" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Card</DialogTitle>
        </DialogHeader>

        {/* Name = card content */}
        <Input
          className="mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Card title"
        />

        <Select
          value={userId}
          onValueChange={setUserId}
          disabled={usersLoading}
        >
          <SelectTrigger>
            <SelectValue
              placeholder={usersLoading ? "Loading users…" : "Assigned to"}
            />
          </SelectTrigger>
          <SelectContent>
            {usersData?.users.map((u: any) => (
              <SelectItem key={u.id} value={u.id}>
                {u.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter className="space-x-2">
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
