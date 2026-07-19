export type ActivityKind = "expense" | "settlement" | "event";

export type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  kind: ActivityKind;
  amount?: string;
  tag?: string;
};

export type ActivitySection = {
  id: string;
  label: string;
  items: ActivityItem[];
};

export const activityNetMovement = "₹12,450";

export const activitySections: ActivitySection[] = [
  {
    id: "today",
    label: "Today",
    items: [
      {
        id: "1",
        title: "Dinner at Oia",
        meta: "Santorini Squad · 8:14 PM",
        kind: "expense",
        amount: "−₹1,425",
      },
      {
        id: "2",
        title: "New Trip Created",
        meta: "Alpine Getaway · 4:30 PM",
        kind: "event",
        tag: "Event",
      },
      {
        id: "3",
        title: "Settled up with Marcus",
        meta: "Direct · 11:20 AM",
        kind: "settlement",
        amount: "+₹850",
      },
    ],
  },
  {
    id: "yesterday",
    label: "Yesterday",
    items: [
      {
        id: "4",
        title: "Groceries & Provisions",
        meta: "Household · 6:45 PM",
        kind: "expense",
        amount: "−₹642",
      },
      {
        id: "5",
        title: "Coffee at The Roast",
        meta: "Direct · 9:15 AM",
        kind: "expense",
        amount: "−₹120",
      },
    ],
  },
  {
    id: "thisweek",
    label: "This Week",
    items: [
      {
        id: "7",
        title: "Movie Night",
        meta: "Weekend Crew · Oct 26 · 9:40 PM",
        kind: "expense",
        amount: "−₹480",
      },
      {
        id: "8",
        title: "Settled up with Aryan",
        meta: "Office Gang · Oct 25 · 1:15 PM",
        kind: "settlement",
        amount: "+₹1,200",
      },
      {
        id: "9",
        title: "You reminded Priya",
        meta: "Flat 4B · Oct 25 · 10:02 AM",
        kind: "event",
        tag: "Reminder",
      },
      {
        id: "10",
        title: "Electricity Bill",
        meta: "Flat 4B · Oct 24 · 7:30 PM",
        kind: "expense",
        amount: "−₹350",
      },
    ],
  },
  {
    id: "oct24",
    label: "Oct 24",
    items: [
      {
        id: "6",
        title: "Group Archiving",
        meta: "Summer 2023 · 2:00 PM",
        kind: "event",
        tag: "Closed",
      },
      {
        id: "11",
        title: "Team Lunch",
        meta: "Office Gang · 1:20 PM",
        kind: "expense",
        amount: "−₹890",
      },
      {
        id: "12",
        title: "Neha joined Flat 4B",
        meta: "Flat 4B · 11:00 AM",
        kind: "event",
        tag: "Joined",
      },
    ],
  },
  {
    id: "oct20",
    label: "Oct 20",
    items: [
      {
        id: "13",
        title: "Cab to Airport",
        meta: "Goa Trip · 6:10 AM",
        kind: "expense",
        amount: "−₹510",
      },
      {
        id: "14",
        title: "Weekend Brunch settled",
        meta: "Direct · Oct 19 · 3:45 PM",
        kind: "settlement",
        amount: "+₹640",
      },
    ],
  },
  {
    id: "oct15",
    label: "Oct 15",
    items: [
      {
        id: "15",
        title: "Grocery Run",
        meta: "Household · 5:20 PM",
        kind: "expense",
        amount: "−₹1,240",
      },
      {
        id: "16",
        title: "Office Gang Created",
        meta: "Office Gang · 12:00 PM",
        kind: "event",
        tag: "Event",
      },
      {
        id: "17",
        title: "Settled up with Isha",
        meta: "Flat 4B · 9:30 AM",
        kind: "settlement",
        amount: "+₹320",
      },
    ],
  },
];
