"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ChatBot } from "@/components/features/ChatBot";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <QueryClientProvider client={queryClient}>
            <div className="min-h-screen bg-background">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <Sidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <main className="pt-16">{children}</main>

                <ChatBot />
            </div>
        </QueryClientProvider>
    );
}
