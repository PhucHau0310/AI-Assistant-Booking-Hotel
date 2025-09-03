import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Star, MessageSquare } from "lucide-react";
import Link from "next/link";

export const BookingQuickActions = () => {
    const actions = [
        {
            title: "Book New Room",
            description: "Find and book your next perfect stay",
            icon: Search,
            href: "/rooms",
            color: "bg-blue-50 text-blue-600 hover:bg-blue-100",
        },
        {
            title: "Explore Locations",
            description: "Discover amazing destinations",
            icon: Calendar,
            href: "/locations",
            color: "bg-green-50 text-green-600 hover:bg-green-100",
        },
        {
            title: "Leave a Review",
            description: "Share your experience with others",
            icon: Star,
            href: "/rooms",
            color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
        },
        {
            title: "Contact Support",
            description: "Get help with your bookings",
            icon: MessageSquare,
            href: "/contact",
            color: "bg-purple-50 text-purple-600 hover:bg-purple-100",
        },
    ];

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action) => {
                    const IconComponent = action.icon;
                    return (
                        <Card
                            key={action.title}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardContent className="p-4">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="w-full h-auto p-0 flex flex-col items-center space-y-2"
                                >
                                    <Link href={action.href}>
                                        <div
                                            className={`p-3 rounded-full ${action.color}`}
                                        >
                                            <IconComponent className="h-6 w-6" />
                                        </div>
                                        <div className="text-center">
                                            <div className="font-medium text-sm">
                                                {action.title}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {action.description}
                                            </div>
                                        </div>
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
