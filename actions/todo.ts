"use server";

import { TodoSchema } from "@/schemas";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

type newTodoProps = z.infer<typeof TodoSchema> & {
  userId: string;
};

// todo追加
export const newTodo = async (values: newTodoProps) => {
  try {
    const supabase = await createClient();

    const { error: insertError } = await supabase.from("todos").insert({
      title: values.title,
      content: values.content,
      user_id: values.userId,
    });

    // エラーチェック
    if (insertError) {
      return { error: insertError.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};

interface editTodoProps extends z.infer<typeof TodoSchema> {
  todoId: string;
  userId: string;
}

// todo編集
export const editTodo = async (values: editTodoProps) => {
  try {
    const supabase = await createClient();

    const { error: updateError } = await supabase
      .from("todos")
      .update({
        title: values.title,
        content: values.content,
      })
      .eq("id", values.todoId);

    // エラーチェック
    if (updateError) {
      return { error: updateError.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};

// todo削除
export const deleteTodo = async (todoId: string) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("todos").delete().eq("id", todoId);

    if (error) {
      return { error: error.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};

type changeCompletedProps = {
  todoId: string;
  completed: boolean;
};

// todo完了未完了の切り替え
export const changeCompleted = async ({
  todoId,
  completed,
}: changeCompletedProps) => {
  try {
    const supabase = await createClient();

    const { error: changeCompletedError } = await supabase
      .from("todos")
      .update({
        completed: completed,
      })
      .eq("id", todoId);

    // エラーチェック
    if (changeCompletedError) {
      return { error: changeCompletedError.message };
    }
  } catch (err) {
    console.error(err);
    return { error: "エラーが発生しました" };
  }
};

// export const getAllTodos = async () => {
//   try {
//     const supabase = await createClient();

//     const { data } = await supabase.auth.getUser();
//     const userId = data?.user?.id;

//     const { data: todos, error: getAllTodosError } = await supabase
//       .from("todos")
//       .select(
//         `
//         *,
//         profiles (
//           name
//         )
//       `
//       )
//       .eq("user_id", userId)
//       .order("updated_at", { ascending: false });

//     // エラーチェック
//     if (getAllTodosError) {
//       console.error("getAllTodosError:", getAllTodosError);
//       return { todos: [], error: getAllTodosError.message };
//     }
//     return { todos: todos || [], error: null }; // todosがnullの場合に空配列を返す
//   } catch (err) {
//     console.error("getAllTodos catch error:", err);
//     return { todos: [], error: "エラーが発生しました" };
//   }
// };

export const getTodos = async (filter = "all") => {
  try {
    const supabase = await createClient();

    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    let query = supabase
      .from("todos")
      .select(
        `
        *,
        profiles (
          name
        )
      `
      )
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });

    // フィルタ適用
    if (filter === "completed") {
      query = query.eq("completed", true);
    } else if (filter === "incomplete") {
      query = query.eq("completed", false);
    }
    const { data: todos, error } = await query;

    if (error) {
      console.error("getAllTodosError:", error);
      return { todos: [], error: error.message };
    }

    return { todos: todos || [], error: null };
  } catch (err) {
    console.error("getAllTodos catch error:", err);
    return { todos: [], error: "エラーが発生しました" };
  }
};
