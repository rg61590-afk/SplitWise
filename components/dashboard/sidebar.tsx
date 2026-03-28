"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Wallet,
  LayoutDashboard,
  Users,
  Receipt,
  ArrowLeftRight,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Groups", href: "/groups", icon: Users },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Settlements", href: "/settlements", icon: ArrowLeftRight },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar px-6 pb-4 border-r border-sidebar-border">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">
                SplitEase
              </span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex gap-x-3 rounded-lg p-3 text-sm font-medium leading-6 transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon
                        className={cn("h-5 w-5 shrink-0", {
                          "text-sidebar-primary": isActive,
                        })}
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent/50">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t bg-card">
        <div className="flex justify-around py-2">
          {navigation.slice(0, 4).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
