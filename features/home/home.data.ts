export type RecentActivityItem = {
  id: string;
  user: string;
  action: string;
  amount: string;
  type: "receive" | "owe";
  time: string;
  avatar: string;
};

export const recentActivity: RecentActivityItem[] = [
  {
    id: "1",
    user: "Ayush Swami",
    action: "paid for Weekend Brunch",
    amount: "₹1,200",
    type: "receive",
    time: "2H AGO",
    avatar: "https://i.pravatar.cc/160?img=47",
  },
  {
    id: "2",
    user: "Ayush Shukla",
    action: "added Dinner at Olive",
    amount: "₹850",
    type: "owe",
    time: "YESTERDAY",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
  {
    id: "3",
    user: "Aryan Mahendru",
    action: "settled up with you",
    amount: "₹2,400",
    type: "receive",
    time: "OCT 24",
    avatar: "https://i.pravatar.cc/160?img=35",
  },
];
