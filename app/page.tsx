import { Suspense } from "react";
import Loading from "./loading";
import { getAllTodos } from "@/actions/todo";
import TodoItem from "@/components/todo/TodoItem";

export default async function Home() {
  const { todos, error } = await getAllTodos();

  if (!todos || todos.length === 0 || error) {
    return <div className="text-center">TODOがありません</div>;
  }

  return (
    <>
      {/* <div className="flex justify-center space-x-4 mb-4"> */}

      <Suspense fallback={<Loading />}>
        {todos.map((todo) => {
          return <TodoItem key={todo.id} todo={todo} />;
        })}
      </Suspense>
    </>
  );
}
