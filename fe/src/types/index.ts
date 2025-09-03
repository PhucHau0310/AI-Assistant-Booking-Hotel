export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    content?: T;
    totalRow?: number;
    pageIndex?: number;
    dateTime: string;
}

export type Role = 0 | 1 | 2;
export type Gender = 0 | 1 | 2 | 3;

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: Role;
    gender: Gender;
    avatarUrl?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Location {
    id: string;
    name: string;
    province: string;
    country: string;
    description?: string;
    image?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface Room {
    id: string;
    name: string;
    description: string;
    price: number;
    maxGuests?: number;
    locationId: string;
    picture?: string;
    createdAt: string;
    updatedAt?: string;
    location?: Location;

    // Utility
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

export interface Booking {
    id: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    totalPrice: number;
    userId: string;
    roomId: string;
    createdAt: string;
    updatedAt?: string;
    user?: User;
    room?: Room;
}

export interface Comment {
    id: string;
    content: string;
    rating: number;
    userId: string;
    roomId: string;
    createdAt: string;
    updatedAt?: string;
    user?: User;
    room?: Room;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
}

export interface CreateBookingRequest {
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
    totalPrice: number;
    roomId: string;
    userId: string;
}

export interface CreateCommentRequest {
    content: string;
    rating: number;
    roomId: string;
    userId: string;
}

export interface ChatMessage {
    id: string;
    message: string;
    isUser: boolean;
    timestamp: Date;
}
