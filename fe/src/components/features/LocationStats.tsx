import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Building, Globe, Star } from "lucide-react";
import type { Location } from "@/types";

interface LocationStatsProps {
    locations: Location[];
    className?: string;
}

export const LocationStats: React.FC<LocationStatsProps> = ({
    locations,
    className = "",
}) => {
    // Calculate stats
    const totalLocations = locations.length;
    const uniqueCountries = new Set(
        locations.map((location) => location.country)
    ).size;
    const uniqueProvinces = new Set(
        locations.map((location) => location.province)
    ).size;

    // Most popular country (by number of locations)
    const countryCount = locations.reduce((acc, location) => {
        acc[location.country] = (acc[location.country] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostPopularCountry = Object.entries(countryCount).reduce(
        (max, [country, count]) =>
            count > max.count ? { country, count } : max,
        { country: "", count: 0 }
    );

    const stats = [
        {
            title: "Total Destinations",
            value: totalLocations,
            icon: MapPin,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Countries",
            value: uniqueCountries,
            icon: Globe,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Provinces",
            value: uniqueProvinces,
            icon: Building,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Top Country",
            value: mostPopularCountry.country || "N/A",
            subtitle:
                mostPopularCountry.count > 0
                    ? `${mostPopularCountry.count} locations`
                    : "",
            icon: Star,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
    ];

    return (
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
            {stats.map((stat) => {
                const IconComponent = stat.icon;
                return (
                    <Card key={stat.title} className="overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {typeof stat.value === "number" &&
                                        stat.value > 999
                                            ? `${(stat.value / 1000).toFixed(
                                                  1
                                              )}k`
                                            : stat.value}
                                    </p>
                                    {stat.subtitle && (
                                        <p className="text-xs text-muted-foreground">
                                            {stat.subtitle}
                                        </p>
                                    )}
                                </div>
                                <div
                                    className={`${stat.bgColor} p-3 rounded-full`}
                                >
                                    <IconComponent
                                        className={`h-6 w-6 ${stat.color}`}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};
