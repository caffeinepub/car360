import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Custom Types
  type Membership = {
    user : Principal;
    activated : Bool;
    remainingCarWashes : Nat;
    activationDate : Time.Time;
    endDate : Time.Time;
  };

  type ServiceCategory = {
    #wash;
    #tires;
    #oil;
    #engine;
    #brakes;
    #ac;
    #body;
    #accessories;
    #insurance;
    #suspension;
  };

  module ServiceCategory {
    public func compare(cat1 : ServiceCategory, cat2 : ServiceCategory) : Order.Order {
      switch (cat1, cat2) {
        case (#wash, #wash) { #equal };
        case (#wash, _) { #less };
        case (_, #wash) { #greater };
        case (#tires, #tires) { #equal };
        case (#tires, _) { #less };
        case (_, #tires) { #greater };
        case (#oil, #oil) { #equal };
        case (#oil, _) { #less };
        case (_, #oil) { #greater };
        case (#engine, #engine) { #equal };
        case (#engine, _) { #less };
        case (_, #engine) { #greater };
        case (#brakes, #brakes) { #equal };
        case (#brakes, _) { #less };
        case (_, #brakes) { #greater };
        case (#ac, #ac) { #equal };
        case (#ac, _) { #less };
        case (_, #ac) { #greater };
        case (#body, #body) { #equal };
        case (#body, _) { #less };
        case (_, #body) { #greater };
        case (#accessories, #accessories) { #equal };
        case (#accessories, _) { #less };
        case (_, #accessories) { #greater };
        case (#insurance, #insurance) { #equal };
        case (#insurance, _) { #less };
        case (_, #insurance) { #greater };
        case (#suspension, #suspension) { #equal };
      };
    };
  };

  type Service = {
    id : Nat;
    name : Text;
    category : ServiceCategory;
    description : Text;
    price : Nat;
  };

  module Service {
    public func compareByCategory(service1 : Service, service2 : Service) : Order.Order {
      switch (ServiceCategory.compare(service1.category, service2.category)) {
        case (#equal) { compareByName(service1, service2) };
        case (order) { order };
      };
    };

    public func compareByName(service1 : Service, service2 : Service) : Order.Order {
      Text.compare(service1.name, service2.name);
    };
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #completed;
    #cancelled;
  };

  module BookingStatus {
    public func compare(status1 : BookingStatus, status2 : BookingStatus) : Order.Order {
      switch (status1, status2) {
        case (#pending, #pending) { #equal };
        case (#pending, _) { #less };
        case (_, #pending) { #greater };
        case (#confirmed, #confirmed) { #equal };
        case (#confirmed, _) { #less };
        case (_, #confirmed) { #greater };
        case (#completed, #completed) { #equal };
        case (#completed, _) { #less };
        case (_, #completed) { #greater };
        case (#cancelled, #cancelled) { #equal };
      };
    };
  };

  type Booking = {
    id : Nat;
    user : Principal;
    name : Text;
    phone : Text;
    carModel : Text;
    date : Time.Time;
    serviceId : Nat;
    status : BookingStatus;
  };

  module Booking {
    public func compareByDate(booking1 : Booking, booking2 : Booking) : Order.Order {
      Int.compare(booking1.date, booking2.date);
    };

    public func compareByStatus(booking1 : Booking, booking2 : Booking) : Order.Order {
      BookingStatus.compare(booking1.status, booking2.status);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  module BookingStatusCount {
    public type T = {
      pending : Nat;
      confirmed : Nat;
      completed : Nat;
      cancelled : Nat;
    };
  };

  public type CarWashStats = {
    totalMembers : Nat;
    activeMembers : Nat;
    totalCarWashesUsed : Nat;
    avgCarWashesPerMember : Float;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let memberships = Map.empty<Principal, Membership>();
  let services = Map.empty<Nat, Service>();
  let bookings = Map.empty<Nat, Booking>();
  var nextServiceId = 1;
  var nextBookingId = 1;

  // User Profile
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not isOwnerOrAdmin(caller, user)) {
      Runtime.trap("Unauthorized: Can only get your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Membership
  public shared ({ caller }) func purchaseMembership() : async Membership {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can purchase membership");
    };

    switch (memberships.get(caller)) {
      case (?membership) {
        if (membership.activated and membership.endDate > Time.now()) {
          Runtime.trap("Membership already active");
        };
        let newMembership : Membership = {
          user = caller;
          activated = true;
          remainingCarWashes = 10;
          activationDate = Time.now();
          endDate = Time.now() + (365 * 24 * 60 * 60 * 1_000_000_000);
        };
        memberships.add(caller, newMembership);
        newMembership;
      };
      case (null) {
        let newMembership : Membership = {
          user = caller;
          activated = true;
          remainingCarWashes = 10;
          activationDate = Time.now();
          endDate = Time.now() + (365 * 24 * 60 * 60 * 1_000_000_000);
        };
        memberships.add(caller, newMembership);
        newMembership;
      };
    };
  };

  public query ({ caller }) func getMembership(user : Principal) : async Membership {
    if (not isOwnerOrAdmin(caller, user)) {
      Runtime.trap("Unauthorized: Can only view your own membership");
    };
    switch (memberships.get(user)) {
      case (null) { Runtime.trap("Membership not found") };
      case (?membership) { membership };
    };
  };

  // Services
  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray().sort(Service.compareByCategory);
  };

  public shared ({ caller }) func addService(name : Text, category : ServiceCategory, description : Text, price : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };

    let service : Service = {
      id = nextServiceId;
      name;
      category;
      description;
      price;
    };
    services.add(nextServiceId, service);
    nextServiceId += 1;
  };

  // Bookings
  public shared ({ caller }) func bookService(name : Text, phone : Text, carModel : Text, date : Time.Time, serviceId : Nat) : async Booking {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book services");
    };

    let booking : Booking = {
      id = nextBookingId;
      user = caller;
      name;
      phone;
      carModel;
      date;
      serviceId;
      status = #pending;
    };
    bookings.add(nextBookingId, booking);
    nextBookingId += 1;
    booking;
  };

  public query ({ caller }) func getCallerBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookings");
    };

    bookings.values().toArray().filter(
      func(b) {
        b.user == caller;
      }
    );
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, status : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update booking status");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let updatedBooking : Booking = {
          id = booking.id;
          user = booking.user;
          name = booking.name;
          phone = booking.phone;
          carModel = booking.carModel;
          date = booking.date;
          serviceId = booking.serviceId;
          status;
        };
        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  // Car Wash Redemption
  public shared ({ caller }) func redeemCarWash(bookingId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can redeem car washes");
    };

    switch (memberships.get(caller)) {
      case (null) { Runtime.trap("Membership not found") };
      case (?membership) {
        if (not membership.activated or membership.endDate < Time.now()) {
          Runtime.trap("Membership expired");
        };
        if (membership.remainingCarWashes == 0) {
          Runtime.trap("No remaining car washes");
        };

        switch (bookings.get(bookingId)) {
          case (null) { Runtime.trap("Booking not found") };
          case (?booking) {
            if (booking.user != caller) {
              Runtime.trap("Unauthorized: Can only redeem car wash for your own booking");
            };
            let updatedMembership : Membership = {
              user = membership.user;
              activated = membership.activated;
              remainingCarWashes = membership.remainingCarWashes - 1;
              activationDate = membership.activationDate;
              endDate = membership.endDate;
            };
            memberships.add(caller, updatedMembership);
          };
        };
      };
    };
  };

  // Admin Functions
  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };

    bookings.values().toArray().sort(Booking.compareByDate);
  };

  public query ({ caller }) func getAllMembers() : async [Membership] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view members");
    };

    memberships.values().toArray().filter(
      func(m) {
        m.activated and m.endDate > Time.now();
      }
    );
  };

  // Helper function to check if caller is owner or admin
  func isOwnerOrAdmin(caller : Principal, owner : Principal) : Bool {
    caller == owner or AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getServicesByCategory(category : ServiceCategory) : async [Service] {
    services.values().toArray().filter(
      func(service) {
        service.category == category;
      }
    ).sort(Service.compareByName);
  };

  public query ({ caller }) func getBookingsByStatus(status : BookingStatus) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view bookings by status");
    };

    bookings.values().toArray().filter(
      func(booking) {
        booking.status == status;
      }
    ).sort(Booking.compareByDate);
  };

  public query ({ caller }) func countBookingsByStatus() : async BookingStatusCount.T {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view booking statistics");
    };

    let count = {
      var pending = 0;
      var confirmed = 0;
      var completed = 0;
      var cancelled = 0;
    };

    bookings.values().forEach(
      func(booking) {
        switch (booking.status) {
          case (#pending) { count.pending += 1 };
          case (#confirmed) { count.confirmed += 1 };
          case (#completed) { count.completed += 1 };
          case (#cancelled) { count.cancelled += 1 };
        };
      }
    );

    {
      pending = count.pending;
      confirmed = count.confirmed;
      completed = count.completed;
      cancelled = count.cancelled;
    };
  };

  public query ({ caller }) func getCarWashStats() : async CarWashStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view car wash statistics");
    };

    var totalMembers = 0;
    var activeMembers = 0;
    var totalCarWashesUsed = 0;

    memberships.values().forEach(
      func(membership) {
        totalMembers += 1;
        if (membership.activated and membership.endDate > Time.now()) {
          activeMembers += 1;
        };
        totalCarWashesUsed += (10 - membership.remainingCarWashes);
      }
    );

    let avgCarWashesPerMember = if (totalMembers > 0) {
      totalCarWashesUsed.toFloat() / totalMembers.toFloat();
    } else {
      0.0;
    };

    {
      totalMembers;
      activeMembers;
      totalCarWashesUsed;
      avgCarWashesPerMember;
    };
  };
};
