"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Users,
    MapPin,
    Bed,
    Calendar,
    MessageSquare,
    DollarSign,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";

interface DashboardData {
    totalUsers: number;
    totalRooms: number;
    totalBookings: number;
    totalLocations: number;
    totalComments: number;
    recentActivity: Array<{
        id: string;
        type: string;
        message: string;
        timestamp: string;
    }>;
}

export default function DashboardStats() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Fetch data from all endpoints
                const [
                    usersRes,
                    roomsRes,
                    bookingsRes,
                    locationsRes,
                    commentsRes,
                ] = await Promise.all([
                    adminApi.users.getAll(),
                    adminApi.rooms.getAll(),
                    adminApi.bookings.getAll(),
                    adminApi.locations.getAll(),
                    adminApi.comments.getAll(),
                ]);

                setData({
                    totalUsers: usersRes.data.content?.length || 0,
                    totalRooms: roomsRes.data.content?.length || 0,
                    totalBookings: bookingsRes.data.content?.length || 0,
                    totalLocations: locationsRes.data.content?.length || 0,
                    totalComments: commentsRes.data.content?.length || 0,
                    recentActivity: [
                        {
                            id: "1",
                            type: "user",
                            message: "New user registered",
                            timestamp: "2 minutes ago",
                        },
                        {
                            id: "2",
                            type: "booking",
                            message: "Room booking confirmed",
                            timestamp: "5 minutes ago",
                        },
                        {
                            id: "3",
                            type: "room",
                            message: "New room added",
                            timestamp: "1 hour ago",
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="space-y-0 pb-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Users
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.totalUsers || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Rooms
                        </CardTitle>
                        <Bed className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.totalRooms || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Bookings
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.totalBookings || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Locations
                        </CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.totalLocations || 0}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Comments
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {data?.totalComments || 0}
                        </div>
                    </CardContent>
                </Card>

                {/* <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,345,000 VNĐ</div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    );
}
