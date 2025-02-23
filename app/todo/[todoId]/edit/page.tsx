import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/app/loading";
import TodoEdit from "@/components/todo/TodoEdit";

type TodoEditPageProps = {
  params: Promise<{
    todoId: string;
  }>;
};

const TodoEditPage = async ({ params }: TodoEditPageProps) => {
  const { todoId } = await params;
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  // Todo詳細取得
  const { data: todo } = await supabase
    .from("todos")
    .select("*")
    .eq("id", todoId)
    .single();

  if (!todo) {
    return <div className="text-center">todoが存在しません</div>;
  }

  // todo作成者とログインユーザーが一致しない場合
  if (todo.user_id !== user?.id) {
    redirect(`/todo/${todo.id}`);
  }

  return (
    <Suspense fallback={<Loading />}>
      <TodoEdit todo={todo} />
    </Suspense>
  );
};

export default TodoEditPage;
