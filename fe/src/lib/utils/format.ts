// Utility functions for formatting data
import type { Gender, Role } from "@/types";

export const formatGender = (gender: Gender): string => {
    switch (gender) {
        case 0:
            return "Male";
        case 1:
            return "Female";
        case 2:
            return "Other";
        case 3:
            return "Unknown";
        default:
            return "Unknown";
    }
};

export const formatRole = (role: Role): string => {
    switch (role) {
        case 0:
            return "Admin";
        case 1:
            return "User";
        case 2:
            return "Unknown";
        default:
            return "Unknown";
    }
};
