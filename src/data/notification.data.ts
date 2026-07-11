export interface NotificationItem {
  id: string;
  isUnread: boolean;
  message: string;
  time: string;
  title: string;
  type: "confirmed" | "reminder" | "cancelled" | "updated" | "feedback";
}

export const notificationData: NotificationItem[] = [
  {
    id: "1",
    type: "confirmed",
    title: "Booking Confirmed!",
    message: "Your salon appointment has been successfully booked.",
    time: "2 hr ago",
    isUnread: true,
  },
  {
    id: "2",
    type: "reminder",
    title: "Your Appointment is Today",
    message: "See you soon! Don't forget your scheduled appointment.",
    time: "Today",
    isUnread: true,
  },
  {
    id: "3",
    type: "cancelled",
    title: "Booking Cancelled",
    message: "Your appointment has been cancelled. Book again anytime.",
    time: "2 day ago",
    isUnread: false,
  },
  {
    id: "4",
    type: "updated",
    title: "Appointment Updated",
    message: "Your booking has been successfully rescheduled.",
    time: "2 day ago",
    isUnread: false,
  },
  {
    id: "5",
    type: "feedback",
    title: "How Was Your Visit?",
    message: "We'd love your feedback. Leave a quick review.",
    time: "2 day ago",
    isUnread: false,
  },
];
