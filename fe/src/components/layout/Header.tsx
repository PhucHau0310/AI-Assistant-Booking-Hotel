"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth";
import {
    Menu,
    Sun,
    Moon,
    User,
    LogOut,
    Home,
    Building,
    MapPin,
    Calendar,
    Settings,
} from "lucide-react";
import { formatRole } from "@/lib/utils/format";

interface HeaderProps {
    readonly onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    // Fix hydration error
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container mx-auto px-2 sm:px-4 h-16 flex items-center justify-between">
                {/* Left side - Logo and Navigation */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMenuClick}
                        className="md:hidden h-8 w-8 p-0"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <Link href="/" className="flex items-center space-x-2">
                        <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        <span className="text-lg sm:text-xl font-bold">
                            HotelBook
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6 ml-8">
                        <Link
                            href="/"
                            className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </Link>
                        <Link
                            href="/rooms"
                            className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
                        >
                            <Building className="h-4 w-4" />
                            <span>Room</span>
                        </Link>
                        <Link
                            href="/locations"
                            className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
                        >
                            <MapPin className="h-4 w-4" />
                            <span>Location</span>
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href="/bookings"
                                className="flex items-center space-x-1 text-foreground/80 hover:text-foreground transition-colors"
                            >
                                <Calendar className="h-4 w-4" />
                                <span>Booking</span>
                            </Link>
                        )}
                    </nav>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center space-x-1 sm:space-x-2">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleTheme}
                        className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                    >
                        {mounted && theme === "dark" ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </Button>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={`${process.env.NEXT_PUBLIC_API_URL?.replace(
                                                /\/api$/,
                                                ""
                                            )}${user?.avatarUrl}`}
                                            alt={user?.name}
                                        />
                                        <AvatarFallback>
                                            {user?.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                forceMount
                            >
                                <div className="flex flex-col space-y-1 p-2">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.name}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/profile"
                                        className="cursor-pointer"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                {formatRole(user?.role ?? 2) === "Admin" && (
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/admin"
                                            className="cursor-pointer"
                                        >
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Management</span>
                                        </Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="cursor-pointer"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                            >
                                <Link href="/auth/login">
                                    <User className="h-4 w-4 sm:mr-1" />
                                    <span className="hidden sm:inline">
                                        Login
                                    </span>
                                </Link>
                            </Button>
                            <Button
                                size="sm"
                                asChild
                                className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                            >
                                <Link href="/auth/register">
                                    <span className="hidden sm:inline">
                                        Register
                                    </span>
                                    <span className="sm:hidden">Join</span>
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
