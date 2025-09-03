"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, X, Minimize2, Maximize2 } from "lucide-react";
import type { ChatMessage } from "@/types";
import LottieAnimation from "./LottieAnimation";
import chatBotIcon from "../../../public/animations/chatBot.json";

export function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: "1",
            message:
                "Xin chào👋 Chào mừng bạn đến với dịch vụ đặt phòng khách sạn của chúng tôi. Tôi có thể giúp bạn có sẵn phòng, giá cả, tiện nghi và hỗ trợ đặt phòng. Làm thế nào tôi có thể giúp bạn hôm nay?",
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            message: inputValue,
            isUser: true,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Simulate AI response (replace with actual AI API call)
        setTimeout(() => {
            const aiResponse: ChatMessage = {
                id: (Date.now() + 1).toString(),
                message: getAIResponse(inputValue),
                isUser: false,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsLoading(false);
        }, 1000);
    };

    const getAIResponse = (userInput: string): string => {
        return "Hiện tại chatbot ở trang web đang bảo trì 😎. Bạn hãy thử chat với chúng tôi qua chatbot telegram nhé 🤖. Link đây nè: https://t.me/hauga204_bot";
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
                size="icon"
            >
                {/* <MessageCircle className="h-6 w-6" /> */}
                <LottieAnimation
                    animationData={chatBotIcon}
                    loop={true}
                    className="w-full h-full"
                />
            </Button>
        );
    }

    return (
        <Card
            className={`fixed bottom-6 right-6 z-50 shadow-xl transition-all duration-300 ${
                isMinimized ? "w-80 h-16" : "w-80 h-[450px]"
            }`}
        >
            <CardHeader
                className={`flex flex-row items-center justify-between p-3 border-b ${
                    isMinimized ? "pb-3" : "pb-2"
                }`}
            >
                <CardTitle className="flex items-center space-x-2 text-sm">
                    <Bot className="h-4 w-4 text-primary" />
                    <span>Hotel Assistant</span>
                </CardTitle>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                    >
                        {isMinimized ? (
                            <Maximize2 className="h-4 w-4" />
                        ) : (
                            <Minimize2 className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="h-7 w-7 p-0 hover:bg-gray-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            {!isMinimized && (
                <div className="flex flex-col h-[calc(450px-120px)] relative">
                    {/* Messages Container */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex items-start space-x-2 ${
                                    message.isUser
                                        ? "flex-row-reverse space-x-reverse"
                                        : ""
                                }`}
                            >
                                <Avatar className="h-7 w-7 mt-1 flex-shrink-0">
                                    <AvatarFallback className="text-xs">
                                        {message.isUser ? (
                                            <User className="h-4 w-4" />
                                        ) : (
                                            <Bot className="h-4 w-4" />
                                        )}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`rounded-lg px-3 py-2 max-w-[220px] text-sm break-words ${
                                        message.isUser
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    }`}
                                >
                                    {message.message}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start space-x-2">
                                <Avatar className="h-7 w-7 mt-1 flex-shrink-0">
                                    <AvatarFallback className="text-xs">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg px-3 py-2">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                                        <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Container - Fixed at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 border-t p-3 bg-background">
                        <div className="flex space-x-2">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type your message..."
                                onKeyDown={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1 text-sm h-9"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                size="sm"
                                className="px-3 h-9"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isMinimized && <div className="pb-2" />}
        </Card>
    );
}
