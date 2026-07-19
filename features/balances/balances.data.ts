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

export type SettleTarget = {
  id: string;
  name: string;
  avatar: string;
  amount: number;
  upiId?: string;
};

export type GroupMemberBalance = {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  isYou?: boolean;
  upiId?: string;
};

export type GroupActivityItem = {
  id: string;
  kind: "expense" | "settlement";
  title: string;
  meta: string;
  amount: string;
  emoji?: string;
};

export type GroupDetail = {
  id: string;
  name: string;
  emoji: string;
  memberCount: number;
  myNet: number;
  members: GroupMemberBalance[];
  activity: GroupActivityItem[];
};

export type PersonGroupBalance = {
  groupId: string;
  groupName: string;
  emoji: string;
  amount: number;
};

export type PersonDetail = {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  net: number;
  upiId?: string;
  breakdown: PersonGroupBalance[];
};

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

export const groupDetails: Record<string, GroupDetail> = {
  "1": {
    id: "1",
    name: "Goa Trip",
    emoji: "🏖️",
    memberCount: 6,
    myNet: 1200,
    members: [
      { id: "me", name: "You", avatar: "https://i.pravatar.cc/160?img=68", balance: 0, isYou: true },
      { id: "a", name: "Arjun Mehta", avatar: "https://i.pravatar.cc/160?img=12", balance: 1200 },
      { id: "b", name: "Sara Pawar", avatar: "https://i.pravatar.cc/160?img=47", balance: -450 },
      { id: "c", name: "Rohan Khanna", avatar: "https://i.pravatar.cc/160?img=15", balance: 300 },
    ],
    activity: [
      { id: "e1", kind: "expense", title: "Hotel booking", meta: "Paid by Arjun · 2h ago", amount: "₹7,200", emoji: "🏨" },
      { id: "e2", kind: "expense", title: "Dinner at Olive", meta: "Paid by You · yesterday", amount: "₹3,400", emoji: "🍽️" },
      { id: "s1", kind: "settlement", title: "Sara paid you", meta: "via UPI · Oct 24", amount: "₹450", emoji: "💸" },
      { id: "e3", kind: "expense", title: "Scooter rental", meta: "Paid by Rohan · Oct 22", amount: "₹1,800", emoji: "🛵" },
    ],
  },
  "2": {
    id: "2",
    name: "Flat 4B",
    emoji: "🏠",
    memberCount: 4,
    myNet: -850,
    members: [
      { id: "me", name: "You", avatar: "https://i.pravatar.cc/160?img=68", balance: 0, isYou: true },
      { id: "d", name: "Isha Kapoor", avatar: "https://i.pravatar.cc/160?img=32", balance: -850 },
      { id: "e", name: "Neha Roy", avatar: "https://i.pravatar.cc/160?img=45", balance: 0 },
    ],
    activity: [
      { id: "e1", kind: "expense", title: "Electricity bill", meta: "Paid by Isha · yesterday", amount: "₹2,400", emoji: "⚡" },
      { id: "e2", kind: "expense", title: "Groceries", meta: "Paid by You · Oct 20", amount: "₹1,600", emoji: "🛒" },
    ],
  },
};

export const personDetails: Record<string, PersonDetail> = {
  "1": {
    id: "1",
    name: "Arjun Mehta",
    phone: "+91 98765 43210",
    avatar: "https://i.pravatar.cc/160?img=12",
    net: 2400,
    upiId: "arjun@upi",
    breakdown: [
      { groupId: "1", groupName: "Goa Trip", emoji: "🏖️", amount: 1200 },
      { groupId: "3", groupName: "Office Gang", emoji: "💼", amount: 1200 },
    ],
  },
  "2": {
    id: "2",
    name: "Sara Pawar",
    phone: "+91 91234 56789",
    avatar: "https://i.pravatar.cc/160?img=47",
    net: -850,
    upiId: "sara@upi",
    breakdown: [
      { groupId: "1", groupName: "Goa Trip", emoji: "🏖️", amount: -450 },
      { groupId: "2", groupName: "Flat 4B", emoji: "🏠", amount: -400 },
    ],
  },
};
