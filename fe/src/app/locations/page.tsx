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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import {
    Search,
    MapPin,
    Globe,
    Building,
    Users,
    Loader2,
    Map,
    Eye,
} from "lucide-react";
import { locationApi, roomApi } from "@/lib/api";
import type { Location, Room } from "@/types";
import { toast } from "sonner";
import { MapView } from "@/components/features/MapView";
import { LocationStats } from "@/components/features/LocationStats";

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCountry, setSelectedCountry] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
        null
    );
    const [locationRooms, setLocationRooms] = useState<Room[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);
    const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);

    useEffect(() => {
        loadLocations();
    }, []);

    useEffect(() => {
        filterLocations();
    }, [locations, searchQuery, selectedCountry]);

    const loadLocations = async () => {
        try {
            setIsLoading(true);
            const response = await locationApi.getAllLocations();
            if (response.content) {
                setLocations(response.content);
            }
        } catch (error) {
            console.error("Error loading locations:", error);
            toast.error("Failed to load locations");
        } finally {
            setIsLoading(false);
        }
    };

    const filterLocations = () => {
        let filtered = locations;

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(
                (location) =>
                    location.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    location.province
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    location.country
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    location.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Filter by country
        if (selectedCountry !== "all") {
            filtered = filtered.filter(
                (location) =>
                    location.country.toLowerCase() ===
                    selectedCountry.toLowerCase()
            );
        }

        setFilteredLocations(filtered);
    };

    const loadLocationRooms = async (locationId: string) => {
        try {
            setIsLoadingRooms(true);
            const response = await roomApi.searchRooms({ locationId });
            if (response.content) {
                setLocationRooms(response.content);
            }
        } catch (error) {
            console.error("Error loading location rooms:", error);
            toast.error("Failed to load rooms for this location");
        } finally {
            setIsLoadingRooms(false);
        }
    };

    const handleLocationClick = (location: Location) => {
        setSelectedLocation(location);
        loadLocationRooms(location.id);
        setIsMapDialogOpen(true);
    };

    // Get unique countries for filter
    const countries = Array.from(
        new Set(locations.map((location) => location.country))
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading locations...</p>
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
                        Explore Destinations
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Discover amazing places around the world with{" "}
                        {locations.length} destinations
                    </p>

                    {/* Location Statistics */}
                    <LocationStats locations={locations} />
                </div>
            </section>

            {/* Filters */}
            <section className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative md:col-span-2">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search destinations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select
                            value={selectedCountry}
                            onValueChange={setSelectedCountry}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Countries
                                </SelectItem>
                                {countries.map((country) => (
                                    <SelectItem key={country} value={country}>
                                        {country}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">
                            {filteredLocations.length} destination
                            {filteredLocations.length !== 1 ? "s" : ""} found
                        </h2>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCountry("all");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>

                    {filteredLocations.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">
                                No destinations found matching your criteria
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCountry("all");
                                }}
                            >
                                Clear all filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredLocations.map((location) => (
                                <Card
                                    key={location.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() =>
                                        handleLocationClick(location)
                                    }
                                >
                                    <div className="aspect-video bg-gray-200 relative">
                                        <img
                                            src={
                                                (process.env.NEXT_PUBLIC_API_URL?.replace(
                                                    /\/api$/,
                                                    ""
                                                ) ?? "") +
                                                    (location.image ?? "") ||
                                                `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop&crop=center`
                                            }
                                            alt={location.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop&crop=center`;
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-opacity-40 flex items-end">
                                            <div className="text-white p-4 w-full">
                                                <h3 className="text-xl font-bold mb-1">
                                                    {location.name}
                                                </h3>
                                                <div className="flex items-center text-sm opacity-90">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {location.province},{" "}
                                                    {location.country}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <Badge
                                                variant="secondary"
                                                className="bg-white/90"
                                            >
                                                <Map className="h-3 w-3 mr-1" />
                                                View Map
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardContent className="p-6">
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {location.description ||
                                                `Discover the beauty and culture of ${location.name} in ${location.province}. A wonderful destination with amazing experiences waiting for you.`}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Globe className="h-4 w-4 mr-1" />
                                                {location.country}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLocationClick(
                                                        location
                                                    );
                                                }}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                Explore
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Location Details Modal */}
            <Dialog open={isMapDialogOpen} onOpenChange={setIsMapDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {selectedLocation && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    {selectedLocation.name}
                                </DialogTitle>
                                <DialogDescription>
                                    {selectedLocation.province},{" "}
                                    {selectedLocation.country}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                                {/* Location Image */}
                                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={
                                            (process.env.NEXT_PUBLIC_API_URL?.replace(
                                                /\/api$/,
                                                ""
                                            ) ?? "") +
                                                (selectedLocation.image ??
                                                    "") ||
                                            `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center`
                                        }
                                        alt={selectedLocation.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop&crop=center`;
                                        }}
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        About {selectedLocation.name}
                                    </h3>
                                    <p className="text-gray-600">
                                        {selectedLocation.description ||
                                            `${selectedLocation.name} is a beautiful destination in ${selectedLocation.province}, ${selectedLocation.country}. Experience the local culture, amazing food, and breathtaking views that this location has to offer.`}
                                    </p>
                                </div>

                                {/* Map Section */}
                                <div>
                                    <MapView
                                        locationName={selectedLocation.name}
                                        province={selectedLocation.province}
                                        country={selectedLocation.country}
                                    />
                                </div>

                                {/* Available Rooms */}
                                <div>
                                    <h3 className="font-semibold mb-4">
                                        Available Accommodations
                                    </h3>
                                    {isLoadingRooms && (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                            <span className="ml-2">
                                                Loading rooms...
                                            </span>
                                        </div>
                                    )}

                                    {!isLoadingRooms &&
                                        locationRooms.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {locationRooms
                                                    .slice(0, 4)
                                                    .map((room) => (
                                                        <Card
                                                            key={room.id}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="aspect-video bg-gray-200 relative">
                                                                <img
                                                                    src={
                                                                        (process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                            /\/api$/,
                                                                            ""
                                                                        ) ??
                                                                            "") +
                                                                            (room.picture ??
                                                                                "") ||
                                                                        `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop`
                                                                    }
                                                                    alt={
                                                                        room.name
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.currentTarget.src = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop`;
                                                                    }}
                                                                />
                                                                <div className="absolute top-2 right-2">
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="bg-white/90"
                                                                    >
                                                                        $
                                                                        {
                                                                            room.price
                                                                        }
                                                                        /night
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                            <CardContent className="p-4">
                                                                <h4 className="font-medium mb-2">
                                                                    {room.name}
                                                                </h4>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                                    <Users className="h-4 w-4" />
                                                                    <span>
                                                                        Max{" "}
                                                                        {room.maxGuests ||
                                                                            room.bed}{" "}
                                                                        guests
                                                                    </span>
                                                                    <span>
                                                                        •
                                                                    </span>
                                                                    <Building className="h-4 w-4" />
                                                                    <span>
                                                                        {
                                                                            room.bedRoom
                                                                        }{" "}
                                                                        bed
                                                                        {room.bedRoom !==
                                                                        1
                                                                            ? "s"
                                                                            : ""}
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    asChild
                                                                    size="sm"
                                                                    className="w-full"
                                                                >
                                                                    <Link
                                                                        href={`/rooms/${room.id}`}
                                                                    >
                                                                        View
                                                                        Details
                                                                    </Link>
                                                                </Button>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                            </div>
                                        )}

                                    {!isLoadingRooms &&
                                        locationRooms.length === 0 && (
                                            <div className="text-center py-8 text-gray-500">
                                                No accommodations available in
                                                this location yet.
                                            </div>
                                        )}

                                    {locationRooms.length > 4 && (
                                        <div className="text-center mt-4">
                                            <Button variant="outline" asChild>
                                                <Link
                                                    href={`/rooms?location=${selectedLocation.id}`}
                                                >
                                                    View All{" "}
                                                    {locationRooms.length}{" "}
                                                    Accommodations
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
