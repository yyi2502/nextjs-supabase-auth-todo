import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/app/loading";
import TodoDetail from "@/components/todo/TodoDetail";

type TodoDetailPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

const TodoDetailPage = async ({ params }: TodoDetailPageProps) => {
  const { todoId } = await params;
  const supabase = await createClient();

  // Todo詳細取得
  const { data: todo } = await supabase
    .from("todos")
    .select(
      `
      *,
      user_id,
      profiles (
        name
      )
    `
    )
    .eq("id", todoId)
    .single();

  if (!todo) {
    return <div className="text-center">todoが存在しません</div>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <TodoDetail todo={todo} />
    </Suspense>
  );
};

export default TodoDetailPage;
