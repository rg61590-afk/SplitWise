import Link from "next/link";
import { Manrope, Space_Grotesk } from "next/font/google";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Landmark,
  ReceiptText,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-landing-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-landing-display",
});

const scenarios = [
  {
    title: "Roommates",
    description:
      "Utilities, groceries, and surprise takeout runs all stay organized in one place.",
    accent: "from-emerald-400/30 to-lime-300/20",
  },
  {
    title: "Trips",
    description:
      "Track cabs, hotels, and coffee stops without turning the group chat into accounting.",
    accent: "from-amber-300/30 to-orange-300/20",
  },
  {
    title: "Teams",
    description:
      "Shared subscriptions, event budgets, and reimbursements stay transparent for everyone.",
    accent: "from-sky-400/30 to-cyan-300/20",
  },
];

const features = [
  {
    icon: ReceiptText,
    title: "Fast expense capture",
    description:
      "Log who paid, what it was for, and how to split it in a few taps.",
  },
  {
    icon: TrendingUp,
    title: "Instant balance clarity",
    description:
      "See who owes whom right away, without spreadsheet cleanup or manual math.",
  },
  {
    icon: Landmark,
    title: "Simple settlements",
    description:
      "Turn messy chains of debt into clean, minimal payback actions.",
  },
];

const metrics = [
  { label: "Groups feel organized", value: "3x faster" },
  { label: "Average split setup", value: "< 60 sec" },
  { label: "Balance confusion", value: "Near zero" },
];

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <main
      className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fbfdf7_0%,#f4fbf5_42%,#ffffff_100%)] text-foreground`}
    >
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(68,171,110,0.18),transparent_58%)]" />
        <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-32 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,24,40,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,24,40,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,white,transparent_85%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1a9c66,#79d78b)] text-white shadow-[0_16px_40px_-18px_rgba(26,156,102,0.9)]">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p
                className="text-lg font-semibold tracking-tight"
                style={{ fontFamily: "var(--font-landing-display)" }}
              >
                SplitEase
              </p>
              <p className="text-xs text-muted-foreground">
                Shared money, finally calm
              </p>
            </div>
          </Link>

          <nav className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button
                asChild
                className="rounded-full bg-foreground px-5 text-background shadow-[0_18px_35px_-18px_rgba(10,15,22,0.75)] hover:bg-foreground/90"
              >
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild className="rounded-full px-5">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full bg-foreground px-5 text-background shadow-[0_18px_35px_-18px_rgba(10,15,22,0.75)] hover:bg-foreground/90"
                >
                  <Link href="/register">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-14 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-20">
        <div className="max-w-2xl">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/80 px-4 py-2 text-sm text-emerald-900 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Designed for trips, roommates, and modern group spending
            </div>

            <h1
              className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-slate-950 md:text-7xl"
              style={{ fontFamily: "var(--font-landing-display)" }}
            >
              Stop chasing people for money.
              <span className="block bg-[linear-gradient(135deg,#1a9c66,#f59e0b)] bg-clip-text text-transparent">
                Start running cleaner splits.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 md:text-xl">
              SplitEase turns chaotic shared expenses into a calm, transparent
              workflow. Add a bill, choose the people, and everyone instantly
              knows the balance.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {isLoggedIn ? (
                <Button
                  asChild
                  size="lg"
                  className="h-[52px] rounded-full bg-emerald-600 px-7 text-base shadow-[0_22px_45px_-20px_rgba(5,150,105,0.85)] hover:bg-emerald-700"
                >
                  <Link href="/dashboard">
                    Go to dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="h-[52px] rounded-full bg-emerald-600 px-7 text-base shadow-[0_22px_45px_-20px_rgba(5,150,105,0.85)] hover:bg-emerald-700"
                  >
                    <Link href="/register">
                      Start splitting for free
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-[52px] rounded-full border-slate-200 bg-white/80 px-7 text-base backdrop-blur hover:bg-white"
                  >
                    <Link href="/login">I already have an account</Link>
                  </Button>
                </>
              )}
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                No spreadsheets
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                Real-time balances
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                Easy settlements
              </div>
            </div>
          </div>
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-700 delay-150">
          <div className="relative mx-auto max-w-xl">
            <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,rgba(16,185,129,0.18),rgba(245,158,11,0.18))] blur-2xl" />
            <Card className="relative overflow-hidden rounded-[2rem] border-white/70 bg-white/85 p-0 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl">
              <CardContent className="p-0">
                <div className="border-b border-slate-200/80 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">
                        Bali Weekend
                      </p>
                      <p
                        className="text-2xl font-semibold tracking-tight text-slate-950"
                        style={{ fontFamily: "var(--font-landing-display)" }}
                      >
                        Everyone is aligned
                      </p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">
                        Net to settle
                      </p>
                      <p className="text-2xl font-semibold text-emerald-700">
                        $48
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 px-6 py-6 md:grid-cols-[1.15fr_0.85fr]">
                  <div className="space-y-4">
                    <div className="rounded-3xl bg-slate-950 p-5 text-white">
                      <div className="flex items-center justify-between text-sm text-white/70">
                        <span>This month</span>
                        <span>12 expenses</span>
                      </div>
                      <div className="mt-4 flex items-end justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                            Shared total
                          </p>
                          <p
                            className="mt-2 text-4xl font-semibold tracking-tight"
                            style={{ fontFamily: "var(--font-landing-display)" }}
                          >
                            $1,284
                          </p>
                        </div>
                        <div className="rounded-full bg-white/10 px-3 py-1 text-sm text-emerald-300">
                          +18% smoother
                        </div>
                      </div>
                      <div className="mt-5 grid grid-cols-4 gap-2">
                        {[56, 88, 62, 94].map((height, index) => (
                          <div
                            key={index}
                            className="rounded-full bg-white/10 p-1"
                          >
                            <div
                              className="w-full rounded-full bg-[linear-gradient(180deg,#6ee7b7,#fbbf24)]"
                              style={{ height }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-white p-3 shadow-sm">
                            <CircleDollarSign className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">You paid</p>
                            <p className="text-xl font-semibold text-slate-900">
                              $320
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-white p-3 shadow-sm">
                            <Users className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Per person</p>
                            <p className="text-xl font-semibold text-slate-900">
                              $107
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        title: "Villa deposit",
                        meta: "Paid by Aadarsh",
                        amount: "$640",
                        icon: CreditCard,
                      },
                      {
                        title: "Scooter rental",
                        meta: "Split 4 ways",
                        amount: "$96",
                        icon: Wallet,
                      },
                      {
                        title: "Dinner by the beach",
                        meta: "You covered it",
                        amount: "$148",
                        icon: ReceiptText,
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/60"
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-2xl bg-emerald-50 p-3">
                            <item.icon className="h-5 w-5 text-emerald-700" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="font-medium text-slate-900">
                                  {item.title}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {item.meta}
                                </p>
                              </div>
                              <p className="font-semibold text-slate-900">
                                {item.amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="rounded-3xl bg-[linear-gradient(135deg,#ecfccb,#dcfce7)] p-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white p-3 shadow-sm">
                          <Clock3 className="h-5 w-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">
                            Next best action
                          </p>
                          <p className="font-semibold text-slate-900">
                            Priya pays you $48 to settle the trip
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.3)] backdrop-blur md:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-5"
            >
              <p
                className="text-3xl font-semibold tracking-tight text-slate-950"
                style={{ fontFamily: "var(--font-landing-display)" }}
              >
                {metric.value}
              </p>
              <p className="mt-2 text-sm text-slate-500">{metric.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Built for real life
          </p>
          <h2
            className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl"
            style={{ fontFamily: "var(--font-landing-display)" }}
          >
            One product, many messy group-money moments.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Whether it is a weekly grocery split or a weekend getaway, the
            interface stays simple, visual, and low-friction.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.title}
              className="overflow-hidden rounded-[2rem] border-white/70 bg-white/80 p-0 shadow-[0_24px_90px_-45px_rgba(15,23,42,0.35)] backdrop-blur"
            >
              <CardContent className="p-6">
                <div
                  className={`mb-8 h-40 rounded-[1.5rem] bg-gradient-to-br ${scenario.accent} p-5`}
                >
                  <div className="flex h-full items-end rounded-[1.2rem] border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur">
                    <div>
                      <p className="text-sm text-slate-500">
                        Popular use case
                      </p>
                      <p
                        className="text-2xl font-semibold tracking-tight text-slate-950"
                        style={{ fontFamily: "var(--font-landing-display)" }}
                      >
                        {scenario.title}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-900">
                  {scenario.title} stay on the same page.
                </p>
                <p className="mt-3 leading-7 text-slate-600">
                  {scenario.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
            Why it feels better
          </p>
          <h2
            className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-slate-950 md:text-5xl"
            style={{ fontFamily: "var(--font-landing-display)" }}
          >
            Less admin. More clarity. Fewer awkward follow-ups.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
            The experience is built around reducing hesitation. Every key action
            is obvious, every balance is legible, and every settlement feels
            finite.
          </p>
        </div>

        <div className="grid gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-[1.75rem] border border-slate-200/80 bg-white/80 p-6 shadow-[0_18px_70px_-45px_rgba(15,23,42,0.35)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-4">
                  <div className="rounded-2xl bg-[linear-gradient(135deg,#ecfdf5,#fef3c7)] p-3">
                    <feature.icon className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                      0{index + 1}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-950">
                      {feature.title}
                    </h3>
                    <p className="mt-2 max-w-xl leading-7 text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-600" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-24 lg:px-8">
        <Card className="overflow-hidden rounded-[2.25rem] border-0 bg-slate-950 p-0 text-white shadow-[0_40px_120px_-50px_rgba(15,23,42,0.75)]">
          <CardContent className="grid gap-10 px-8 py-10 md:px-10 md:py-12 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Ready to use
              </p>
              <h2
                className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.03em] md:text-5xl"
                style={{ fontFamily: "var(--font-landing-display)" }}
              >
                A landing page that finally matches the product promise.
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                Invite your group, add the first expense, and let the app do the
                math and the memory work.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                {isLoggedIn ? (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-white px-7 text-slate-950 hover:bg-slate-100"
                  >
                    <Link href="/dashboard">
                      Open dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="rounded-full bg-white px-7 text-slate-950 hover:bg-slate-100"
                    >
                      <Link href="/register">
                        Create free account
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="rounded-full border-white/20 bg-white/5 px-7 text-white"
                    >
                      <Link href="/login">Sign in</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Designed to feel premium on first glance",
                "Clear hierarchy across hero, proof, and CTA",
                "Responsive layout with strong mobile stacking",
                "Existing login and register flows preserved",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-slate-200"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="leading-7">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
