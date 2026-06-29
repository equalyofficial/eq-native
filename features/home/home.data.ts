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

export type InsightItem = {
  id: string;
  label: string;
  value: string;
  icon: "trending-up" | "users" | "clock";
};

export type SpendingCategory = {
  id: string;
  label: string;
  amount: string;
  numericAmount: number;
  maxAmount: number;
  icon: string;
  colorLight?: string;
  colorDark?: string;
};

export type ActiveGroup = {
  id: string;
  name: string;
  memberCount: number;
  lastExpense: string;
  lastExpenseTime: string;
  totalBalance: string;
  balanceType: "receive" | "owe" | "settled";
  emoji: string;
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
    name: "Rohan",
    amount: "₹1,200",
    type: "receive",
    avatar: "https://i.pravatar.cc/160?img=47",
  },
  {
    id: "6",
    name: "Priya",
    amount: "₹850",
    type: "owe",
    avatar: "https://i.pravatar.cc/160?img=12",
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

export const insights: InsightItem[] = [
  { id: "1", label: "Spent this month", value: "₹8,400", icon: "trending-up" },
  { id: "2", label: "Active groups", value: "4", icon: "users" },
  { id: "3", label: "Pending settles", value: "2", icon: "clock" },
];

export const spendingCategories: SpendingCategory[] = [
  {
    id: "1",
    label: "Food & Drinks",
    amount: "₹3,200",
    numericAmount: 3200,
    maxAmount: 8400,
    icon: "🍽️",
    colorLight: "#10B981",
    colorDark: "#059669",
  },
  {
    id: "2",
    label: "Travel",
    amount: "₹2,100",
    numericAmount: 2100,
    maxAmount: 8400,
    icon: "✈️",
    colorLight: "#6366F1",
    colorDark: "#4F46E5",
  },
  {
    id: "3",
    label: "Entertainment",
    amount: "₹1,640",
    numericAmount: 1640,
    maxAmount: 8400,
    icon: "🎬",
    colorLight: "#D97706",
    colorDark: "#B45309",
  },
  {
    id: "4",
    label: "Utilities",
    amount: "₹960",
    numericAmount: 960,
    maxAmount: 8400,
    icon: "⚡",
    colorLight: "#64748B",
    colorDark: "#475569",
  },
  {
    id: "5",
    label: "Others",
    amount: "₹500",
    numericAmount: 500,
    maxAmount: 8400,
    icon: "📦",
    colorLight: "#9CA3AF",
    colorDark: "#6B7280",
  },
];

export const activeGroups: ActiveGroup[] = [
  {
    id: "1",
    name: "Goa Trip",
    memberCount: 6,
    lastExpense: "Hotel booking",
    lastExpenseTime: "2H AGO",
    totalBalance: "+₹1,200",
    balanceType: "receive",
    emoji: "🏖️",
  },
  {
    id: "2",
    name: "Flat 4B",
    memberCount: 4,
    lastExpense: "Electricity bill",
    lastExpenseTime: "YESTERDAY",
    totalBalance: "-₹850",
    balanceType: "owe",
    emoji: "🏠",
  },
  {
    id: "3",
    name: "Office Gang",
    memberCount: 8,
    lastExpense: "Team lunch",
    lastExpenseTime: "OCT 24",
    totalBalance: "+₹640",
    balanceType: "receive",
    emoji: "💼",
  },
  {
    id: "4",
    name: "Weekend Crew",
    memberCount: 5,
    lastExpense: "Movie tickets",
    lastExpenseTime: "OCT 22",
    totalBalance: "Settled",
    balanceType: "settled",
    emoji: "🎉",
  },
];
