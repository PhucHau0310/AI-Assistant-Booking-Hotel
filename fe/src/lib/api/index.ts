import { apiClient } from "./client";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    User,
    Room,
    Location,
    Booking,
    Comment,
    CreateBookingRequest,
    CreateCommentRequest,
    ApiResponse,
} from "@/types";

export const authApi = {
    login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
        const response = await apiClient.post("/auth/login", data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
        const response = await apiClient.post("/auth/register", data);
        return response.data;
    },
};

export const roomApi = {
    getAllRooms: async (): Promise<ApiResponse<Room[]>> => {
        const response = await apiClient.get("/rooms");
        return response.data;
    },

    getRoomById: async (id: string): Promise<ApiResponse<Room>> => {
        const response = await apiClient.get(`/rooms/${id}`);
        return response.data;
    },

    searchRooms: async (params: {
        locationId?: string;
        minPrice?: number;
        maxPrice?: number;
        bedRoom?: number;
        bathRoom?: number;
    }): Promise<ApiResponse<Room[]>> => {
        const response = await apiClient.get("/rooms/search", { params });
        return response.data;
    },
};

export const locationApi = {
    getAllLocations: async (): Promise<ApiResponse<Location[]>> => {
        const response = await apiClient.get("/locations");
        return response.data;
    },

    getLocationById: async (id: string): Promise<ApiResponse<Location>> => {
        const response = await apiClient.get(`/locations/${id}`);
        return response.data;
    },

    searchLocations: async (
        query: string
    ): Promise<ApiResponse<Location[]>> => {
        const response = await apiClient.get("/locations/search", {
            params: { query },
        });
        return response.data;
    },
};

export const bookingApi = {
    getAllBookings: async (): Promise<ApiResponse<Booking[]>> => {
        const response = await apiClient.get("/bookings");
        return response.data;
    },

    getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
        const response = await apiClient.get("/bookings/my-bookings");
        return response.data;
    },

    createBooking: async (
        data: CreateBookingRequest
    ): Promise<ApiResponse<Booking>> => {
        const response = await apiClient.post("/bookings", data);
        return response.data;
    },

    updateBooking: async (
        id: string,
        data: Partial<CreateBookingRequest>
    ): Promise<ApiResponse<Booking>> => {
        const response = await apiClient.put(`/bookings/${id}`, data);
        return response.data;
    },

    deleteBooking: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete(`/bookings/${id}`);
        return response.data;
    },
};

export const commentApi = {
    getAllComments: async (): Promise<ApiResponse<Comment[]>> => {
        const response = await apiClient.get("/comments");
        return response.data;
    },

    getCommentsByRoom: async (
        roomId: string
    ): Promise<ApiResponse<Comment[]>> => {
        const response = await apiClient.get(`/comments/room/${roomId}`);
        return response.data;
    },

    createComment: async (
        data: CreateCommentRequest
    ): Promise<ApiResponse<Comment>> => {
        const response = await apiClient.post("/comments", data);
        return response.data;
    },

    updateComment: async (
        id: string,
        data: Partial<CreateCommentRequest>
    ): Promise<ApiResponse<Comment>> => {
        const response = await apiClient.put(`/comments/${id}`, data);
        return response.data;
    },

    deleteComment: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete(`/comments/${id}`);
        return response.data;
    },
};

export const userApi = {
    // getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    //     const response = await apiClient.get("/users");
    //     return response.data;
    // },

    // getUserById: async (id: string): Promise<ApiResponse<User>> => {
    //     const response = await apiClient.get(`/users/${id}`);
    //     return response.data;
    // },

    updateUser: async (
        id: string,
        data: Partial<User>
    ): Promise<ApiResponse<User>> => {
        const response = await apiClient.put(`/users/${id}`, data);
        return response.data;
    },

    // deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    //     const response = await apiClient.delete(`/users/${id}`);
    //     return response.data;
    // },

    uploadAvatar: (id: string, file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.post<ApiResponse<string>>(
            `/users/${id}/avatar`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
    },
};
