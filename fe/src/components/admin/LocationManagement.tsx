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
    Plus,
    Search,
    Edit,
    Trash2,
    Upload,
    MapPin,
    Building,
    AlertTriangle,
} from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Location } from "@/types";
import { toast } from "sonner";
import Image from "next/image";

interface CreateLocationForm {
    name: string;
    province: string;
    country: string;
    description: string;
}

export default function LocationManagement() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(
        null
    );
    const [deletingLocation, setDeletingLocation] = useState<Location | null>(
        null
    );
    const [createForm, setCreateForm] = useState<CreateLocationForm>({
        name: "",
        province: "",
        country: "",
        description: "",
    });
    const [editForm, setEditForm] = useState<CreateLocationForm>({
        name: "",
        province: "",
        country: "",
        description: "",
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const response = await adminApi.locations.getAll();

            if (response.data.statusCode === 200 && response.data.content) {
                setLocations(response.data.content);
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
            toast.error("Failed to load locations");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateLocation = async () => {
        // Basic validation
        if (!createForm.name.trim()) {
            toast.error("Location name is required");
            return;
        }
        if (!createForm.province.trim()) {
            toast.error("City/Province is required");
            return;
        }
        if (!createForm.country.trim()) {
            toast.error("Country is required");
            return;
        }

        try {
            const response = await adminApi.locations.create(createForm);

            if (
                response.data.statusCode === 200 ||
                response.data.statusCode === 201
            ) {
                toast.success("Location created successfully");
                setIsCreateDialogOpen(false);
                resetCreateForm();
                fetchLocations();
            } else {
                toast.error(
                    response.data.message || "Failed to create location"
                );
            }
        } catch (error) {
            console.error("Error creating location:", error);
            toast.error("Failed to create location");
        }
    };

    const handleDeleteLocation = async (locationId: string) => {
        try {
            const response = await adminApi.locations.delete(locationId);

            if (response.data.statusCode === 200) {
                toast.success("Location deleted successfully");
                setIsDeleteDialogOpen(false);
                setDeletingLocation(null);
                fetchLocations();
            } else {
                toast.error(
                    response.data.message || "Failed to delete location"
                );
            }
        } catch (error) {
            console.error("Error deleting location:", error);
            toast.error("Failed to delete location");
        }
    };

    const openDeleteDialog = (location: Location) => {
        setDeletingLocation(location);
        setIsDeleteDialogOpen(true);
    };

    const handleEditLocation = async () => {
        if (!selectedLocation) return;

        try {
            const response = await adminApi.locations.update(
                selectedLocation.id,
                {
                    name: editForm.name,
                    city: editForm.province,
                    country: editForm.country,
                    description: editForm.description,
                }
            );

            if (response.data.statusCode === 200) {
                toast.success("Location updated successfully");
                setIsEditDialogOpen(false);
                setSelectedLocation(null);
                resetEditForm();
                fetchLocations();
            } else {
                toast.error(
                    response.data.message || "Failed to update location"
                );
            }
        } catch (error) {
            console.error("Error updating location:", error);
            toast.error("Failed to update location");
        }
    };

    const openEditDialog = (location: Location) => {
        setSelectedLocation(location);
        setEditForm({
            name: location.name,
            province: location.province,
            country: location.country,
            description: location.description || "",
        });
        setIsEditDialogOpen(true);
    };

    const resetCreateForm = () => {
        setCreateForm({
            name: "",
            province: "",
            country: "",
            description: "",
        });
    };

    const resetEditForm = () => {
        setEditForm({
            name: "",
            province: "",
            country: "",
            description: "",
        });
    };

    const handleImageUpload = async (locationId: string, file: File) => {
        try {
            const response = await adminApi.locations.uploadImage(
                locationId,
                file
            );

            if (response.data.statusCode === 200) {
                toast.success("Image uploaded successfully");
                fetchLocations();
            } else {
                toast.error(response.data.message || "Failed to upload image");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        }
    };

    const filteredLocations = locations.filter(
        (location) =>
            location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.province
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            location.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <CardTitle>Location Management</CardTitle>
                            <CardDescription>
                                Manage hotel locations and properties
                            </CardDescription>
                        </div>
                        {/* Create Location Dialog */}
                        <Dialog
                            open={isCreateDialogOpen}
                            onOpenChange={setIsCreateDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Location
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Create New Location
                                    </DialogTitle>
                                    <DialogDescription>
                                        Add a new location to your hotel
                                        portfolio
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">
                                            Location Name
                                        </Label>
                                        <Input
                                            id="name"
                                            value={createForm.name}
                                            onChange={(e) =>
                                                setCreateForm({
                                                    ...createForm,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Grand Hotel Downtown"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={createForm.province}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        province:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="country">
                                                Country
                                            </Label>
                                            <Input
                                                id="country"
                                                value={createForm.country}
                                                onChange={(e) =>
                                                    setCreateForm({
                                                        ...createForm,
                                                        country: e.target.value,
                                                    })
                                                }
                                                placeholder="United States"
                                            />
                                        </div>
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
                                            placeholder="Luxurious hotel in the heart of the city..."
                                        />
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
                                    <Button onClick={handleCreateLocation}>
                                        Create Location
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
                                        location? This action cannot be undone
                                        and will affect all rooms associated
                                        with this location.
                                    </DialogDescription>
                                </DialogHeader>
                                {deletingLocation && (
                                    <div className="py-4">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                                    {deletingLocation.image ? (
                                                        <Image
                                                            src={
                                                                process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                    /\/api$/,
                                                                    ""
                                                                ) +
                                                                deletingLocation.image
                                                            }
                                                            alt={
                                                                deletingLocation.name
                                                            }
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <Building className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-lg">
                                                        {deletingLocation.name}
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>
                                                            {
                                                                deletingLocation.province
                                                            }
                                                            ,{" "}
                                                            {
                                                                deletingLocation.country
                                                            }
                                                        </span>
                                                    </div>
                                                    {deletingLocation.description && (
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                            {
                                                                deletingLocation.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm">
                                                    <p className="font-medium text-amber-800 dark:text-amber-200">
                                                        Warning
                                                    </p>
                                                    <p className="text-amber-700 dark:text-amber-300">
                                                        Deleting this location
                                                        will also remove all
                                                        associated rooms and
                                                        bookings. This action is
                                                        irreversible.
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
                                            setDeletingLocation(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            deletingLocation &&
                                            handleDeleteLocation(
                                                deletingLocation.id
                                            )
                                        }
                                        className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Location
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        {/* Edit Location Dialog */}
                        <Dialog
                            open={isEditDialogOpen}
                            onOpenChange={setIsEditDialogOpen}
                        >
                            <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Location</DialogTitle>
                                    <DialogDescription>
                                        Update location information and details
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="edit-name">
                                            Location Name
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
                                            placeholder="Grand Hotel Downtown"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-city">
                                                City/Province
                                            </Label>
                                            <Input
                                                id="edit-city"
                                                value={editForm.province}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        province:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="New York"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="edit-country">
                                                Country
                                            </Label>
                                            <Input
                                                id="edit-country"
                                                value={editForm.country}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        country: e.target.value,
                                                    })
                                                }
                                                placeholder="United States"
                                            />
                                        </div>
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
                                            placeholder="Luxurious hotel in the heart of the city..."
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditDialogOpen(false);
                                            setSelectedLocation(null);
                                            resetEditForm();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleEditLocation}>
                                        Update Location
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
                                placeholder="Search locations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Location Name</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Country</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLocations.map((location) => (
                                    <TableRow key={location.id}>
                                        <TableCell>
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                                                {location.image ? (
                                                    <Image
                                                        src={
                                                            process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                /\/api$/,
                                                                ""
                                                            ) + location.image
                                                        }
                                                        alt={location.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <Building className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">
                                                {location.name}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3 text-gray-400" />
                                                <span>{location.province}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {location.country}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm text-gray-500 truncate max-w-[200px]">
                                                {location.description ||
                                                    "No description"}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="text-green-600 border-green-600"
                                            >
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
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
                                                                    location.id,
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
                                                        openEditDialog(location)
                                                    }
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        openDeleteDialog(
                                                            location
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

                    {filteredLocations.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No locations found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
