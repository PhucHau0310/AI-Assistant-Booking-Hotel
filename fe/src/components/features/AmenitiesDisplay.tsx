import {
    Wifi,
    Tv,
    Car,
    Waves,
    Snowflake,
    ChefHat,
    WashingMachine,
    Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Room } from "@/types";

interface AmenitiesDisplayProps {
    room: Room;
    variant?: "badges" | "icons" | "list";
    className?: string;
}

export const AmenitiesDisplay: React.FC<AmenitiesDisplayProps> = ({
    room,
    variant = "badges",
    className = "",
}) => {
    const amenities = [
        { key: "wifi", label: "WiFi", icon: Wifi, available: room.wifi },
        { key: "tv", label: "TV", icon: Tv, available: room.tv },
        {
            key: "parking",
            label: "Parking",
            icon: Car,
            available: room.parking,
        },
        {
            key: "swimmingPool",
            label: "Swimming Pool",
            icon: Waves,
            available: room.swimmingPool,
        },
        {
            key: "airConditioner",
            label: "Air Conditioner",
            icon: Snowflake,
            available: room.airConditioner,
        },
        {
            key: "kitchen",
            label: "Kitchen",
            icon: ChefHat,
            available: room.kitchen,
        },
        {
            key: "washingMachine",
            label: "Washing Machine",
            icon: WashingMachine,
            available: room.washingMachine,
        },
        {
            key: "balcony",
            label: "Balcony",
            icon: Building,
            available: room.balcony,
        },
    ];

    const availableAmenities = amenities.filter((amenity) => amenity.available);

    if (variant === "badges") {
        return (
            <div className={`flex flex-wrap gap-2 ${className}`}>
                {availableAmenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                        <Badge
                            key={amenity.key}
                            variant="secondary"
                            className="flex items-center gap-1"
                        >
                            <IconComponent className="h-4 w-4" />
                            {amenity.label}
                        </Badge>
                    );
                })}
            </div>
        );
    }

    if (variant === "icons") {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {availableAmenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                        <div
                            key={amenity.key}
                            className="text-gray-500"
                            title={amenity.label}
                        >
                            <IconComponent className="h-4 w-4" />
                        </div>
                    );
                })}
            </div>
        );
    }

    if (variant === "list") {
        return (
            <div className={`grid grid-cols-2 gap-2 ${className}`}>
                {availableAmenities.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                        <div
                            key={amenity.key}
                            className="flex items-center gap-2 text-sm"
                        >
                            <IconComponent className="h-4 w-4 text-gray-500" />
                            <span>{amenity.label}</span>
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
};
