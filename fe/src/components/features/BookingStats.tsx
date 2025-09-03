import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CreditCard, MapPin } from "lucide-react";
import type { Booking } from "@/types";

interface BookingStatsProps {
    bookings: Booking[];
}

export const BookingStats: React.FC<BookingStatsProps> = ({ bookings }) => {
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce(
        (sum, booking) => sum + booking.totalPrice,
        0
    );

    const upcomingBookings = bookings.filter((booking) => {
        const checkInDate = new Date(booking.checkInDate);
        return checkInDate > new Date();
    }).length;

    const completedBookings = bookings.filter((booking) => {
        const checkOutDate = new Date(booking.checkOutDate);
        return checkOutDate < new Date();
    }).length;

    const stats = [
        {
            title: "Total Bookings",
            value: totalBookings,
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Upcoming",
            value: upcomingBookings,
            icon: Clock,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Completed",
            value: completedBookings,
            icon: MapPin,
            color: "text-gray-600",
            bgColor: "bg-gray-50",
        },
        // {
        //     title: "Total Spent",
        //     value: `$${totalSpent.toLocaleString()}`,
        //     icon: CreditCard,
        //     color: "text-purple-600",
        //     bgColor: "bg-purple-50",
        // },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                    <Card key={stat.title}>
                        <CardContent className="p-4">
                            <div className="flex items-center">
                                <div
                                    className={`p-2 rounded-lg ${stat.bgColor} mr-3`}
                                >
                                    <IconComponent
                                        className={`h-5 w-5 ${stat.color}`}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-xl font-semibold">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
