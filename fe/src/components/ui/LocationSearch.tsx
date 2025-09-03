import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import type { Location } from "@/types";

interface LocationSearchProps {
    value: string;
    onLocationSelect: (location: Location) => void;
    onInputChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
    value,
    onLocationSelect,
    onInputChange,
    placeholder = "Search destinations",
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { locations, searchLocations, isLoading } = useLocationSearch();

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue.trim().length > 2) {
                searchLocations(inputValue);
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue, searchLocations]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onInputChange(newValue);
    };

    const handleLocationClick = (location: Location) => {
        setInputValue(`${location.name}, ${location.province}`);
        onLocationSelect(location);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Input
                    ref={inputRef}
                    placeholder={placeholder}
                    className={`pl-10 ${className}`}
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => inputValue.length > 2 && setIsOpen(true)}
                />
            </div>

            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1"
                >
                    {isLoading && (
                        <div className="p-3 text-sm text-gray-500">
                            Searching...
                        </div>
                    )}

                    {!isLoading && locations.length > 0 && (
                        <>
                            {locations.map((location) => (
                                <button
                                    key={location.id}
                                    className="w-full p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-left"
                                    onClick={() =>
                                        handleLocationClick(location)
                                    }
                                    type="button"
                                >
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                                        <div>
                                            <div className="font-medium text-sm">
                                                {location.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {location.province},{" "}
                                                {location.country}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </>
                    )}

                    {!isLoading &&
                        locations.length === 0 &&
                        inputValue.length > 2 && (
                            <div className="p-3 text-sm text-gray-500">
                                No locations found
                            </div>
                        )}
                </div>
            )}
        </div>
    );
};
