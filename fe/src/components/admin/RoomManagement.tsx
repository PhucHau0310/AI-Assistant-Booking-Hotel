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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Plus,
    Search,
    Trash2,
    Upload,
    Eye,
    MapPin,
    Users,
    DollarSign,
    Edit,
    AlertTriangle,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Room, Location } from "@/types";
import { toast } from "sonner";
import Image from "next/image";

interface CreateRoomForm {
    name: string;
    description: string;
    price: string;
    maxGuests: string;
    locationId: string;
    bedRoom: string;
    bed: string;
    bathRoom: string;
    washingMachine: boolean;
    balcony: boolean;
    tv: boolean;
    airConditioner: boolean;
    wifi: boolean;
    kitchen: boolean;
    parking: boolean;
    swimmingPool: boolean;
}

export default function RoomManagement() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<string>("all");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
    const [createForm, setCreateForm] = useState<CreateRoomForm>({
        name: "",
        description: "",
        price: "",
        maxGuests: "",
        locationId: "",
        bedRoom: "",
        bed: "",
        bathRoom: "",
        washingMachine: false,
        balcony: false,
        tv: false,
        airConditioner: false,
        wifi: false,
        kitchen: false,
        parking: false,
        swimmingPool: false,
    });
    const [editForm, setEditForm] = useState<CreateRoomForm>({
        name: "",
        description: "",
        price: "",
        maxGuests: "",
        locationId: "",
        bedRoom: "",
        bed: "",
        bathRoom: "",
        washingMachine: false,
        balcony: false,
        tv: false,
        airConditioner: false,
        wifi: false,
        kitchen: false,
        parking: false,
        swimmingPool: false,
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [roomsRes, locationsRes] = await Promise.all([
                adminApi.rooms.getAll(),
                adminApi.locations.getAll(),
            ]);

            if (roomsRes.data.statusCode === 200 && roomsRes.data.content) {
                setRooms(roomsRes.data.content);
            }

            if (
                locationsRes.data.statusCode === 200 &&
                locationsRes.data.content
            ) {
                setLocations(locationsRes.data.content);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load rooms and locations");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRoom = async () => {
        // Basic validation
        if (!createForm.name.trim()) {
            toast.error("Room name is required");
            return;
        }
        if (!createForm.description.trim()) {
            toast.error("Room description is required");
            return;
        }
        if (!createForm.price || parseFloat(createForm.price) <= 0) {
            toast.error("Valid price is required");
            return;
        }
        if (!createForm.maxGuests || parseInt(createForm.maxGuests) <= 0) {
            toast.error("Valid max guests number is required");
            return;
        }
        if (!createForm.locationId) {
            toast.error("Location is required");
            return;
        }

        try {
            const response = await adminApi.rooms.create({
                name: createForm.name,
                description: createForm.description,
                price: parseFloat(createForm.price),
                maxGuests: parseInt(createForm.maxGuests),
                locationId: createForm.locationId,
                bedRoom: parseInt(createForm.bedRoom) || 1,
                bed: parseInt(createForm.bed) || 1,
                bathRoom: parseInt(createForm.bathRoom) || 1,
                washingMachine: createForm.washingMachine,
                balcony: createForm.balcony,
                tv: createForm.tv,
                airConditioner: createForm.airConditioner,
                wifi: createForm.wifi,
                kitchen: createForm.kitchen,
                parking: createForm.parking,
                swimmingPool: createForm.swimmingPool,
            });

            if (
                response.data.statusCode === 200 ||
                response.data.statusCode === 201
            ) {
                toast.success("Room created successfully");
                setIsCreateDialogOpen(false);
                resetCreateForm();
                fetchData();
            } else {
                toast.error(response.data.message || "Failed to create room");
            }
        } catch (error) {
            console.error("Error creating room:", error);
            toast.error("Failed to create room");
        }
    };

    const resetCreateForm = () => {
        setCreateForm({
            name: "",
            description: "",
            price: "",
            maxGuests: "",
            locationId: "",
            bedRoom: "",
            bed: "",
            bathRoom: "",
            washingMachine: false,
            balcony: false,
            tv: false,
            airConditioner: false,
            wifi: false,
            kitchen: false,
            parking: false,
            swimmingPool: false,
        });
    };

    const handleDeleteRoom = async (roomId: string) => {
        try {
            const response = await adminApi.rooms.delete(roomId);

            if (response.data.statusCode === 200) {
                toast.success("Room deleted successfully");
                setIsDeleteDialogOpen(false);
                setDeletingRoom(null);
                fetchData();
            } else {
                toast.error(response.data.message || "Failed to delete room");
            }
        } catch (error) {
            console.error("Error deleting room:", error);
            toast.error("Failed to delete room");
        }
    };

    const handleEditRoom = async () => {
        if (!editingRoom) return;

        try {
            const response = await adminApi.rooms.update(editingRoom.id, {
                name: editForm.name,
                description: editForm.description,
                pricePerNight: parseFloat(editForm.price),
                maxGuests: parseInt(editForm.maxGuests),
                locationId: editForm.locationId,
            });

            if (response.data.statusCode === 200) {
                toast.success("Room updated successfully");
                setIsEditDialogOpen(false);
                setEditingRoom(null);
                resetEditForm();
                fetchData();
            } else {
                toast.error(response.data.message || "Failed to update room");
            }
        } catch (error) {
            console.error("Error updating room:", error);
            toast.error("Failed to update room");
        }
    };

    const resetEditForm = () => {
        setEditForm({
            name: "",
            description: "",
            price: "",
            maxGuests: "",
            locationId: "",
            bedRoom: "",
            bed: "",
            bathRoom: "",
            washingMachine: false,
            balcony: false,
            tv: false,
            airConditioner: false,
            wifi: false,
            kitchen: false,
            parking: false,
            swimmingPool: false,
        });
    };

    const openEditDialog = (room: Room) => {
        setEditingRoom(room);
        setEditForm({
            name: room.name,
            description: room.description,
            price: room.price.toString(),
            maxGuests: room.maxGuests?.toString() || "",
            locationId: room.locationId,
            bedRoom: room.bedRoom?.toString() || "",
            bed: room.bed?.toString() || "",
            bathRoom: room.bathRoom?.toString() || "",
            washingMachine: room.washingMachine || false,
            balcony: room.balcony || false,
            tv: room.tv || false,
            airConditioner: room.airConditioner || false,
            wifi: room.wifi || false,
            kitchen: room.kitchen || false,
            parking: room.parking || false,
            swimmingPool: room.swimmingPool || false,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (room: Room) => {
        setDeletingRoom(room);
        setIsDeleteDialogOpen(true);
    };

    const handleImageUpload = async (roomId: string, file: File) => {
        try {
            const response = await adminApi.rooms.uploadImage(roomId, file);

            if (response.data.statusCode === 200) {
                toast.success("Image uploaded successfully");
                fetchData();
            } else {
                toast.error(response.data.message || "Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    const getLocationName = (locationId: string) => {
        const location = locations.find((loc) => loc.id === locationId);
        return location
            ? `${location.name}, ${location.province}`
            : "Unknown Location";
    };

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch =
            room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation =
            selectedLocation === "all" || room.locationId === selectedLocation;
        return matchesSearch && matchesLocation;
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
                {/* Header */}
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Room Management</CardTitle>
                            <CardDescription>
                                Manage hotel rooms, pricing, and availability
                            </CardDescription>
                        </div>

                        {/* Create Room Dialog */}
                        <Dialog
                            open={isCreateDialogOpen}
                            onOpenChange={setIsCreateDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Room
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Create New Room</DialogTitle>
                                    <DialogDescription>
                                        Add a new room to your hotel inventory
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Room Name</Label>
                                        <Input
                                            id="name"
                                            value={createForm.name}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Deluxe Ocean View"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={createForm.description}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Beautiful ocean view room with modern amenities..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="price">
                                                Price per Night
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                value={createForm.price}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        price: e.target.value,
                                                    })
                                                }
                                                placeholder="150.00"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="guests">
                                                Max Guests
                                            </Label>
                                            <Input
                                                id="guests"
                                                type="number"
                                                value={createForm.maxGuests}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        maxGuests:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">
                                            Location
                                        </Label>
                                        <Select
                                            value={createForm.locationId}
                                            onValueChange={(value) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    locationId: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((location) => (
                                                    <SelectItem
                                                        key={location.id}
                                                        value={location.id}
                                                    >
                                                        {location.name},{" "}
                                                        {location.province}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Room Details */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="bedRoom">
                                                Bedrooms
                                            </Label>
                                            <Input
                                                id="bedRoom"
                                                type="number"
                                                value={createForm.bedRoom}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        bedRoom: e.target.value,
                                                    })
                                                }
                                                placeholder="1"
                                                min="1"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="bed">Beds</Label>
                                            <Input
                                                id="bed"
                                                type="number"
                                                value={createForm.bed}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        bed: e.target.value,
                                                    })
                                                }
                                                placeholder="2"
                                                min="1"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="bathRoom">
                                                Bathrooms
                                            </Label>
                                            <Input
                                                id="bathRoom"
                                                type="number"
                                                value={createForm.bathRoom}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        bathRoom:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="1"
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="grid gap-3">
                                        <Label className="text-base font-semibold">
                                            Amenities
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="wifi"
                                                    checked={createForm.wifi}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setCreateForm({
                                                            ...createForm,
                                                            wifi: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="wifi">
                                                    WiFi
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="tv"
                                                    checked={createForm.tv}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setCreateForm({
                                                            ...createForm,
                                                            tv: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="tv">TV</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="airConditioner"
                                                    checked={
                                                        createForm.airConditioner
                                                    }
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setCreateForm({
                                                            ...createForm,
                                                            airConditioner:
                                                                checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="airConditioner">
                                                    Air Conditioner
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="kitchen"
                                                    checked={createForm.kitchen}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setCreateForm({
                                                            ...createForm,
                                                            kitchen: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="kitchen">
                                                    Kitchen
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="washingMachine"
                                                    checked={
                                                        createForm.washingMachine
                                                    }
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setCreateForm({
                                                            ...createForm,
                                                            washingMachine:
                                                                checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="washingMachine">
                                                    Washing Machine
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="parking"
                                                    checked={createForm.parking}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setCreateForm({
                                                            ...createForm,
                                                            parking: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="parking">
                                                    Parking
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="swimmingPool"
                                                    checked={
                                                        createForm.swimmingPool
                                                    }
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setCreateForm({
                                                            ...createForm,
                                                            swimmingPool:
                                                                checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="swimmingPool">
                                                    Swimming Pool
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="balcony"
                                                    checked={createForm.balcony}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setCreateForm({
                                                            ...createForm,
                                                            balcony: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="balcony">
                                                    Balcony
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsCreateDialogOpen(false);
                                            resetCreateForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateRoom}>
                                        Create Room
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Edit Room Dialog */}
                        <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                        >
                            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Edit Room</DialogTitle>
                                    <DialogDescription>
                                        Update room information and amenities
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-name">
                                            Room Name
                                        </Label>
                                        <Input
                                            id="edit-name"
                                            value={editForm.name}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Deluxe Ocean View"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-description">
                                            Description
                                        </Label>
                                        <Textarea
                                            id="edit-description"
                                            value={editForm.description}
                                            onChange={(e) =>
                                                setEditForm({
                                                    ...editForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Beautiful ocean view room with modern amenities..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-price">
                                                Price per Night
                                            </Label>
                                            <Input
                                                id="edit-price"
                                                type="number"
                                                value={editForm.price}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        price: e.target.value,
                                                    })
                                                }
                                                placeholder="150.00"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-guests">
                                                Max Guests
                                            </Label>
                                            <Input
                                                id="edit-guests"
                                                type="number"
                                                value={editForm.maxGuests}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        maxGuests:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="2"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-location">
                                            Location
                                        </Label>
                                        <Select
                                            value={editForm.locationId}
                                            onValueChange={(value) =>
                                                setEditForm({
                                                    ...editForm,
                                                    locationId: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a location" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {locations.map((location) => (
                                                    <SelectItem
                                                        key={location.id}
                                                        value={location.id}
                                                    >
                                                        {location.name},{" "}
                                                        {location.province}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Room Details */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-bedRoom">
                                                Bedrooms
                                            </Label>
                                            <Input
                                                id="edit-bedRoom"
                                                type="number"
                                                value={editForm.bedRoom}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        bedRoom: e.target.value,
                                                    })
                                                }
                                                placeholder="1"
                                                min="1"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-bed">
                                                Beds
                                            </Label>
                                            <Input
                                                id="edit-bed"
                                                type="number"
                                                value={editForm.bed}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        bed: e.target.value,
                                                    })
                                                }
                                                placeholder="2"
                                                min="1"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-bathRoom">
                                                Bathrooms
                                            </Label>
                                            <Input
                                                id="edit-bathRoom"
                                                type="number"
                                                value={editForm.bathRoom}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        bathRoom:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="1"
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="grid gap-3">
                                        <Label className="text-base font-semibold">
                                            Amenities
                                        </Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-wifi"
                                                    checked={editForm.wifi}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            wifi: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="edit-wifi">
                                                    WiFi
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-tv"
                                                    checked={editForm.tv}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            tv: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="edit-tv">
                                                    TV
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-airConditioner"
                                                    checked={
                                                        editForm.airConditioner
                                                    }
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            airConditioner:
                                                                checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="edit-airConditioner">
                                                    Air Conditioner
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-kitchen"
                                                    checked={editForm.kitchen}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            kitchen: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="edit-kitchen">
                                                    Kitchen
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-washingMachine"
                                                    checked={
                                                        editForm.washingMachine
                                                    }
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            washingMachine:
                                                                checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="edit-washingMachine">
                                                    Washing Machine
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-parking"
                                                    checked={editForm.parking}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            parking: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="edit-parking">
                                                    Parking
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-swimmingPool"
                                                    checked={
                                                        editForm.swimmingPool
                                                    }
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            swimmingPool:
                                                                checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="edit-swimmingPool">
                                                    Swimming Pool
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="edit-balcony"
                                                    checked={editForm.balcony}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        setEditForm({
                                                            ...editForm,
                                                            balcony: checked,
                                                        })
                                                    }
                                                />
                                                <Label htmlFor="edit-balcony">
                                                    Balcony
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditDialogOpen(false);
                                            setEditingRoom(null);
                                            resetEditForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleEditRoom}>
                                        Update Room
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Delete Confirmation Dialog */}
                        <Dialog
                            open={isDeleteDialogOpen}
                            onOpenChange={setIsDeleteDialogOpen}
                        >
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                        Confirm Deletion
                                    </DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to delete this
                                        room? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                {deletingRoom && (
                                    <div className="py-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                                    {deletingRoom.picture ? (
                                                        <Image
                                                            src={
                                                                process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                    /\/api$/,
                                                                    ""
                                                                ) +
                                                                deletingRoom.picture
                                                            }
                                                            alt={
                                                                deletingRoom.name
                                                            }
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <Eye className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">
                                                        {deletingRoom.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {getLocationName(
                                                            deletingRoom.locationId
                                                        )}
                                                    </p>
                                                    <p className="text-sm font-medium text-green-600">
                                                        ${deletingRoom.price}
                                                        /night
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsDeleteDialogOpen(false);
                                            setDeletingRoom(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            deletingRoom &&
                                            handleDeleteRoom(deletingRoom.id)
                                        }
                                    >
                                        Delete Room
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>

                {/* Content */}
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search rooms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={selectedLocation}
                            onValueChange={setSelectedLocation}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by location" />
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
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Room Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Price/Night</TableHead>
                                    <TableHead>Max Guests</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRooms.map((room) => (
                                    <TableRow key={room.id}>
                                        <TableCell>
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                                {room.picture ? (
                                                    <Image
                                                        src={
                                                            process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                /\/api$/,
                                                                ""
                                                            ) + room.picture
                                                        }
                                                        alt={room.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <Eye className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {room.name}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                                    {room.description}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-gray-400" />
                                                <span className="text-sm">
                                                    {getLocationName(
                                                        room.locationId
                                                    )}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="h-3 w-3 text-green-600" />
                                                <span className="font-medium">
                                                    {room.price}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3 text-gray-400" />
                                                <span>
                                                    {room.maxGuests ?? "5"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-green-600 border-green-600"
                                            >
                                                Available
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openEditDialog(room)
                                                    }
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const input =
                                                            document.createElement(
                                                                "input"
                                                            );
                                                        input.type = "file";
                                                        input.accept =
                                                            "image/*";
                                                        input.onchange = (
                                                            e
                                                        ) => {
                                                            const file = (
                                                                e.target as HTMLInputElement
                                                            ).files?.[0];
                                                            if (file) {
                                                                handleImageUpload(
                                                                    room.id,
                                                                    file
                                                                );
                                                            }
                                                        };
                                                        input.click();
                                                    }}
                                                >
                                                    <Upload className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openDeleteDialog(room)
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

                    {filteredRooms.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No rooms found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
