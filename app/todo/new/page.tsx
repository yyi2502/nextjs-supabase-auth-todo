import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import Loading from "@/app/loading";
import TodoNew from "@/components/todo/TodoNew";

const TodoNewPage = async () => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  return (
    <Suspense fallback={<Loading />}>
      {user ? <TodoNew userId={user.id} /> : <div>ログインしてください</div>}
    </Suspense>
  );
};

export default TodoNewPage;
