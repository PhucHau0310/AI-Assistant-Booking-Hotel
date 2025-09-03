import { Card, CardContent } from "@/components/ui/card";

export const RoomCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-video bg-gray-200 animate-pulse"></div>
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-4"></div>
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-28"></div>
                </div>
            </CardContent>
        </Card>
    );
};

export const DestinationCardSkeleton = () => {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse relative">
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <div className="text-white p-6 w-full">
                        <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded animate-pulse w-full mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
