import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface CarWashStats {
    avgCarWashesPerMember: number;
    totalCarWashesUsed: bigint;
    totalMembers: bigint;
    activeMembers: bigint;
}
export interface T {
    cancelled: bigint;
    pending: bigint;
    completed: bigint;
    confirmed: bigint;
}
export interface Service {
    id: bigint;
    name: string;
    description: string;
    category: ServiceCategory;
    price: bigint;
}
export interface Membership {
    activated: boolean;
    endDate: Time;
    user: Principal;
    activationDate: Time;
    remainingCarWashes: bigint;
}
export interface Booking {
    id: bigint;
    status: BookingStatus;
    carModel: string;
    date: Time;
    name: string;
    user: Principal;
    serviceId: bigint;
    phone: string;
}
export interface UserProfile {
    name: string;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum ServiceCategory {
    ac = "ac",
    oil = "oil",
    tires = "tires",
    brakes = "brakes",
    accessories = "accessories",
    body = "body",
    wash = "wash",
    insurance = "insurance",
    suspension = "suspension",
    engine = "engine"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addService(name: string, category: ServiceCategory, description: string, price: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookService(name: string, phone: string, carModel: string, date: Time, serviceId: bigint): Promise<Booking>;
    countBookingsByStatus(): Promise<T>;
    getAllBookings(): Promise<Array<Booking>>;
    getAllMembers(): Promise<Array<Membership>>;
    getAllServices(): Promise<Array<Service>>;
    getBookingsByStatus(status: BookingStatus): Promise<Array<Booking>>;
    getCallerBookings(): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCarWashStats(): Promise<CarWashStats>;
    getMembership(user: Principal): Promise<Membership>;
    getServicesByCategory(category: ServiceCategory): Promise<Array<Service>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    purchaseMembership(): Promise<Membership>;
    redeemCarWash(bookingId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(bookingId: bigint, status: BookingStatus): Promise<void>;
}
