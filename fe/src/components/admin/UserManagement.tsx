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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, Edit, Trash2, Upload, Mail, Phone, User } from "lucide-react";
import { adminApi } from "@/lib/api/admin";
import { Gender, User as UserType } from "@/types";
import { toast } from "sonner";
import Image from "next/image";
import { format } from "date-fns";
import { formatRole } from "@/lib/utils/format";

interface EditUserForm {
    email: string;
    name: string;
    phone: string;
    gender: Gender;
}

export default function UserManagement() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [editForm, setEditForm] = useState<EditUserForm>({
        email: "",
        name: "",
        phone: "",
        gender: 3,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminApi.users.getAll();

            if (response.data.statusCode === 200 && response.data.content) {
                setUsers(response.data.content);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = async () => {
        if (!selectedUser) return;

        try {
            const response = await adminApi.users.update(
                selectedUser.id,
                editForm
            );

            if (response.data.statusCode === 200) {
                toast.success("User updated successfully");
                setIsEditDialogOpen(false);
                setSelectedUser(null);
                fetchUsers();
            } else {
                toast.error(response.data.message || "Failed to update user");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user");
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to delete this user?")) return;

        try {
            const response = await adminApi.users.delete(userId);

            if (response.data.statusCode === 200) {
                toast.success("User deleted successfully");
                fetchUsers();
            } else {
                toast.error(response.data.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user");
        }
    };

    const handleAvatarUpload = async (userId: string, file: File) => {
        try {
            const response = await adminApi.users.uploadAvatar(userId, file);

            if (response.data.statusCode === 200) {
                toast.success("Avatar uploaded successfully");
                fetchUsers();
            } else {
                toast.error(response.data.message || "Failed to upload avatar");
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("Failed to upload avatar");
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case "Admin":
                return <Badge variant="destructive">Admin</Badge>;
            case "User":
                return <Badge variant="default">User</Badge>;
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const openEditDialog = (user: UserType) => {
        setSelectedUser(user);
        setEditForm({
            email: user.email,
            name: user.name,
            phone: user.phone || "",
            gender: user.gender,
        });
        setIsEditDialogOpen(true);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === "all" || formatRole(user.role) === roleFilter;

        return matchesSearch && matchesRole;
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
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>
                                Manage customer accounts and permissions
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select
                            value={roleFilter}
                            onValueChange={setRoleFilter}
                        >
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                                <SelectItem value="User">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Avatar</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                                                {user.avatarUrl ? (
                                                    <>
                                                        <Image
                                                            src={
                                                                process.env.NEXT_PUBLIC_API_URL?.replace(
                                                                    /\/api$/,
                                                                    ""
                                                                ) +
                                                                user.avatarUrl
                                                            }
                                                            alt={`${user.name}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <p>
                                                            {`https://booking-api.hau.io.vn/api` +
                                                                user.avatarUrl}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <User className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    ID: {user.id.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3 text-gray-400" />
                                                <span className="text-sm">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3 text-gray-400" />
                                                <span className="text-sm">
                                                    {user.phone || "N/A"}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {getRoleBadge(
                                                formatRole(user.role)
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm">
                                                {user.createdAt
                                                    ? format(
                                                          new Date(
                                                              user.createdAt
                                                          ),
                                                          "MMM dd, yyyy"
                                                      )
                                                    : "N/A"}
                                            </span>
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
                                                                handleAvatarUpload(
                                                                    user.id,
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
                                                        openEditDialog(user)
                                                    }
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id
                                                        )
                                                    }
                                                    disabled={
                                                        formatRole(
                                                            user.role
                                                        ) === "Admin"
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

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No users found</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information and permissions
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Last Name</Label>
                                <Input
                                    id="name"
                                    value={editForm.name}
                                    onChange={(e) =>
                                        setEditForm({
                                            ...editForm,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        email: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={editForm.phone}
                                onChange={(e) =>
                                    setEditForm({
                                        ...editForm,
                                        phone: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select
                                value={editForm.gender.toString()}
                                onValueChange={(value) =>
                                    setEditForm({
                                        ...editForm,
                                        gender: Number(value) as Gender,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Male</SelectItem>
                                    <SelectItem value="1">Female</SelectItem>
                                    <SelectItem value="2">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleEditUser}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
