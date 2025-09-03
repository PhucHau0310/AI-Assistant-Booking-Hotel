"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Star,
    MapPin,
    Users,
    Calendar,
    CreditCard,
    MessageSquare,
    Send,
    Loader2,
} from "lucide-react";
import Link from "next/link";
import { roomApi, commentApi, bookingApi } from "@/lib/api";
import type {
    Room,
    Comment,
    CreateCommentRequest,
    CreateBookingRequest,
} from "@/types";
import { toast } from "sonner";
import { AmenitiesDisplay } from "@/components/features/AmenitiesDisplay";
import { useAuthStore } from "@/store/auth";

export default function RoomDetailsPage() {
    const params = useParams();
    const roomId = params.id as string;

    const [room, setRoom] = useState<Room | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
    const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
    const { user } = useAuthStore();

    const [newComment, setNewComment] = useState({
        content: "",
        rating: 5,
    });

    const [bookingData, setBookingData] = useState({
        checkInDate: "",
        checkOutDate: "",
        guestCount: 1,
    });

    useEffect(() => {
        if (roomId) {
            loadRoomDetails();
            loadComments();
        }
    }, [roomId]);

    const loadRoomDetails = async () => {
        try {
            setIsLoading(true);
            const response = await roomApi.getRoomById(roomId);
            if (response.content) {
                setRoom(response.content);
            }
        } catch (error) {
            console.error("Error loading room details:", error);
            toast.error("Failed to load room details");
        } finally {
            setIsLoading(false);
        }
    };

    const loadComments = async () => {
        try {
            setIsCommentsLoading(true);
            const response = await commentApi.getCommentsByRoom(roomId);
            if (response.content) {
                setComments(response.content);
            }
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setIsCommentsLoading(false);
        }
    };

    const handleCommentSubmit = async () => {
        try {
            if (!newComment.content.trim()) {
                toast.error("Please enter a comment");
                return;
            }

            const commentRequest: CreateCommentRequest = {
                content: newComment.content,
                rating: newComment.rating,
                roomId: roomId,
                userId: user?.id ?? "",
            };

            const response = await commentApi.createComment(commentRequest);
            if (response.content) {
                setComments((prev) => [response.content!, ...prev]);
                setNewComment({ content: "", rating: 5 });
                setIsCommentDialogOpen(false);
                toast.success("Comment added successfully");
            }
        } catch (error) {
            console.error("Error creating comment:", error);
            toast.error("Failed to add comment");
        }
    };

    const calculateTotalPrice = () => {
        if (!room || !bookingData.checkInDate || !bookingData.checkOutDate)
            return 0;

        const checkIn = new Date(bookingData.checkInDate);
        const checkOut = new Date(bookingData.checkOutDate);
        const nights = Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
        );

        return nights > 0 ? nights * room.price : 0;
    };

    const handleBooking = async () => {
        try {
            if (!bookingData.checkInDate || !bookingData.checkOutDate) {
                toast.error("Please select check-in and check-out dates");
                return;
            }

            if (
                new Date(bookingData.checkInDate) >=
                new Date(bookingData.checkOutDate)
            ) {
                toast.error("Check-out date must be after check-in date");
                return;
            }

            const totalPrice = calculateTotalPrice();
            const bookingRequest: CreateBookingRequest = {
                checkInDate: bookingData.checkInDate,
                checkOutDate: bookingData.checkOutDate,
                guestCount: bookingData.guestCount,
                totalPrice: totalPrice,
                roomId: roomId,
                userId: user?.id ?? "",
            };

            const response = await bookingApi.createBooking(bookingRequest);
            if (response.content) {
                setIsBookingDialogOpen(false);
                toast.success("Booking created successfully");
                // Redirect to bookings page or confirmation
            }
        } catch (error) {
            console.error("Error creating booking:", error);
            toast.error("Failed to create booking");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const averageRating =
        comments.length > 0
            ? comments.reduce((sum, comment) => sum + comment.rating, 0) /
              comments.length
            : 0;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading room details...</span>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Room not found</h1>
                    <Button asChild>
                        <Link href="/rooms">Back to Rooms</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <nav className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li>
                            <Link href="/" className="hover:text-blue-600">
                                Home
                            </Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link href="/rooms" className="hover:text-blue-600">
                                Rooms
                            </Link>
                        </li>
                        <li>/</li>
                        <li className="text-gray-900">{room.name}</li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Room Images */}
                        <div className="mb-8">
                            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                    src={
                                        (process.env.NEXT_PUBLIC_API_URL?.replace(
                                            /\/api$/,
                                            ""
                                        ) ?? "") + (room.picture ?? "") ||
                                        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                                    }
                                    alt={room.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src =
                                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop";
                                    }}
                                />
                            </div>
                        </div>

                        {/* Room Info */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">
                                        {room.name}
                                    </h1>
                                    <div className="flex items-center text-gray-600 mb-2">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>
                                            {room.location?.name},{" "}
                                            {room.location?.province}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                            <span className="font-medium">
                                                {averageRating.toFixed(1)}
                                            </span>
                                            <span className="text-gray-500 ml-1">
                                                ({comments.length} reviews)
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="h-4 w-4 mr-1" />
                                            <span>
                                                Max {room.maxGuests ?? 5} guests
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold">
                                        ${room.price}
                                    </div>
                                    <div className="text-gray-600">
                                        per night
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">
                                    Amenities
                                </h3>
                                <AmenitiesDisplay
                                    room={room}
                                    variant="badges"
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-3">
                                    Description
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {room.description ||
                                        "Experience luxury and comfort in this beautiful accommodation. Perfect for your next getaway."}
                                </p>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold">
                                    Reviews ({comments.length})
                                </h3>
                                <Dialog
                                    open={isCommentDialogOpen}
                                    onOpenChange={setIsCommentDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Write a Review
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Write a Review
                                            </DialogTitle>
                                            <DialogDescription>
                                                Share your experience with other
                                                guests
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div>
                                                <label
                                                    htmlFor="rating"
                                                    className="text-sm font-medium"
                                                >
                                                    Rating
                                                </label>
                                                <div
                                                    id="rating"
                                                    className="flex items-center gap-1 mt-1"
                                                >
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() =>
                                                                    setNewComment(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            rating: star,
                                                                        })
                                                                    )
                                                                }
                                                                className="focus:outline-none"
                                                            >
                                                                <Star
                                                                    className={`h-6 w-6 ${
                                                                        star <=
                                                                        newComment.rating
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="comment-textarea"
                                                    className="text-sm font-medium"
                                                >
                                                    Comment
                                                </label>
                                                <Textarea
                                                    id="comment-textarea"
                                                    placeholder="Tell us about your experience..."
                                                    value={newComment.content}
                                                    onChange={(e) =>
                                                        setNewComment(
                                                            (prev) => ({
                                                                ...prev,
                                                                content:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                    className="mt-1"
                                                    rows={4}
                                                />
                                            </div>
                                            <Button
                                                onClick={handleCommentSubmit}
                                                className="w-full"
                                            >
                                                <Send className="h-4 w-4 mr-2" />
                                                Submit Review
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Comments List */}
                            {isCommentsLoading && (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span className="ml-2">
                                        Loading reviews...
                                    </span>
                                </div>
                            )}

                            {!isCommentsLoading && comments.length > 0 && (
                                <div className="space-y-6">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="border-b border-gray-200 pb-6 last:border-b-0"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                                                        {comment.user?.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            "U"}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {comment.user
                                                                ?.name ||
                                                                "Anonymous"}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {formatDate(
                                                                comment.createdAt
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-4 w-4 ${
                                                                    star <=
                                                                    comment.rating
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-700">
                                                {comment.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isCommentsLoading && comments.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No reviews yet. Be the first to write a
                                    review!
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <div className="text-2xl font-bold">
                                        ${room.price}
                                    </div>
                                    <div className="text-gray-600">
                                        per night
                                    </div>
                                </div>

                                <Dialog
                                    open={isBookingDialogOpen}
                                    onOpenChange={setIsBookingDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button className="w-full" size="lg">
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Book Now
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                Book Your Stay
                                            </DialogTitle>
                                            <DialogDescription>
                                                Complete your booking details
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label
                                                        htmlFor="checkin-date"
                                                        className="text-sm font-medium"
                                                    >
                                                        Check-in
                                                    </label>
                                                    <div className="relative mt-1">
                                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            id="checkin-date"
                                                            type="date"
                                                            value={
                                                                bookingData.checkInDate
                                                            }
                                                            onChange={(e) =>
                                                                setBookingData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        checkInDate:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="checkout-date"
                                                        className="text-sm font-medium"
                                                    >
                                                        Check-out
                                                    </label>
                                                    <div className="relative mt-1">
                                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <Input
                                                            id="checkout-date"
                                                            type="date"
                                                            value={
                                                                bookingData.checkOutDate
                                                            }
                                                            onChange={(e) =>
                                                                setBookingData(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        checkOutDate:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="guest-count"
                                                    className="text-sm font-medium"
                                                >
                                                    Guests
                                                </label>
                                                <div className="relative mt-1">
                                                    <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="guest-count"
                                                        type="number"
                                                        min="1"
                                                        max={room.maxGuests}
                                                        value={
                                                            bookingData.guestCount
                                                        }
                                                        onChange={(e) =>
                                                            setBookingData(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    guestCount:
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 1,
                                                                })
                                                            )
                                                        }
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            {calculateTotalPrice() > 0 && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span>
                                                            Price per night:
                                                        </span>
                                                        <span>
                                                            ${room.price}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span>
                                                            Number of nights:
                                                        </span>
                                                        <span>
                                                            {Math.ceil(
                                                                (new Date(
                                                                    bookingData.checkOutDate
                                                                ).getTime() -
                                                                    new Date(
                                                                        bookingData.checkInDate
                                                                    ).getTime()) /
                                                                    (1000 *
                                                                        60 *
                                                                        60 *
                                                                        24)
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center font-bold text-lg border-t pt-2">
                                                        <span>Total:</span>
                                                        <span>
                                                            $
                                                            {calculateTotalPrice()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            <Button
                                                onClick={handleBooking}
                                                className="w-full"
                                            >
                                                Confirm Booking
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <div className="mt-4 text-center text-sm text-gray-500">
                                    You won't be charged yet
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
