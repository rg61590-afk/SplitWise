import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Compass, Sparkles, Wallet } from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-notfound-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-notfound-display",
});

export default function NotFound() {
  return (
    <main
      className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fbfdf7_0%,#eef8f2_45%,#ffffff_100%)] text-foreground`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8rem] top-10 h-80 w-80 rounded-full bg-emerald-300/18 blur-3xl" />
        <div className="absolute right-[-7rem] top-24 h-96 w-96 rounded-full bg-amber-200/22 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,white,transparent_88%)]" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-12 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <section className="max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1a9c66,#79d78b)] text-white shadow-[0_16px_40px_-18px_rgba(26,156,102,0.9)]">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p
                  className="text-xl font-semibold tracking-tight text-slate-950"
                  style={{ fontFamily: "var(--font-notfound-display)" }}
                >
                  SplitEase
                </p>
                <p className="text-sm text-slate-500">Shared money, finally calm</p>
              </div>
            </Link>

            <div className="mt-10 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/80 px-4 py-2 text-sm text-emerald-900 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Custom 404 experience
            </div>

            <p
              className="mt-8 text-7xl font-semibold leading-none tracking-[-0.06em] text-slate-950 md:text-8xl"
              style={{ fontFamily: "var(--font-notfound-display)" }}
            >
              404
            </p>
            <h1
              className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 md:text-6xl"
              style={{ fontFamily: "var(--font-notfound-display)" }}
            >
              This page took a wrong turn.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              The page you were looking for does not exist, may have moved, or
              the link was incomplete. Let’s get you back to somewhere useful.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-[52px] rounded-full bg-emerald-600 px-7 text-base shadow-[0_22px_45px_-20px_rgba(5,150,105,0.85)] hover:bg-emerald-700"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" />
                  Back home
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-[52px] rounded-full border-slate-200 bg-white/80 px-7 text-base backdrop-blur hover:bg-white"
              >
                <Link href="/dashboard">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </section>

          <section>
            <Card className="overflow-hidden rounded-[2rem] border-white/80 bg-white/85 p-0 shadow-[0_35px_120px_-55px_rgba(15,23,42,0.35)] backdrop-blur-xl">
              <CardContent className="p-6 md:p-7">
                <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#0f172a,#1e293b)] p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Navigation assist</p>
                      <p
                        className="mt-2 text-3xl font-semibold tracking-[-0.03em]"
                        style={{ fontFamily: "var(--font-notfound-display)" }}
                      >
                        Where to next?
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white/10 p-3">
                      <Compass className="h-6 w-6 text-emerald-300" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4">
                  {[
                    {
                      title: "Landing page",
                      description: "Go back to the public homepage and start over.",
                      href: "/",
                    },
                    {
                      title: "Dashboard",
                      description: "Jump into your workspace if you are already signed in.",
                      href: "/dashboard",
                    },
                    {
                      title: "Groups",
                      description: "Review your shared circles and active expense spaces.",
                      href: "/groups",
                    },
                  ].map((item) => (
                    <Link key={item.title} href={item.href}>
                      <div className="group rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 p-4 transition-all hover:-translate-y-0.5 hover:bg-white">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-lg font-semibold text-slate-950">
                              {item.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {item.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
