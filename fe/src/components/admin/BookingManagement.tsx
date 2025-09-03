"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    Eye,
    Edit,
    Trash2,
    Calendar,
    Users,
    MapPin,
    DollarSign,
    Filter,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Booking, Room, User } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

export default function BookingManagement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookingsRes, roomsRes, usersRes] = await Promise.all([
                adminApi.bookings.getAll(),
                adminApi.rooms.getAll(),
                adminApi.users.getAll(),
            ]);

            if (
                bookingsRes.data.statusCode === 200 &&
                bookingsRes.data.content
            ) {
                setBookings(bookingsRes.data.content);
            }

            if (roomsRes.data.statusCode === 200 && roomsRes.data.content) {
                setRooms(roomsRes.data.content);
            }

            if (usersRes.data.statusCode === 200 && usersRes.data.content) {
                setUsers(usersRes.data.content);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load booking data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;

        try {
            const response = await adminApi.bookings.delete(bookingId);

            if (response.data.statusCode === 200) {
                toast.success("Booking deleted successfully");
                fetchData();
            } else {
                toast.error(
                    response.data.message || "Failed to delete booking"
                );
            }
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error("Failed to delete booking");
        }
    };

    const getRoomName = (roomId: string) => {
        const room = rooms.find((r) => r.id === roomId);
        return room ? room.name : "Unknown Room";
    };

    const getUserName = (userId: string) => {
        const user = users.find((u) => u.id === userId);
        return user ? `${user.name}` : "Unknown User";
    };

    const getUserEmail = (userId: string) => {
        const user = users.find((u) => u.id === userId);
        return user ? user.email : "";
    };

    const getBookingStatus = (booking: Booking) => {
        const now = new Date();
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);

        if (now < checkIn) {
            return { status: "Upcoming", variant: "default" as const };
        } else if (now >= checkIn && now <= checkOut) {
            return { status: "Active", variant: "default" as const };
        } else {
            return { status: "Completed", variant: "secondary" as const };
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            getRoomName(booking.roomId)
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            getUserName(booking.userId)
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            getUserEmail(booking.userId)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const bookingStatus = getBookingStatus(booking);
        const matchesStatus =
            statusFilter === "all" ||
            bookingStatus.status.toLowerCase() === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Booking Management</CardTitle>
                            <CardDescription>
                                View and manage customer bookings
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search bookings..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="upcoming">
                                    Upcoming
                                </SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">
                                    Completed
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Booking ID</TableHead>
                                    <TableHead>Guest</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Check-in</TableHead>
                                    <TableHead>Check-out</TableHead>
                                    <TableHead>Guests</TableHead>
                                    <TableHead>Total Price</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBookings.map((booking) => {
                                    const bookingStatus =
                                        getBookingStatus(booking);
                                    return (
                                        <TableRow key={booking.id}>
                                            <TableCell>
                                                <div className="font-mono text-sm">
                                                    {booking.id.slice(0, 8)}...
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">
                                                        {getUserName(
                                                            booking.userId
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {getUserEmail(
                                                            booking.userId
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-gray-400" />
                                                    <span>
                                                        {getRoomName(
                                                            booking.roomId
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-gray-400" />
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                booking.checkInDate
                                                            ),
                                                            "MMM dd, yyyy"
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-gray-400" />
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                booking.checkOutDate
                                                            ),
                                                            "MMM dd, yyyy"
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-3 w-3 text-gray-400" />
                                                    <span>
                                                        {booking.guestCount}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3 text-green-600" />
                                                    <span className="font-medium">
                                                        ${booking.totalPrice}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        bookingStatus.variant
                                                    }
                                                >
                                                    {bookingStatus.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            // TODO: Open booking details dialog
                                                            toast.info(
                                                                "Booking details coming soon"
                                                            );
                                                        }}
                                                    >
                                                        <Eye className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            // TODO: Open edit booking dialog
                                                            toast.info(
                                                                "Edit booking coming soon"
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDeleteBooking(
                                                                booking.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredBookings.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No bookings found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
