"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    User,
    Mail,
    Phone,
    Camera,
    Save,
    ArrowLeft,
    Shield,
    Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import Image from "next/image";
import { format } from "date-fns";
import { formatRole } from "@/lib/utils/format";

interface ProfileForm {
    name: string;
    email: string;
    phone: string;
}

export default function ProfilePage() {
    const { user, isAuthenticated, updateUser } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState<ProfileForm>({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }

        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user, isAuthenticated, router]);

    const handleUpdateProfile = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const response = await userApi.updateUser(user.id, form);

            if (response.statusCode === 200 && response.content) {
                updateUser(response.content);
                toast.success("Profile updated successfully");
            } else {
                toast.error(response.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (file: File) => {
        if (!user) return;

        try {
            setUploading(true);
            const response = await userApi.uploadAvatar(user.id, file);

            if (response.data.statusCode === 200) {
                // Update user with new avatar URL
                const updatedUser = {
                    ...user,
                    avatarUrl: response.data.content,
                };
                updateUser(updatedUser);
                toast.success("Avatar updated successfully");
            } else {
                toast.error(response.data.message || "Failed to upload avatar");
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("Failed to upload avatar");
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    // 5MB limit
                    toast.error("File size must be less than 5MB");
                    return;
                }
                handleAvatarUpload(file);
            }
        };
        input.click();
    };

    const getRoleBadge = (role: string) => {
        return role === "Admin" ? (
            <Badge variant="destructive" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Admin
            </Badge>
        ) : (
            <Badge variant="default" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                User
            </Badge>
        );
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please Login
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You need to be logged in to view your profile.
                    </p>
                    <Button onClick={() => router.push("/auth/login")}>
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        My Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account settings and personal information
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Overview Card */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="relative mx-auto mb-4">
                                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border-4 border-white dark:border-gray-700 shadow-lg">
                                        {user.avatarUrl ? (
                                            <Image
                                                src={
                                                    process.env.NEXT_PUBLIC_API_URL?.replace(
                                                        /\/api$/,
                                                        ""
                                                    ) + user.avatarUrl
                                                }
                                                alt={`${user.name}`}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <User className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 shadow-lg bg-white dark:bg-gray-800"
                                        onClick={handleFileSelect}
                                        disabled={uploading}
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                </div>
                                <CardTitle className="text-xl">
                                    {user.name}
                                </CardTitle>
                                <CardDescription className="flex items-center justify-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {user.email}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Role
                                    </span>
                                    {getRoleBadge(formatRole(user.role))}
                                </div>

                                {user.phone && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Phone
                                        </span>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Phone className="h-3 w-3" />
                                            {user.phone}
                                        </div>
                                    </div>
                                )}

                                {user.createdAt && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Member since
                                        </span>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Calendar className="h-3 w-3" />
                                            {format(
                                                new Date(user.createdAt),
                                                "MMM yyyy"
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div className="text-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                        Upload a new avatar
                                    </p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleFileSelect}
                                        disabled={uploading}
                                        className="w-full"
                                    >
                                        {uploading
                                            ? "Uploading..."
                                            : "Change Photo"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Settings Card */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Update your personal details and contact
                                    information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                phone: e.target.value,
                                            })
                                        }
                                        placeholder="Enter your phone number"
                                    />
                                </div>

                                <Separator />

                                <div className="flex justify-end space-x-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setForm({
                                                name: user.name || "",
                                                email: user.email || "",
                                                phone: user.phone || "",
                                            });
                                            toast.info("Changes reset");
                                        }}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Save Changes
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Security Card */}
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Account Security</CardTitle>
                                <CardDescription>
                                    Manage your account security settings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">
                                            Password
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Last updated 30 days ago
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Change Password
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">
                                            Two-Factor Authentication
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Add an extra layer of security to
                                            your account
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Enable 2FA
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between p-4 border rounded-lg">
                                    <div>
                                        <h4 className="font-medium">
                                            Login Sessions
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Manage your active login sessions
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        View Sessions
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
