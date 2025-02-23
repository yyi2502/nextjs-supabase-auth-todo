import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "todoApp",
  description: "Nextjs+supabase+auth",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;
  return (
    <html lang="ja">
      <body>
        <Toaster />
        <div className="flex min-h-screen flex-col">
          <Header user={user} />
          <main className="container max-w-2xl mx-auto px-5 flex-1 mt-10 mb-12">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
