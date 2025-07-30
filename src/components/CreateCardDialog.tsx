// src/components/CreateCardDialog.tsx
import { useGetUsersQuery } from "@/gql/generated";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateCardMutation, GetBoardDocument } from "@/gql/generated";

export function CreateCardDialog({
  columnId,
  boardId,
  columnCards,
}: {
  columnId: string;
  boardId: string;
  columnCards: Card[];
}) {
  // 1. Load users
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useGetUsersQuery();

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const [createCard, { loading }] = useCreateCardMutation({
    refetchQueries: [{ query: GetBoardDocument, variables: { id: boardId } }],
  });

  const computeNextPosition = (cards: { position: number }[]) =>
    cards.length ? Math.max(...cards.map((c) => c.position)) + 1 : 0;

  const onCreate = async () => {
    if (!name.trim() || !selectedUserId) return;
    const position = computeNextPosition(columnCards);
    await createCard({
      variables: { columnId, name, userId: selectedUserId, position },
    });
    setName("");
    setSelectedUserId(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          Add card
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Card</DialogTitle>
        </DialogHeader>

        <Select
          value={selectedUserId}
          onValueChange={setSelectedUserId}
          disabled={usersLoading}
        >
          <SelectTrigger className="w-full mb-2">
            <SelectValue
              placeholder={usersLoading ? "Loading users…" : "Select user"}
            />
          </SelectTrigger>
          <SelectContent>
            {usersError && (
              <SelectItem value="">Error loading users</SelectItem>
            )}
            {usersData?.users.map((u: User) => (
              <SelectItem key={u.id} value={u.id}>
                {u.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          onChange={(e) => setName(e.target.value)}
          placeholder="Card content"
        />

        <DialogFooter className="mt-4 space-x-2">
          <Button onClick={onCreate} disabled={loading || !selectedUserId}>
            {loading ? "Adding…" : "Add Card"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
