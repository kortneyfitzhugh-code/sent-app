import { SentMark } from "@/components/SentMark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-6 md:px-12 md:py-8">
        <SentMark />
      </header>
      <main className="flex-1 px-6 pb-16 md:px-12 flex justify-center">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
