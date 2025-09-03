"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Star, Wifi, Tv, MapPin, Calendar, Users } from "lucide-react";
import Anywhere from "@/components/features/Anywhere";
import { useState, useEffect } from "react";
import { roomApi, locationApi } from "@/lib/api";
import type { Room, Location } from "@/types";
import { LocationSearch } from "@/components/ui/LocationSearch";
import { RoomCardSkeleton } from "@/components/ui/SkeletonCards";

export default function HomePage() {
    const [featuredRooms, setFeaturedRooms] = useState<Room[]>([]);
    const [popularDestinations, setPopularDestinations] = useState<Location[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useState({
        location: "",
        locationId: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Fetch featured rooms
                const roomsResponse = await roomApi.getAllRooms();
                if (roomsResponse.content) {
                    // Take first 3 rooms as featured
                    setFeaturedRooms(roomsResponse.content.slice(0, 3));
                }

                // Fetch popular destinations
                const locationsResponse = await locationApi.getAllLocations();
                if (locationsResponse.content) {
                    // Take first 3 locations as popular destinations
                    setPopularDestinations(
                        locationsResponse.content.slice(0, 3)
                    );
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please refresh the page.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async () => {
        try {
            // Implement search functionality
            const searchData: any = {};

            if (searchParams.locationId) {
                searchData.locationId = searchParams.locationId;
            }

            // Add other search parameters as needed
            if (searchParams.guests > 1) {
                searchData.maxGuests = searchParams.guests;
            }

            const response = await roomApi.searchRooms(searchData);
            if (response.content) {
                setFeaturedRooms(response.content);
            }
        } catch (error) {
            console.error("Error searching rooms:", error);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setSearchParams((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleLocationSelect = (location: Location) => {
        setSearchParams((prev) => ({
            ...prev,
            location: `${location.name}, ${location.province}`,
            locationId: location.id,
        }));
    };

    const handleLocationInputChange = (value: string) => {
        setSearchParams((prev) => ({
            ...prev,
            location: value,
            locationId: value === "" ? "" : prev.locationId,
        }));
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-44">
                {/* Video Background */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src="/videos/videoBanner.mp4" type="video/mp4" />
                </video>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
                <div className="relative z-10 container mx-auto px-4 text-center text-white">
                    <h1 className="text-5xl font-bold mb-6">
                        Find Your Perfect Stay
                    </h1>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Discover amazing places to stay from local hosts in over
                        190 countries
                    </p>

                    {/* Search Form */}
                    <Card className="max-w-4xl mx-auto bg-white text-gray-900">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium"
                                        htmlFor="location-search"
                                    >
                                        Where
                                    </label>
                                    <LocationSearch
                                        value={searchParams.location}
                                        onLocationSelect={handleLocationSelect}
                                        onInputChange={
                                            handleLocationInputChange
                                        }
                                        placeholder="Search destinations"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium"
                                        htmlFor="check-in"
                                    >
                                        Check-in
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="check-in"
                                            type="date"
                                            className="pl-10"
                                            value={searchParams.checkIn}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "checkIn",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium"
                                        htmlFor="check-out"
                                    >
                                        Check-out
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="check-out"
                                            type="date"
                                            className="pl-10"
                                            value={searchParams.checkOut}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "checkOut",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium"
                                        htmlFor="guests"
                                    >
                                        Guests
                                    </label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="guests"
                                            type="number"
                                            placeholder="2"
                                            className="pl-10"
                                            min="1"
                                            value={searchParams.guests}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "guests",
                                                    parseInt(e.target.value) ||
                                                        1
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
                                onClick={handleSearch}
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Featured Rooms */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Featured Accommodations
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover our handpicked selection of exceptional
                            places to stay
                        </p>
                    </div>

                    {error && (
                        <div className="text-center py-12">
                            <div className="text-red-600 mb-4">{error}</div>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                            >
                                Retry
                            </Button>
                        </div>
                    )}

                    {!error && isLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }, (_, i) => (
                                <RoomCardSkeleton
                                    key={`room-skeleton-${i + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {!error && !isLoading && featuredRooms.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-600 mb-4">
                                No rooms available at the moment.
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                variant="outline"
                            >
                                Refresh
                            </Button>
                        </div>
                    )}

                    {!error && !isLoading && featuredRooms.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredRooms.map((room) => (
                                <Card
                                    key={room.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow"
                                >
                                    <div className="aspect-video bg-gray-200 relative">
                                        <img
                                            src={
                                                process.env.NEXT_PUBLIC_API_URL?.replace(
                                                    /\/api$/,
                                                    ""
                                                ) && room.picture
                                                    ? process.env.NEXT_PUBLIC_API_URL.replace(
                                                          /\/api$/,
                                                          ""
                                                      ) + room.picture
                                                    : `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop&crop=center`
                                            }
                                            alt={room.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=240&fit=crop&crop=center`;
                                            }}
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-lg">
                                                {room.name}
                                            </h3>
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium ml-1">
                                                    4.5
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {room.location?.name ||
                                                "Unknown Location"}
                                        </p>
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="text-gray-500">
                                                <Wifi className="h-4 w-4" />
                                            </div>
                                            <div className="text-gray-500">
                                                <Tv className="h-4 w-4" />
                                            </div>
                                            <div className="text-gray-500">
                                                <Users className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                Max {room.maxGuests} guests
                                            </span>
                                        </div>
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

                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/rooms">Browse All Rooms</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Popular Destinations */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Popular Destinations
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore the most sought-after destinations across
                            Vietnam
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {popularDestinations.map((destination) => (
                            <Card
                                key={destination.id}
                                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-square bg-gray-200 relative">
                                    <img
                                        src={
                                            process.env.NEXT_PUBLIC_API_URL &&
                                            destination.image
                                                ? process.env.NEXT_PUBLIC_API_URL.replace(
                                                      /\/api$/,
                                                      ""
                                                  ) + destination.image
                                                : `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center`
                                        }
                                        alt={destination.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center`;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-opacity-40 flex items-end">
                                        <div className="text-white p-6">
                                            <h3 className="text-xl font-bold mb-2">
                                                {destination.name}
                                            </h3>
                                            <p className="text-sm mb-2">
                                                {destination.description ||
                                                    `Explore ${destination.name}, ${destination.province}`}
                                            </p>
                                            <p className="text-xs opacity-90">
                                                {destination.province},{" "}
                                                {destination.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Anywhere />

            {/* CTA Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to start your journey?
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Join millions of travelers who trust us to find their
                        perfect accommodation
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/auth/register">Sign Up Now</Link>
                        </Button>
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/rooms">Explore Rooms</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
