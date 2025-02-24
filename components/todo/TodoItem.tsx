"use client";
import Link from "next/link";
import { TodoType } from "@/types";
import { StickyNote } from "lucide-react";
import TodoCompletedButton from "./TodoCompletedButton";
import TodoDeleteButton from "./TodoDeleteButton";

type TodoItemProps = {
  todo: TodoType & {
    profiles: Promise<{
      name: string;
    }>;
  };
};

const TodoItem = ({ todo }: TodoItemProps) => {
  return (
    <>
      <Link
        href={`todo/${todo.id}`}
        className="flex w-full items-center space-x-4 px-3 py-4 border-b hover:bg-gray-50 transition"
      >
        <TodoCompletedButton id={todo.id} completed={todo.completed} />

        <div className={`flex-1 ${todo.completed ? "line-through" : ""}`}>
          <div className="font-bold">{todo.title}</div>
          {todo.content && <StickyNote className="w-4 h-4 text-gray-700" />}
        </div>

        <TodoDeleteButton id={todo.id} />
      </Link>
    </>
  );
};

export default TodoItem;
