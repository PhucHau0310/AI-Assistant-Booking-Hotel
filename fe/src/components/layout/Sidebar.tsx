"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/auth";
import {
    Home,
    Building,
    MapPin,
    Calendar,
    User,
    LogOut,
    Settings,
} from "lucide-react";
import { formatRole } from "@/lib/utils/format";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[280px] sm:w-[300px]">
                <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                        <Building className="h-6 w-6 text-primary" />
                        <span>HotelBook</span>
                    </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col space-y-2 mt-8">
                    <Button
                        variant="ghost"
                        className="justify-start"
                        asChild
                        onClick={onClose}
                    >
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Home
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="justify-start"
                        asChild
                        onClick={onClose}
                    >
                        <Link href="/rooms">
                            <Building className="mr-2 h-4 w-4" />
                            Room
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="justify-start"
                        asChild
                        onClick={onClose}
                    >
                        <Link href="/locations">
                            <MapPin className="mr-2 h-4 w-4" />
                            Location
                        </Link>
                    </Button>

                    {isAuthenticated && (
                        <>
                            <Button
                                variant="ghost"
                                className="justify-start"
                                asChild
                                onClick={onClose}
                            >
                                <Link href="/bookings">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Booking
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                className="justify-start"
                                asChild
                                onClick={onClose}
                            >
                                <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                </Link>
                            </Button>

                            {formatRole(user?.role ?? 2) === "Admin" && (
                                <Button
                                    variant="ghost"
                                    className="justify-start"
                                    asChild
                                    onClick={onClose}
                                >
                                    <Link href="/admin">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Management
                                    </Link>
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                className="justify-start"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    )}

                    {!isAuthenticated && (
                        <div className="pt-4 space-y-2">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                asChild
                                onClick={onClose}
                            >
                                <Link href="/auth/login">
                                    <User className="mr-2 h-4 w-4" />
                                    Login
                                </Link>
                            </Button>
                            <Button
                                className="w-full justify-start"
                                asChild
                                onClick={onClose}
                            >
                                <Link href="/auth/register">
                                    <User className="mr-2 h-4 w-4" />
                                    Register
                                </Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
