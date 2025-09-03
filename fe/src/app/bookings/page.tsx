"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Calendar,
    MapPin,
    Users,
    Clock,
    CreditCard,
    Eye,
    Trash2,
    Loader2,
    Phone,
    Mail,
} from "lucide-react";
import Link from "next/link";
import { bookingApi } from "@/lib/api";
import type { Booking } from "@/types";
import { toast } from "sonner";
import { BookingStats } from "@/components/features/BookingStats";
import { BookingQuickActions } from "@/components/features/BookingQuickActions";
import {
    BookingFilters,
    type BookingFilter,
} from "@/components/features/BookingFilters";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null
    );
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState<BookingFilter>("all");

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            setIsLoading(true);
            const response = await bookingApi.getMyBookings();
            if (response.content) {
                setBookings(response.content);
            }
        } catch (error) {
            console.error("Error loading bookings:", error);
            toast.error("Failed to load bookings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        try {
            await bookingApi.deleteBooking(bookingId);
            setBookings((prev) =>
                prev.filter((booking) => booking.id !== bookingId)
            );
            setIsDeleteDialogOpen(false);
            setBookingToDelete(null);
            toast.success("Booking cancelled successfully");
        } catch (error) {
            console.error("Error deleting booking:", error);
            toast.error("Failed to cancel booking");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const calculateNights = (checkIn: string, checkOut: string) => {
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const diffTime = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const getBookingStatus = (checkIn: string, checkOut: string) => {
        const now = new Date();
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (now < checkInDate) {
            return { status: "upcoming", color: "bg-blue-100 text-blue-800" };
        } else if (now >= checkInDate && now <= checkOutDate) {
            return { status: "active", color: "bg-green-100 text-green-800" };
        } else {
            return { status: "completed", color: "bg-gray-100 text-gray-800" };
        }
    };

    const filteredBookings = bookings.filter((booking) => {
        if (currentFilter === "all") return true;
        const { status } = getBookingStatus(
            booking.checkInDate,
            booking.checkOutDate
        );
        return status === currentFilter;
    });

    const filterCounts = {
        all: bookings.length,
        upcoming: bookings.filter(
            (b) =>
                getBookingStatus(b.checkInDate, b.checkOutDate).status ===
                "upcoming"
        ).length,
        active: bookings.filter(
            (b) =>
                getBookingStatus(b.checkInDate, b.checkOutDate).status ===
                "active"
        ).length,
        completed: bookings.filter(
            (b) =>
                getBookingStatus(b.checkInDate, b.checkOutDate).status ===
                "completed"
        ).length,
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading your bookings...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                My Bookings
                            </h1>
                            <p className="text-gray-600">
                                Manage your reservations and travel plans
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/rooms">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Book New Room
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Bookings List */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {bookings.length > 0 && (
                        <>
                            <BookingStats bookings={bookings} />
                            <BookingFilters
                                currentFilter={currentFilter}
                                onFilterChange={setCurrentFilter}
                                counts={filterCounts}
                            />
                        </>
                    )}

                    {bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-8">
                                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No bookings yet
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Start exploring and book your perfect stay!
                                </p>
                                <Button asChild>
                                    <Link href="/rooms">Browse Rooms</Link>
                                </Button>
                            </div>
                            <BookingQuickActions />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredBookings.map((booking) => {
                                const { status, color } = getBookingStatus(
                                    booking.checkInDate,
                                    booking.checkOutDate
                                );
                                const nights = calculateNights(
                                    booking.checkInDate,
                                    booking.checkOutDate
                                );

                                return (
                                    <Card
                                        key={booking.id}
                                        className="overflow-hidden"
                                    >
                                        <CardContent className="p-0">
                                            <div className="flex flex-col lg:flex-row">
                                                {/* Room Image */}
                                                <div className="lg:w-1/3">
                                                    <div className="aspect-video lg:aspect-square bg-gray-200 relative">
                                                        <img
                                                            src={
                                                                (process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                    /\/api$/,
                                                                    ""
                                                                ) ?? "") +
                                                                    (booking
                                                                        .room
                                                                        ?.picture ??
                                                                        "") ||
                                                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
                                                            }
                                                            alt={
                                                                booking.room
                                                                    ?.name ||
                                                                "Room"
                                                            }
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop";
                                                            }}
                                                        />
                                                        <div className="absolute top-4 right-4">
                                                            <Badge
                                                                className={
                                                                    color
                                                                }
                                                            >
                                                                {status
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    status.slice(
                                                                        1
                                                                    )}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Booking Details */}
                                                <div className="lg:w-2/3 p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-semibold mb-2">
                                                                {booking.room
                                                                    ?.name ||
                                                                    "Room"}
                                                            </h3>
                                                            <div className="flex items-center text-gray-600 mb-2">
                                                                <MapPin className="h-4 w-4 mr-1" />
                                                                <span>
                                                                    {booking
                                                                        .room
                                                                        ?.location
                                                                        ?.name ||
                                                                        "Location"}
                                                                    ,{" "}
                                                                    {booking
                                                                        .room
                                                                        ?.location
                                                                        ?.province ||
                                                                        "Province"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center text-sm text-gray-500 mb-4">
                                                                <Clock className="h-4 w-4 mr-1" />
                                                                <span>
                                                                    Booked on{" "}
                                                                    {formatDateTime(
                                                                        booking.createdAt
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-2xl font-bold">
                                                                $
                                                                {
                                                                    booking.totalPrice
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {nights} night
                                                                {nights !== 1
                                                                    ? "s"
                                                                    : ""}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Dates and Guests */}
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <div className="text-sm text-gray-500 mb-1">
                                                                Check-in
                                                            </div>
                                                            <div className="font-medium">
                                                                {formatDate(
                                                                    booking.checkInDate
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-500 mb-1">
                                                                Check-out
                                                            </div>
                                                            <div className="font-medium">
                                                                {formatDate(
                                                                    booking.checkOutDate
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-500 mb-1">
                                                                Guests
                                                            </div>
                                                            <div className="font-medium flex items-center">
                                                                <Users className="h-4 w-4 mr-1" />
                                                                {
                                                                    booking.guestCount
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSelectedBooking(
                                                                    booking
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/rooms/${booking.roomId}`}
                                                            >
                                                                View Room
                                                            </Link>
                                                        </Button>
                                                        {status ===
                                                            "upcoming" && (
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setBookingToDelete(
                                                                        booking.id
                                                                    );
                                                                    setIsDeleteDialogOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Cancel
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <Dialog
                    open={!!selectedBooking}
                    onOpenChange={() => setSelectedBooking(null)}
                >
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Booking Details</DialogTitle>
                            <DialogDescription>
                                Complete information about your reservation
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                            {/* Room Information */}
                            <div>
                                <h4 className="font-semibold mb-3">
                                    Room Information
                                </h4>
                                <div className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={
                                                (process.env.NEXT_PUBLIC_API_URL?.replace(
                                                    /\/api$/,
                                                    ""
                                                ) ?? "") +
                                                    (selectedBooking.room
                                                        ?.picture ?? "") ||
                                                "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=96&h=96&fit=crop"
                                            }
                                            alt={
                                                selectedBooking.room?.name ||
                                                "Room"
                                            }
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=96&h=96&fit=crop";
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-medium">
                                            {selectedBooking.room?.name}
                                        </h5>
                                        <p className="text-sm text-gray-600 flex items-center mt-1">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {
                                                selectedBooking.room?.location
                                                    ?.name
                                            }
                                            ,{" "}
                                            {
                                                selectedBooking.room?.location
                                                    ?.province
                                            }
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            ${selectedBooking.room?.price}/night
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div>
                                <h4 className="font-semibold mb-3">
                                    Booking Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">
                                            Booking ID:
                                        </span>
                                        <div className="font-mono">
                                            {selectedBooking.id}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Booking Date:
                                        </span>
                                        <div>
                                            {formatDateTime(
                                                selectedBooking.createdAt
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Check-in:
                                        </span>
                                        <div>
                                            {formatDate(
                                                selectedBooking.checkInDate
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Check-out:
                                        </span>
                                        <div>
                                            {formatDate(
                                                selectedBooking.checkOutDate
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Guests:
                                        </span>
                                        <div>{selectedBooking.guestCount}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Total Nights:
                                        </span>
                                        <div>
                                            {calculateNights(
                                                selectedBooking.checkInDate,
                                                selectedBooking.checkOutDate
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Guest Information */}
                            <div>
                                <h4 className="font-semibold mb-3">
                                    Guest Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center">
                                        <span className="text-gray-500 w-20">
                                            Name:
                                        </span>
                                        <span>
                                            {selectedBooking.user?.name ||
                                                "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-gray-500 w-16">
                                            Email:
                                        </span>
                                        <span>
                                            {selectedBooking.user?.email ||
                                                "N/A"}
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-gray-500 w-16">
                                            Phone:
                                        </span>
                                        <span>
                                            {selectedBooking.user?.phone ||
                                                "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">
                                    Payment Summary
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>
                                            Room rate (
                                            {calculateNights(
                                                selectedBooking.checkInDate,
                                                selectedBooking.checkOutDate
                                            )}{" "}
                                            nights):
                                        </span>
                                        <span>
                                            $
                                            {selectedBooking.room?.price
                                                ? selectedBooking.room.price *
                                                  calculateNights(
                                                      selectedBooking.checkInDate,
                                                      selectedBooking.checkOutDate
                                                  )
                                                : 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between font-semibold text-lg border-t pt-2">
                                        <span>Total:</span>
                                        <span>
                                            ${selectedBooking.totalPrice ?? ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setSelectedBooking(null)}>
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Booking</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this booking? This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDeleteDialogOpen(false);
                                setBookingToDelete(null);
                            }}
                        >
                            Keep Booking
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() =>
                                bookingToDelete &&
                                handleDeleteBooking(bookingToDelete)
                            }
                        >
                            Cancel Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
