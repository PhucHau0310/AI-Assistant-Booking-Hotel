import { Map, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapViewProps {
    locationName: string;
    province: string;
    country: string;
    className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
    locationName,
    province,
    country,
    className = "",
}) => {
    const fullLocationName = `${locationName}, ${province}, ${country}`;
    const encodedLocation = encodeURIComponent(fullLocationName);

    // Google Maps URL for external link
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;

    // OpenStreetMap URL for external link
    const openStreetMapUrl = `https://www.openstreetmap.org/search?query=${encodedLocation}`;

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Location Map
                </h3>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(googleMapsUrl, "_blank")}
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Google Maps
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(openStreetMapUrl, "_blank")}
                    >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        OpenStreetMap
                    </Button>
                </div>
            </div>

            <div className="relative aspect-video bg-gray-100 rounded-lg border overflow-hidden">
                {/* Static map representation */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="text-center p-8">
                        <Map className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                            {locationName}
                        </h4>
                        <p className="text-gray-600 mb-4">
                            {province}, {country}
                        </p>
                        <div className="space-y-2">
                            <Button
                                onClick={() =>
                                    window.open(googleMapsUrl, "_blank")
                                }
                                className="w-full"
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on Google Maps
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() =>
                                    window.open(openStreetMapUrl, "_blank")
                                }
                                className="w-full"
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on OpenStreetMap
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-500 text-center">
                Click the buttons above to view the exact location on external
                map services
            </div>
        </div>
    );
};
