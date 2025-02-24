"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { ChevronRight, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import FormError from "@/components/auth/FormError";

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  // const [isPending, startTransition] = useTransition();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 送信
  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsPending(true);
    setError("");

    // startTransition(async () => {
    try {
      const res = await login({
        ...values,
      });

      if (res?.error) {
        setError(res.error);
        return;
      }

      toast.success("ログインしました");

      setIsPending(false);
      // router.push("/");
      // setTimeout(() => {
      //   router.refresh();
      // }, 3000); // 3000ms 後に refresh

      // router.push("/").then(() => {
      //   router.refresh();
      // });

      await router.push("/"); // router.push の完了を待つ
      router.refresh(); // ページ遷移完了後にリフレッシュ
    } catch (error) {
      console.error(error);
      setError("エラーが発生しました");
    }
    // });
  };
  return (
    <div className="p-5 rounded-xl border">
      <div className="text-xl font-bold text-center border-b border-black pb-5 mb-5 mt-3">
        ログインすると使用できます
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">メールアドレス</FormLabel>
                <FormControl>
                  <Input
                    className="placeholder:text-gray-400"
                    placeholder="abc@xxxxx.com"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">パスワード</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="placeholder:text-gray-400"
                      type={passwordVisibility ? "text" : "password"}
                      placeholder="********"
                      {...field}
                      disabled={isPending}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex cursor-pointer items-center p-3 text-muted-foreground"
                      onClick={() => setPasswordVisibility(!passwordVisibility)}
                    >
                      {passwordVisibility ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </div>
                  </div>
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
              <span>ログイン</span>
            </Button>
          </div>
        </form>
      </Form>

      <div className="text-center mt-5 space-y-2">
        <div>
          <Link href="/signup" className="text-sm text-primary font-bold">
            アカウント登録はこちら
            <ChevronRight className="w-4 h-4 inline align-text-bottom" />
          </Link>
        </div>
      </div>
    </div>
  );
}
