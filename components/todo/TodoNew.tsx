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
import { TodoSchema } from "@/schemas";
import { newTodo } from "@/actions/todo";
import { toast } from "sonner";

const TodoNew = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof TodoSchema>>({
    resolver: zodResolver(TodoSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // 送信
  const onSubmit = (values: z.infer<typeof TodoSchema>) => {
    setError("");

    startTransition(async () => {
      try {
        const res = await newTodo({
          ...values,
          userId,
        });

        if (res?.error) {
          setError(res.error);
          return;
        }

        toast.success("todoを追加しました");
        router.push("/");
        router.refresh();
      } catch (error) {
        console.error(error);
        setError("エラーが発生しました");
      }
    });
  };

  return (
    <div className="mx-auto max-w-screen-md">
      <div className="font-bold text-xl text-center mb-10">todo追加</div>

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
                <FormMessage className="text-red-500" />
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
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="space-y-4 w-full">
            <FormError message={error} />

            <Button
              variant="default"
              type="submit"
              className="w-full space-x-2 font-bold"
              disabled={isPending}
            >
              {isPending && <Loader2 className="animate-spin" />}
              <span>追加</span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TodoNew;
