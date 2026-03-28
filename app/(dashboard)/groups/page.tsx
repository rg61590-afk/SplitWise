"use client";

import { useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Empty } from "@/components/ui/empty";
import { CreateGroupDialog } from "@/components/groups/create-group-dialog";
import { Plus, Users, ChevronRight } from "lucide-react";

interface GroupMember {
  user: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  role: "admin" | "member";
  joinedAt: string;
}

interface Group {
  _id: string;
  name: string;
  description?: string;
  members: GroupMember[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GroupsPage() {
  const { data: groups, error, isLoading, mutate } = useSWR<Group[]>("/api/groups", fetcher);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-destructive">Failed to load groups</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Manage your expense sharing groups
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {!groups || groups.length === 0 ? (
        <Empty
          icon={Users}
          title="No groups yet"
          description="Create your first group to start splitting expenses with friends."
          action={
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Link key={group._id} href={`/groups/${group._id}`}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{group.name}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </CardTitle>
                  {group.description && (
                    <CardDescription className="line-clamp-2">
                      {group.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {group.members.slice(0, 4).map((member) => (
                        <Avatar
                          key={member.user._id}
                          className="h-8 w-8 border-2 border-background"
                        >
                          <AvatarImage src={member.user.image} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {member.user.name?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {group.members.length > 4 && (
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background">
                          <span className="text-xs text-muted-foreground">
                            +{group.members.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {group.members.length} member{group.members.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateGroupDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => mutate()}
      />
    </div>
  );
}
