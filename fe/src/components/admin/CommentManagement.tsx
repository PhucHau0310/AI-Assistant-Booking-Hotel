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
    Edit,
    Trash2,
    Eye,
    Star,
    User,
    MapPin,
    MessageSquare,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Comment, Room, User as UserType } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CommentManagement() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [ratingFilter, setRatingFilter] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [commentsRes, roomsRes, usersRes] = await Promise.all([
                adminApi.comments.getAll(),
                adminApi.rooms.getAll(),
                adminApi.users.getAll(),
            ]);

            if (
                commentsRes.data.statusCode === 200 &&
                commentsRes.data.content
            ) {
                setComments(commentsRes.data.content);
            }

            if (roomsRes.data.statusCode === 200 && roomsRes.data.content) {
                setRooms(roomsRes.data.content);
            }

            if (usersRes.data.statusCode === 200 && usersRes.data.content) {
                setUsers(usersRes.data.content);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load comment data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!confirm("Are you sure you want to delete this comment?")) return;

        try {
            const response = await adminApi.comments.delete(commentId);

            if (response.data.statusCode === 200) {
                toast.success("Comment deleted successfully");
                fetchData();
            } else {
                toast.error(
                    response.data.message || "Failed to delete comment"
                );
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment");
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

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-3 w-3 ${
                    i < rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                }`}
            />
        ));
    };

    const getRatingBadge = (rating: number) => {
        if (rating >= 4) {
            return (
                <Badge variant="default" className="bg-green-500">
                    Excellent
                </Badge>
            );
        } else if (rating >= 3) {
            return (
                <Badge variant="default" className="bg-blue-500">
                    Good
                </Badge>
            );
        } else if (rating >= 2) {
            return (
                <Badge variant="default" className="bg-yellow-500">
                    Fair
                </Badge>
            );
        } else {
            return <Badge variant="destructive">Poor</Badge>;
        }
    };

    const filteredComments = comments.filter((comment) => {
        const matchesSearch =
            comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getRoomName(comment.roomId)
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            getUserName(comment.userId)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesRating =
            ratingFilter === "all" ||
            comment.rating.toString() === ratingFilter;

        return matchesSearch && matchesRating;
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
                            <CardTitle>Comment Management</CardTitle>
                            <CardDescription>
                                Moderate customer reviews and comments
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search comments..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={ratingFilter}
                            onValueChange={setRatingFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by rating" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Ratings</SelectItem>
                                <SelectItem value="5">5 Stars</SelectItem>
                                <SelectItem value="4">4 Stars</SelectItem>
                                <SelectItem value="3">3 Stars</SelectItem>
                                <SelectItem value="2">2 Stars</SelectItem>
                                <SelectItem value="1">1 Star</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Comment ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredComments.map((comment) => (
                                    <TableRow key={comment.id}>
                                        <TableCell>
                                            <div className="font-mono text-sm">
                                                {comment.id.slice(0, 8)}...
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium flex items-center gap-1">
                                                    <User className="h-3 w-3 text-gray-400" />
                                                    {getUserName(
                                                        comment.userId
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {getUserEmail(
                                                        comment.userId
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-gray-400" />
                                                <span>
                                                    {getRoomName(
                                                        comment.roomId
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(
                                                        comment.rating
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium">
                                                    {comment.rating}/5
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[300px]">
                                                <p className="text-sm truncate">
                                                    {comment.content}
                                                </p>
                                                {comment.content.length >
                                                    50 && (
                                                    <Button
                                                        variant="link"
                                                        className="h-auto p-0 text-xs"
                                                        onClick={() => {
                                                            toast.info(
                                                                comment.content
                                                            );
                                                        }}
                                                    >
                                                        Read more
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {comment.createdAt
                                                    ? format(
                                                          new Date(
                                                              comment.createdAt
                                                          ),
                                                          "MMM dd, yyyy"
                                                      )
                                                    : "N/A"}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {getRatingBadge(comment.rating)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        toast.info(
                                                            `Comment: "${comment.content}"`
                                                        );
                                                    }}
                                                >
                                                    <Eye className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        // TODO: Open edit comment dialog
                                                        toast.info(
                                                            "Edit comment coming soon"
                                                        );
                                                    }}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteComment(
                                                            comment.id
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {filteredComments.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No comments found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
