"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import FormError from "@/components/auth/FormError";
import { TodoType } from "@/types";
import { TodoSchema } from "@/schemas";
import { editTodo } from "@/actions/todo";
import { toast } from "sonner";

type TodoEditProps = {
  todo: TodoType;
};

const TodoEdit = ({ todo }: TodoEditProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof TodoSchema>>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      title: todo.title,
      content: todo.content,
    },
  });

  // 送信
  const onSubmit = (values: z.infer<typeof TodoSchema>) => {
    setError("");

    startTransition(async () => {
      try {
        const res = await editTodo({
          ...values,
          todoId: todo.id,
          userId: todo.user_id,
        });

        if (res?.error) {
          setError(res.error);
          return;
        }

        toast.success("todoを編集しました");
        router.push(`/todo/${todo.id}`);
        router.refresh();
      } catch (error) {
        console.error(error);
        setError("エラーが発生しました");
      }
    });
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <div className="font-bold text-xl text-center mb-10">todo編集</div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">todo</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">詳細（任意）</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder=""
                    rows={5}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 w-full">
            <FormError message={error} />

            <Button
              type="submit"
              className="w-full space-x-2 font-bold"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              <span>保存</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TodoEdit;
