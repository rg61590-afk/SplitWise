import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Wallet,
  Users,
  Receipt,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">SplitEase</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-24 md:py-32">
        <div className="flex flex-col items-center text-center gap-8">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium bg-muted">
            <Zap className="w-4 h-4 mr-2 text-primary" />
            Simple expense splitting for everyone
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-balance">
            Split expenses with friends,{" "}
            <span className="text-primary">effortlessly</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-balance">
            Keep track of shared expenses, balances, and settlements. Perfect
            for roommates, trips, and group activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-base">
                Start for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-24 border-t">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to split expenses
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete solution for managing shared expenses with your groups
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Groups</h3>
              <p className="text-muted-foreground">
                Organize expenses by creating groups for roommates, trips, or
                any shared activity.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Expenses</h3>
              <p className="text-muted-foreground">
                Add expenses quickly and split them equally among group
                members automatically.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <PieChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">View Balances</h3>
              <p className="text-muted-foreground">
                See who owes what at a glance with clear balance summaries and
                simplified debts.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Settle Up</h3>
              <p className="text-muted-foreground">
                Record settlements and keep everyone's balances up to date with
                ease.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-24 border-t">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why choose SplitEase?
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Simple and Intuitive</h3>
                  <p className="text-muted-foreground">
                    Clean interface designed for quick expense entry and easy
                    navigation.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Shield className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Secure and Private</h3>
                  <p className="text-muted-foreground">
                    Your financial data is encrypted and protected with
                    industry-standard security.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Zap className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Real-time Updates</h3>
                  <p className="text-muted-foreground">
                    See changes instantly as expenses are added or settled by
                    group members.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 bg-primary text-primary-foreground">
                <div className="text-4xl font-bold mb-2">Free</div>
                <p className="opacity-90">No hidden fees or subscriptions</p>
              </Card>
              <Card className="p-6">
                <div className="text-4xl font-bold mb-2 text-primary">24/7</div>
                <p className="text-muted-foreground">Access anywhere, anytime</p>
              </Card>
              <Card className="p-6">
                <div className="text-4xl font-bold mb-2 text-primary">100%</div>
                <p className="text-muted-foreground">Accurate calculations</p>
              </Card>
              <Card className="p-6 bg-muted">
                <div className="text-4xl font-bold mb-2">Easy</div>
                <p className="text-muted-foreground">Setup in seconds</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 border-t">
        <Card className="border-0 bg-primary text-primary-foreground p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to simplify your expenses?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
            Join thousands of users who trust SplitEase for their group expense
            management.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base"
            >
              Get started for free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="font-semibold">SplitEase</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Group Expense Management System
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
