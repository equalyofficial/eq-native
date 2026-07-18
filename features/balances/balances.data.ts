export type BalanceType = "receive" | "owe" | "settled";

export type PersonBalance = {
  id: string;
  name: string;
  phone: string;
  amount: string;
  type: BalanceType;
  avatar: string;
  isOnline?: boolean;
};

export type GroupBalance = {
  id: string;
  name: string;
  memberCount: number;
  amount: string;
  type: BalanceType;
  emoji: string;
};

export const totalNetBalance = "₹12,450";

export const peopleBalances: PersonBalance[] = [
  {
    id: "1",
    name: "Arjun Mehta",
    phone: "+91 98765 43210",
    amount: "₹2,400",
    type: "receive",
    avatar: "https://i.pravatar.cc/160?img=12",
    isOnline: true,
  },
  {
    id: "2",
    name: "Sara Pawar",
    phone: "+91 91234 56789",
    amount: "₹850",
    type: "owe",
    avatar: "https://i.pravatar.cc/160?img=47",
  },
  {
    id: "3",
    name: "Rohan Khanna",
    phone: "+91 88888 77777",
    amount: "₹10,900",
    type: "receive",
    avatar: "https://i.pravatar.cc/160?img=15",
  },
  {
    id: "4",
    name: "Isha Kapoor",
    phone: "+91 70000 11111",
    amount: "₹0",
    type: "settled",
    avatar: "https://i.pravatar.cc/160?img=32",
  },
];

export const groupBalances: GroupBalance[] = [
  {
    id: "1",
    name: "Goa Trip",
    memberCount: 6,
    amount: "₹1,200",
    type: "receive",
    emoji: "🏖️",
  },
  {
    id: "2",
    name: "Flat 4B",
    memberCount: 4,
    amount: "₹850",
    type: "owe",
    emoji: "🏠",
  },
  {
    id: "3",
    name: "Office Gang",
    memberCount: 8,
    amount: "₹640",
    type: "receive",
    emoji: "💼",
  },
  {
    id: "4",
    name: "Weekend Crew",
    memberCount: 5,
    amount: "₹0",
    type: "settled",
    emoji: "🎉",
  },
];
