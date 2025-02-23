"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteTodo } from "@/actions/todo";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type TodoDeleteButtonProps = {
  id: string;
};

const TodoDeleteButton = ({ id }: TodoDeleteButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) {
      return;
    }

    startTransition(async () => {
      try {
        const res = await deleteTodo(id);

        if (res?.error) {
          toast.error(res.error);
          return;
        }

        toast.success("todoを削除しました");
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("エラーが発生しました");
      }
    });
  };

  return (
    <button
      className="cursor-pointer"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin text-red-700" />
      ) : (
        <Trash2 className="w-5 h-5 text-red-700 hover:opacity-70" />
      )}
    </button>
  );
};

export default TodoDeleteButton;
