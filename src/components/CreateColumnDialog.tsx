"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function CreateColumnDialog({
  onCreate,
}: {
  onCreate: (title: string) => void;
}) {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim());
      setName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full cursor-pointer">
          + Add Column
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Column</DialogTitle>
          <DialogDescription>
            Give your column a name to get started.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Column title"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
