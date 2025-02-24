"use client";
import { Suspense, useState, useEffect, useCallback } from "react";
import Loading from "./loading";
import { getTodos } from "@/actions/todo";
import TodoItem from "@/components/todo/TodoItem";
import { TodoType } from "@/types";

export type TodosType = TodoType & {
  profiles: Promise<{
    name: string;
  }>;
};

export default function Home() {
  const [todos, setTodos] = useState<TodosType[]>([]);
  const [filter, setFilter] = useState("all"); // "all", "completed", "incomplete"
  const [loading, setLoading] = useState(true);

  // TODOリストを取得する関数
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const { todos, error } = await getTodos(filter);
    if (!error) {
      setTodos(todos);
    }
    setLoading(false);
  }, [filter]);

  // フィルタ変更時にデータを取得
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <>
      <div className="flex justify-end space-x-4 mb-4 text-sm">
        <button
          className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("all")}
        >
          すべて
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === "completed" ? "bg-green-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("completed")}
        >
          完了
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === "incomplete" ? "bg-red-500 text-white" : "bg-gray-200"}`}
          onClick={() => setFilter("incomplete")}
        >
          未完了
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : todos.length === 0 ? (
        <div className="text-center text-gray-500">TODOがありません！</div>
      ) : (
        <Suspense fallback={<Loading />}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </Suspense>
      )}
    </>
  );
}

// import { Suspense } from "react";
// import Loading from "./loading";
// import { getAllTodos } from "@/actions/todo";
// import TodoItem from "@/components/todo/TodoItem";

// export default async function Home() {
//   const { todos, error } = await getAllTodos();

//   if (!todos || todos.length === 0 || error) {
//     return <div className="text-center">TODOがありません</div>;
//   }

//   return (
//     <div className="flex justify-end space-x-4 mb-4 text-sm">

//       <Suspense fallback={<Loading />}>
//         {todos.map((todo) => {
//           return <TodoItem key={todo.id} todo={todo} />;
//         })}
//       </Suspense>
//     </div>
//   );
// }
