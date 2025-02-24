import Link from "next/link";
import { TodoType } from "@/types";
import { FilePenLine } from "lucide-react";
import TodoCompletedButton from "./TodoCompletedButton";
import TodoDeleteButton from "./TodoDeleteButton";

type TodoDetailProps = {
  todo: TodoType & {
    profiles: {
      name: string;
    };
  };
};

const TodoDetail = ({ todo }: TodoDetailProps) => {
  return (
    <>
      <div className="text-sm text-gray-500 text-right">
        作成者：{todo.profiles.name}
      </div>
      <div className="flex w-full items-center gap-4">
        <TodoCompletedButton id={todo.id} completed={todo.completed} />

        <div className="flex-1">
          <div className="font-bold text-2xl">{todo.title}</div>
          {todo.content && (
            <div className="leading-relaxed break-words whitespace-pre-wrap mt-4">
              {todo.content}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 mt-3">
        <Link href={`/todo/${todo.id}/edit`}>
          <FilePenLine className="w-5 h-5" />
        </Link>
        <TodoDeleteButton id={todo.id} />
      </div>
    </>
  );
};

export default TodoDetail;
