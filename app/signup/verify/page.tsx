"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const SignupVerifyPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.refresh(); //ユーザーの認証状態を Next.js に反映させる
  }, [router]);

  return (
    <div className="p-5 rounded-xl border">
      <div className="text-xl font-bold text-center border-b border-black pb-5 mb-5 mt-3">
        アカウント本登録完了
      </div>

      <div className="text-sm text-center mb-5">
        アカウント本登録が完了しました。
      </div>

      <Button asChild className="w-full">
        <Link href="/">トップページ</Link>
      </Button>
    </div>
  );
};

export default SignupVerifyPage;
