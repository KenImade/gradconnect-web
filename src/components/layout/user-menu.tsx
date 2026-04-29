"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClipboardList, LogOut, LayoutDashboard, Bookmark, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Shield } from "lucide-react";
import { logout } from "@/lib/api/endpoints/auth";
import { getInitials } from "@/lib/utils/text";
import type { User } from "@/lib/api/endpoints/users.types";

export function UserMenu({ user }: { user: User }) {
    const router = useRouter();

    async function handleLogout() {
        try {
            await logout();
        } catch {
            // Even if the API call fails, fall through — the cookie is probably
            // cleared or the session is invalid anyway.
        }
        router.replace("/");
        router.refresh();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Open user menu"
            >
                <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-body-sm font-medium">
                        {getInitials(user.name)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col">
                        <span className="text-body-sm font-medium text-foreground line-clamp-1">
                            {user.name}
                        </span>
                        <span className="text-caption text-text-faint line-clamp-1">
                            {user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user.permissions.includes("admin:full") && (
                    <>
                        <DropdownMenuItem asChild>
                            <Link href="/admin/moderation" className="cursor-pointer">
                                <Shield className="mr-2 size-4" />
                                Admin
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 size-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/shortlist" className="cursor-pointer">
                        <Bookmark className="mr-2 size-4" />
                        Shortlist
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/tracker" className="cursor-pointer">
                        <ClipboardList className="mr-2 size-4" />
                        Tracker
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 size-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault();
                        handleLogout();
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                >
                    <LogOut className="mr-2 size-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}