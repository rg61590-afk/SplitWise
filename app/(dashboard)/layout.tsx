import { redirect } from "next/navigation";
import { Manrope, Space_Grotesk } from "next/font/google";
import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-dashboard-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-dashboard-display",
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div
      className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen bg-[linear-gradient(180deg,#f8fcf6_0%,#eef8f2_42%,#ffffff_100%)] text-foreground`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10rem] top-[-5rem] h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-[-8rem] top-24 h-[28rem] w-[28rem] rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,white,transparent_88%)]" />
      </div>

      <DashboardSidebar user={session.user} />
      <div className="flex flex-1 flex-col lg:pl-64">
        <DashboardHeader user={session.user} />
        <main className="flex-1 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-10 lg:pt-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
