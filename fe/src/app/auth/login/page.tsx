"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { formatRole } from "@/lib/utils/format";

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await authApi.login(formData);

            console.log({ response });
            if (response.content && response.statusCode === 200) {
                console.log("Login successful");
                setAuth(response.content.user, response.content.token);
                localStorage.setItem("token", response.content.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(response.content.user)
                );

                toast.success("Sign in successful");

                // Redirect based on user role
                if (formatRole(response.content.user.role) === "Admin") {
                    router.push("/admin");
                } else {
                    router.push("/");
                }
            } else {
                toast.error(response.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
                        <LogIn className="h-6 w-6" />
                        <span>Sign In</span>
                    </CardTitle>
                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    disabled={isLoading}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-primary hover:underline"
                        >
                            Forgot Password?
                        </Link>

                        <p className="text-sm text-muted-foreground">
                            Don't have an account?{" "}
                            <Link
                                href="/auth/register"
                                className="text-primary hover:underline font-medium"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
