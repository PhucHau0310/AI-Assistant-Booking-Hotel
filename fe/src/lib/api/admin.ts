import api from "./client";
import { ApiResponse, Room, Booking, Location, User, Comment } from "@/types";

// Room DTOs
interface CreateRoomRequest {
    name: string;
    description: string;
    price: number;
    maxGuests?: number;
    locationId: string;
    picture?: string;
    //
    bedRoom: number;
    bed: number;
    bathRoom: number;
    washingMachine: boolean;
    balcony: boolean;
    tv: boolean;
    airConditioner: boolean;
    wifi: boolean;
    kitchen: boolean;
    parking: boolean;
    swimmingPool: boolean;
}

interface UpdateRoomRequest {
    name?: string;
    description?: string;
    pricePerNight?: number;
    maxGuests?: number;
    locationId?: string;
    imageUrl?: string;
}

interface PaginatedRoomsRequest {
    page?: number;
    size?: number;
}

// Booking DTOs
interface CreateBookingRequest {
    userId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    guestCount: number;
}

interface UpdateBookingRequest {
    checkInDate?: string;
    checkOutDate?: string;
    totalPrice?: number;
    guestCount?: number;
}

// Location DTOs
interface CreateLocationRequest {
    name: string;
    province: string;
    country: string;
    description?: string;
    image?: string;
}

interface UpdateLocationRequest {
    name?: string;
    city?: string;
    country?: string;
    description?: string;
    image?: string;
}

// User DTOs
interface UpdateUserRequest {
    email?: string;
    name?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: number;
}

// Comment DTOs
interface CreateCommentRequest {
    content: string;
    rating: number;
    roomId: string;
    userId: string;
}

interface UpdateCommentRequest {
    content?: string;
    rating?: number;
}

// Admin API Service
export const adminApi = {
    // Room Management
    rooms: {
        getAll: () => api.get<ApiResponse<Room[]>>("/rooms"),

        getPaginated: (params: PaginatedRoomsRequest) =>
            api.get<ApiResponse<Room[]>>("/rooms/paginated", { params }),

        getById: (id: string) => api.get<ApiResponse<Room>>(`/rooms/${id}`),

        getByLocation: (locationId: string) =>
            api.get<ApiResponse<Room[]>>(`/rooms/location/${locationId}`),

        search: (params: {
            keyword?: string;
            locationId?: string;
            minPrice?: number;
            maxPrice?: number;
        }) => api.get<ApiResponse<Room[]>>("/rooms/search", { params }),

        create: (data: CreateRoomRequest) =>
            api.post<ApiResponse<Room>>("/rooms", data),

        update: (id: string, data: UpdateRoomRequest) =>
            api.put<ApiResponse<Room>>(`/rooms/${id}`, data),

        delete: (id: string) =>
            api.delete<ApiResponse<boolean>>(`/rooms/${id}`),

        uploadImage: (id: string, file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            return api.post<ApiResponse<string>>(
                `/rooms/${id}/image`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
        },
    },

    // Booking Management
    bookings: {
        getAll: () => api.get<ApiResponse<Booking[]>>("/bookings"),

        getById: (id: string) =>
            api.get<ApiResponse<Booking>>(`/bookings/${id}`),

        getByUserId: (userId: string) =>
            api.get<ApiResponse<Booking[]>>(`/bookings/user/${userId}`),

        getByRoomId: (roomId: string) =>
            api.get<ApiResponse<Booking[]>>(`/bookings/room/${roomId}`),

        create: (data: CreateBookingRequest) =>
            api.post<ApiResponse<Booking>>("/bookings", data),

        update: (id: string, data: UpdateBookingRequest) =>
            api.put<ApiResponse<Booking>>(`/bookings/${id}`, data),

        delete: (id: string) =>
            api.delete<ApiResponse<boolean>>(`/bookings/${id}`),

        checkAvailability: (params: {
            roomId: string;
            checkIn: string;
            checkOut: string;
            excludeBookingId?: string;
        }) =>
            api.get<ApiResponse<boolean>>("/bookings/availability", { params }),
    },

    // Location Management
    locations: {
        getAll: () => api.get<ApiResponse<Location[]>>("/locations"),

        getById: (id: string) =>
            api.get<ApiResponse<Location>>(`/locations/${id}`),

        search: (keyword?: string) =>
            api.get<ApiResponse<Location[]>>("/locations/search", {
                params: { keyword },
            }),

        create: (data: CreateLocationRequest) =>
            api.post<ApiResponse<Location>>("/locations", data),

        update: (id: string, data: UpdateLocationRequest) =>
            api.put<ApiResponse<Location>>(`/locations/${id}`, data),

        delete: (id: string) =>
            api.delete<ApiResponse<boolean>>(`/locations/${id}`),

        uploadImage: (id: string, file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            return api.post<ApiResponse<string>>(
                `/locations/${id}/image`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
        },
    },

    // User Management
    users: {
        getAll: () => api.get<ApiResponse<User[]>>("/users"),

        getById: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),

        search: (keyword?: string) =>
            api.get<ApiResponse<User[]>>("/users/search", {
                params: { keyword },
            }),

        update: (id: string, data: UpdateUserRequest) =>
            api.put<ApiResponse<User>>(`/users/${id}`, data),

        delete: (id: string) =>
            api.delete<ApiResponse<boolean>>(`/users/${id}`),

        uploadAvatar: (id: string, file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            return api.post<ApiResponse<string>>(
                `/users/${id}/avatar`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
        },
    },

    // Comment Management
    comments: {
        getAll: () => api.get<ApiResponse<Comment[]>>("/comments"),

        getById: (id: string) =>
            api.get<ApiResponse<Comment>>(`/comments/${id}`),

        getByRoom: (roomId: string) =>
            api.get<ApiResponse<Comment[]>>(`/comments/room/${roomId}`),

        getByUser: (userId: string) =>
            api.get<ApiResponse<Comment[]>>(`/comments/user/${userId}`),

        create: (data: CreateCommentRequest) =>
            api.post<ApiResponse<Comment>>("/comments", data),

        update: (id: string, data: UpdateCommentRequest) =>
            api.put<ApiResponse<Comment>>(`/comments/${id}`, data),

        delete: (id: string) =>
            api.delete<ApiResponse<boolean>>(`/comments/${id}`),
    },
};

export default adminApi;
