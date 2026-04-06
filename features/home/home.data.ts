export type RecentActivityItem = {
  id: string;
  user: string;
  action: string;
  amount: string;
  type: "receive" | "owe";
  time: string;
  avatar: string;
};

export type BalanceContact = {
  id: string;
  name: string;
  amount: string;
  type: "receive" | "owe";
  avatar: string;
};

export type HomeSummary = {
  netBalance: string;
  owedAmount: string;
  oweAmount: string;
  userName: string;
};

export const homeSummary: HomeSummary = {
  netBalance: "+₹2,400",
  owedAmount: "₹4,800",
  oweAmount: "₹2,400",
  userName: "Snehasish Mandal",
};

export const balanceContacts: BalanceContact[] = [
  {
    id: "1",
    name: "Ayush",
    amount: "₹1,200",
    type: "receive",
    avatar: "https://i.pravatar.cc/160?img=47",
  },
  {
    id: "2",
    name: "Shukla",
    amount: "₹850",
    type: "owe",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
  {
    id: "3",
    name: "Aryan",
    amount: "₹2,400",
    type: "receive",
    avatar: "https://i.pravatar.cc/160?img=35",
  },
  {
    id: "4",
    name: "Isha",
    amount: "₹510",
    type: "owe",
    avatar: "https://i.pravatar.cc/160?img=32",
  },
  {
    id: "5",
    name: "Ayush",
    amount: "₹1,200",
    type: "receive",
    avatar: "https://i.pravatar.cc/160?img=47",
  },
  {
    id: "6",
    name: "Shukla",
    amount: "₹850",
    type: "owe",
    avatar: "https://i.pravatar.cc/160?img=12",
  },
  {
    id: "7",
    name: "Aryan",
    amount: "₹2,400",
    type: "receive",
    avatar: "https://i.pravatar.cc/160?img=35",
  },
  {
    id: "8",
    name: "Isha",
    amount: "₹510",
    type: "owe",
    avatar: "https://i.pravatar.cc/160?img=32",
  },
];

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
  {
    id: "4",
    user: "Rohan Mehta",
    action: "paid for Movie Night",
    amount: "₹640",
    type: "receive",
    time: "OCT 22",
    avatar: "https://i.pravatar.cc/160?img=15",
  },
  {
    id: "5",
    user: "Isha Kapoor",
    action: "added Cab to Airport",
    amount: "₹510",
    type: "owe",
    time: "OCT 20",
    avatar: "https://i.pravatar.cc/160?img=32",
  },
];

export const homeState = {
  hasGroups: true,
  hasBalances: true,
  hasActivity: true,
};
