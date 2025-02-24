"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { changeCompleted } from "@/actions/todo";
import { Loader2, Square, SquareCheckBig } from "lucide-react";
import { toast } from "sonner";

type TodoCompletedButtonProps = {
  id: string;
  completed: boolean;
};

const TodoCompletedButton = ({ id, completed }: TodoCompletedButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [localCompleted, setLocalCompleted] = useState(completed);

  const handleCompleted = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // UIを即時反映
    setLocalCompleted((prev) => !prev);

    startTransition(async () => {
      try {
        const res = await changeCompleted({
          todoId: id,
          completed: !completed,
        });
        if (res?.error) {
          toast.error(res.error);
          return;
        }

        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("エラーが発生しました");
        setLocalCompleted(completed); // エラー時に元の状態に戻す
      }
    });
  };

  return (
    <>
      <button
        className="w-5 h-5 hover:opacity-70"
        onClick={handleCompleted}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
        ) : localCompleted ? (
          <SquareCheckBig className="w-5 h-5 text-green-700" />
        ) : (
          <Square className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </>
  );
};

export default TodoCompletedButton;
