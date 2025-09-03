import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";

export type BookingFilter = "all" | "upcoming" | "active" | "completed";

interface BookingFiltersProps {
    currentFilter: BookingFilter;
    onFilterChange: (filter: BookingFilter) => void;
    counts: {
        all: number;
        upcoming: number;
        active: number;
        completed: number;
    };
}

export const BookingFilters: React.FC<BookingFiltersProps> = ({
    currentFilter,
    onFilterChange,
    counts,
}) => {
    const filters = [
        {
            key: "all" as const,
            label: "All Bookings",
            icon: Calendar,
            count: counts.all,
            color: "default",
        },
        {
            key: "upcoming" as const,
            label: "Upcoming",
            icon: Clock,
            count: counts.upcoming,
            color: "blue",
        },
        {
            key: "active" as const,
            label: "Active",
            icon: AlertCircle,
            count: counts.active,
            color: "green",
        },
        {
            key: "completed" as const,
            label: "Completed",
            icon: CheckCircle,
            count: counts.completed,
            color: "gray",
        },
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {filters.map((filter) => {
                const IconComponent = filter.icon;
                const isActive = currentFilter === filter.key;

                return (
                    <Button
                        key={filter.key}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilterChange(filter.key)}
                        className="flex items-center gap-2"
                    >
                        <IconComponent className="h-4 w-4" />
                        <span>{filter.label}</span>
                        <Badge
                            variant={isActive ? "secondary" : "outline"}
                            className="ml-1"
                        >
                            {filter.count}
                        </Badge>
                    </Button>
                );
            })}
        </div>
    );
};
