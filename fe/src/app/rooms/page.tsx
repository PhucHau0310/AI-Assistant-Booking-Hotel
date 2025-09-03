"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import {
    Search,
    Wifi,
    Car,
    Tv,
    Waves,
    MapPin,
    Bed,
    Bath,
    Users,
    Snowflake,
    ChefHat,
} from "lucide-react";
import { roomApi, locationApi } from "@/lib/api";
import type { Room, Location } from "@/types";
import { toast } from "sonner";

export default function RoomsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState("all");
    const [bedrooms, setBedrooms] = useState("all");
    const [selectedLocation, setSelectedLocation] = useState("all");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [roomsResponse, locationsResponse] = await Promise.all([
                roomApi.getAllRooms(),
                locationApi.getAllLocations(),
            ]);

            if (roomsResponse.statusCode === 200 && roomsResponse.content) {
                setRooms(roomsResponse.content);
            }

            if (
                locationsResponse.statusCode === 200 &&
                locationsResponse.content
            ) {
                setLocations(locationsResponse.content);
            }
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load rooms");
        } finally {
            setIsLoading(false);
        }
    };

    const getAmenityIcon = (amenity: string) => {
        switch (amenity) {
            case "wifi":
                return <Wifi className="h-4 w-4" />;
            case "tv":
                return <Tv className="h-4 w-4" />;
            case "swimmingPool":
                return <Waves className="h-4 w-4" />;
            case "parking":
                return <Car className="h-4 w-4" />;
            case "airConditioner":
                return <Snowflake className="h-4 w-4" />;
            case "kitchen":
                return <ChefHat className="h-4 w-4" />;
            default:
                return null;
        }
    };

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            room.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPrice =
            priceRange === "all" ||
            (priceRange === "0-50" && room.price <= 50) ||
            (priceRange === "50-100" && room.price > 50 && room.price <= 100) ||
            (priceRange === "100-200" &&
                room.price > 100 &&
                room.price <= 200) ||
            (priceRange === "200+" && room.price > 200);

        const matchesBedrooms =
            bedrooms === "all" || room.bedRoom.toString() === bedrooms;

        const matchesLocation =
            selectedLocation === "all" || room.locationId === selectedLocation;

        return (
            matchesSearch && matchesPrice && matchesBedrooms && matchesLocation
        );
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p>Loading rooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-2">
                        Find Your Perfect Stay
                    </h1>
                    <p className="text-gray-600">
                        Browse through our collection of {rooms.length} amazing
                        rooms
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search rooms..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={selectedLocation}
                            onValueChange={setSelectedLocation}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Locations
                                </SelectItem>
                                {locations.map((location) => (
                                    <SelectItem
                                        key={location.id}
                                        value={location.id}
                                    >
                                        {location.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={priceRange}
                            onValueChange={setPriceRange}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Prices</SelectItem>
                                <SelectItem value="0-50">$0 - $50</SelectItem>
                                <SelectItem value="50-100">
                                    $50 - $100
                                </SelectItem>
                                <SelectItem value="100-200">
                                    $100 - $200
                                </SelectItem>
                                <SelectItem value="200+">$200+</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={bedrooms} onValueChange={setBedrooms}>
                            <SelectTrigger>
                                <SelectValue placeholder="Bedrooms" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Any Bedrooms
                                </SelectItem>
                                <SelectItem value="1">1 Bedroom</SelectItem>
                                <SelectItem value="2">2 Bedrooms</SelectItem>
                                <SelectItem value="3">3 Bedrooms</SelectItem>
                                <SelectItem value="4">4+ Bedrooms</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setPriceRange("all");
                                setBedrooms("all");
                                setSelectedLocation("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {filteredRooms.length} room
                            {filteredRooms.length !== 1 ? "s" : ""} found
                        </h2>
                    </div>

                    {filteredRooms.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">
                                No rooms found matching your criteria
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("");
                                    setPriceRange("all");
                                    setBedrooms("all");
                                    setSelectedLocation("all");
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRooms.map((room) => (
                                <Card
                                    key={room.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-video bg-gray-200 relative">
                                        <img
                                            src={
                                                (process.env.NEXT_PUBLIC_API_URL?.replace(
                                                    /\/api$/,
                                                    ""
                                                ) && room.picture
                                                    ? process.env.NEXT_PUBLIC_API_URL.replace(
                                                          /\/api$/,
                                                          ""
                                                      ) + room.picture
                                                    : `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop&crop=center`) ||
                                                `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop&crop=center`
                                            }
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop&crop=center`;
                                            }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge
                                                variant="secondary"
                                                className="bg-white/90"
                                            >
                                                ${room.price}/night
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-lg mb-2">
                                            {room.name}
                                        </h3>

                                        {room.location && (
                                            <p className="text-gray-600 text-sm mb-3 flex items-center">
                                                <MapPin className="h-4 w-4 mr-1" />
                                                {room.location.name}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Bed className="h-4 w-4 mr-1" />
                                                {room.bedRoom} bedroom
                                                {room.bedRoom !== 1 ? "s" : ""}
                                            </div>
                                            <div className="flex items-center">
                                                <Bath className="h-4 w-4 mr-1" />
                                                {room.bathRoom} bathroom
                                                {room.bathRoom !== 1 ? "s" : ""}
                                            </div>
                                            <div className="flex items-center">
                                                <Bed className="h-4 w-4 mr-1" />
                                                {room.bed} bed
                                                {room.bed !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                        <div className="flex items-center mb-4">
                                            <Users className="h-4 w-4 mr-1" />
                                            {room.maxGuests ?? 5} guest
                                            {room.maxGuests !== 1 ? "s" : ""}
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            {room.wifi &&
                                                getAmenityIcon("wifi")}
                                            {room.tv && getAmenityIcon("tv")}
                                            {room.swimmingPool &&
                                                getAmenityIcon("swimmingPool")}
                                            {room.parking &&
                                                getAmenityIcon("parking")}
                                            {room.airConditioner &&
                                                getAmenityIcon(
                                                    "airConditioner"
                                                )}
                                            {room.kitchen &&
                                                getAmenityIcon("kitchen")}
                                        </div>

                                        {room.description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {room.description}
                                            </p>
                                        )}

                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="text-2xl font-bold">
                                                    ${room.price}
                                                </span>
                                                <span className="text-gray-600 text-sm">
                                                    /night
                                                </span>
                                            </div>
                                            <Button asChild>
                                                <Link
                                                    href={`/rooms/${room.id}`}
                                                >
                                                    View Details
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
