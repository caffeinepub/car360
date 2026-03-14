import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Droplets, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  BookingStatus,
  useAllBookings,
  useAllMembers,
  useCarWashStats,
  useUpdateBookingStatus,
} from "../hooks/useQueries";

const STATUS_OPTIONS: BookingStatus[] = [
  BookingStatus.pending,
  BookingStatus.confirmed,
  BookingStatus.completed,
  BookingStatus.cancelled,
];

const STATUS_COLORS: Record<BookingStatus, string> = {
  [BookingStatus.pending]: "bg-yellow-100 text-yellow-700",
  [BookingStatus.confirmed]: "bg-blue-100 text-blue-700",
  [BookingStatus.completed]: "bg-green-100 text-green-700",
  [BookingStatus.cancelled]: "bg-red-100 text-red-600",
};

const STATS_KEYS = [
  "total-bookings",
  "total-members",
  "car-washes-used",
  "active-members",
];

export function AdminPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: allBookings = [], isLoading: bookingsLoading } =
    useAllBookings();
  const { data: members = [], isLoading: membersLoading } = useAllMembers();
  const { data: stats } = useCarWashStats();
  const updateStatus = useUpdateBookingStatus();

  const filteredBookings =
    statusFilter === "all"
      ? allBookings
      : allBookings.filter((b) => b.status === statusFilter);

  const handleStatusChange = async (
    bookingId: bigint,
    status: BookingStatus,
  ) => {
    try {
      await updateStatus.mutateAsync({ bookingId, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const statsCards = [
    {
      icon: CalendarDays,
      label: "Total Bookings",
      value: allBookings.length,
      color: "text-blue-600 bg-blue-50",
    },
    {
      icon: Users,
      label: "Total Members",
      value: String(stats?.totalMembers ?? 0),
      color: "text-crimson-600 bg-crimson-50",
    },
    {
      icon: Droplets,
      label: "Car Washes Used",
      value: String(stats?.totalCarWashesUsed ?? 0),
      color: "text-cyan-600 bg-cyan-50",
    },
    {
      icon: TrendingUp,
      label: "Active Members",
      value: String(stats?.activeMembers ?? 0),
      color: "text-green-600 bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display font-bold text-3xl text-foreground mb-8">
            Admin Panel
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((s, i) => (
              <Card key={STATS_KEYS[i]} data-ocid="admin.stats.card">
                <CardContent className="p-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}
                  >
                    <s.icon className="w-5 h-5" />
                  </div>
                  <div className="font-display font-bold text-2xl text-foreground">
                    {s.value}
                  </div>
                  <div className="text-muted-foreground text-xs mt-0.5">
                    {s.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="bookings" data-ocid="admin.tab">
            <TabsList className="mb-6">
              <TabsTrigger value="bookings" data-ocid="admin.bookings.tab">
                Bookings
              </TabsTrigger>
              <TabsTrigger value="members" data-ocid="admin.members.tab">
                Members
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-display text-xl">
                      All Bookings
                    </CardTitle>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger
                        className="w-40"
                        data-ocid="admin.bookings.select"
                      >
                        <SelectValue placeholder="Filter status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        {STATUS_OPTIONS.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {bookingsLoading ? (
                    <div
                      className="p-4 space-y-3"
                      data-ocid="admin.bookings.loading_state"
                    >
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12" />
                      ))}
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div
                      className="text-center py-12"
                      data-ocid="admin.bookings.empty_state"
                    >
                      <p className="text-muted-foreground">No bookings found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table data-ocid="admin.bookings.table">
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Car</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredBookings.map((b, i) => (
                            <TableRow
                              key={String(b.id)}
                              data-ocid={`admin.bookings.row.${i + 1}`}
                            >
                              <TableCell className="font-mono text-xs">
                                #{String(b.id)}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-sm">
                                  {b.name}
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {b.phone}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {b.carModel}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(
                                  Number(b.date) / 1_000_000,
                                ).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                })}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`text-xs ${STATUS_COLORS[b.status]}`}
                                >
                                  {b.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={b.status}
                                  onValueChange={(v) =>
                                    handleStatusChange(b.id, v as BookingStatus)
                                  }
                                >
                                  <SelectTrigger
                                    className="w-32 h-7 text-xs"
                                    data-ocid={`admin.booking.status.select.${i + 1}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {STATUS_OPTIONS.map((s) => (
                                      <SelectItem
                                        key={s}
                                        value={s}
                                        className="capitalize text-xs"
                                      >
                                        {s}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    All Members
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {membersLoading ? (
                    <div
                      className="p-4 space-y-3"
                      data-ocid="admin.members.loading_state"
                    >
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12" />
                      ))}
                    </div>
                  ) : members.length === 0 ? (
                    <div
                      className="text-center py-12"
                      data-ocid="admin.members.empty_state"
                    >
                      <p className="text-muted-foreground">No members yet</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table data-ocid="admin.members.table">
                        <TableHeader>
                          <TableRow>
                            <TableHead>Member</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Washes Left</TableHead>
                            <TableHead>Valid Till</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.map((m, i) => (
                            <TableRow
                              key={m.user.toString()}
                              data-ocid={`admin.members.row.${i + 1}`}
                            >
                              <TableCell className="font-mono text-xs">
                                {m.user.toString().slice(0, 16)}...
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    m.activated
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-600"
                                  }
                                >
                                  {m.activated ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Droplets className="w-3 h-3 text-cyan-500" />
                                  <span className="font-semibold">
                                    {String(m.remainingCarWashes)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(
                                  Number(m.endDate) / 1_000_000,
                                ).toLocaleDateString("en-IN", {
                                  month: "short",
                                  year: "numeric",
                                })}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
