import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Booking,
  BookingStatus,
  type CarWashStats,
  type Membership,
  type Service,
  ServiceCategory,
  type UserProfile,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export type { Service, Booking, Membership, CarWashStats, UserProfile };
export { BookingStatus, ServiceCategory, UserRole };

export function useAllServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useServicesByCategory(category: ServiceCategory) {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["services", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServicesByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["callerBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery<Booking[]>({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<Membership[]>({
    queryKey: ["allMembers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllMembers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCarWashStats() {
  const { actor, isFetching } = useActor();
  return useQuery<CarWashStats | null>({
    queryKey: ["carWashStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCarWashStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCallerMembership() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery<Membership | null>({
    queryKey: ["callerMembership", identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      try {
        return await actor.getMembership(identity.getPrincipal() as Principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useBookService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      phone: string;
      carModel: string;
      date: bigint;
      serviceId: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.bookService(
        params.name,
        params.phone,
        params.carModel,
        params.date,
        params.serviceId,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerBookings"] });
      qc.invalidateQueries({ queryKey: ["allBookings"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function usePurchaseMembership() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.purchaseMembership();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerMembership"] });
      qc.invalidateQueries({ queryKey: ["allMembers"] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      bookingId: bigint;
      status: BookingStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBookingStatus(params.bookingId, params.status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allBookings"] });
      qc.invalidateQueries({ queryKey: ["callerBookings"] });
    },
  });
}

export function useRedeemCarWash() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.redeemCarWash(bookingId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerMembership"] });
      qc.invalidateQueries({ queryKey: ["callerBookings"] });
    },
  });
}
