import { Logo } from "@/components/site/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-navy-50">
      <div className="border-b border-slate-200 bg-white py-5">
        <div className="container-cdf">
          <Logo />
        </div>
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>
    </div>
  );
}
