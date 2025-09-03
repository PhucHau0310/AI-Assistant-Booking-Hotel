"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Users,
    MapPin,
    Bed,
    Calendar,
    MessageSquare,
    BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import RoomManagement from "@/components/admin/RoomManagement";
import BookingManagement from "@/components/admin/BookingManagement";
import LocationManagement from "@/components/admin/LocationManagement";
import UserManagement from "@/components/admin/UserManagement";
import CommentManagement from "@/components/admin/CommentManagement";
import DashboardStats from "@/components/admin/DashboardStats";
import { formatRole } from "@/lib/utils/format";

export default function AdminPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("dashboard");

    useEffect(() => {
        if (!isAuthenticated || formatRole(user?.role ?? 2) !== "Admin") {
            toast.error("Access denied. Admin privileges required.");
            router.push("/auth/login");
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || formatRole(user?.role ?? 2) !== "Admin") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You need admin privileges to access this page.
                    </p>
                    <Button onClick={() => router.push("/auth/login")}>
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your hotel booking system
                </p>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
            >
                <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
                    <TabsTrigger
                        value="dashboard"
                        className="flex items-center gap-2"
                    >
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="rooms"
                        className="flex items-center gap-2"
                    >
                        <Bed className="h-4 w-4" />
                        <span className="hidden sm:inline">Rooms</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="bookings"
                        className="flex items-center gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Bookings</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="locations"
                        className="flex items-center gap-2"
                    >
                        <MapPin className="h-4 w-4" />
                        <span className="hidden sm:inline">Locations</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="users"
                        className="flex items-center gap-2"
                    >
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Users</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="comments"
                        className="flex items-center gap-2"
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Comments</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                    <DashboardStats />
                </TabsContent>

                <TabsContent value="rooms" className="space-y-6">
                    <RoomManagement />
                </TabsContent>

                <TabsContent value="bookings" className="space-y-6">
                    <BookingManagement />
                </TabsContent>

                <TabsContent value="locations" className="space-y-6">
                    <LocationManagement />
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                    <UserManagement />
                </TabsContent>

                <TabsContent value="comments" className="space-y-6">
                    <CommentManagement />
                </TabsContent>
            </Tabs>
        </div>
    );
}
