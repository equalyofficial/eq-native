/**
 * Mock data for the expense creation flow.
 * Will be replaced with real API calls once groups/expenses APIs are implemented.
 */

export type MockMember = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type MockGroup = {
  id: string;
  name: string;
  emoji: string;
  members: MockMember[];
};

export const mockMembers: MockMember[] = [
  { id: 'm1', name: 'Snehasish Mandal', avatarUrl: 'https://i.pravatar.cc/160?img=19' },
  { id: 'm2', name: 'Rahul Sharma', avatarUrl: 'https://i.pravatar.cc/160?img=12' },
  { id: 'm3', name: 'Priya Patel', avatarUrl: 'https://i.pravatar.cc/160?img=25' },
  { id: 'm4', name: 'Amit Kumar', avatarUrl: 'https://i.pravatar.cc/160?img=33' },
  { id: 'm5', name: 'Neha Gupta', avatarUrl: 'https://i.pravatar.cc/160?img=45' },
  { id: 'm6', name: 'Vikram Singh', avatarUrl: 'https://i.pravatar.cc/160?img=53' },
  { id: 'm7', name: 'Ananya Roy', avatarUrl: 'https://i.pravatar.cc/160?img=47' },
  { id: 'm8', name: 'Kiran Mehta', avatarUrl: 'https://i.pravatar.cc/160?img=60' },
  { id: 'm9', name: 'Suresh Iyer', avatarUrl: 'https://i.pravatar.cc/160?img=7' },
  { id: 'm10', name: 'Divya Nair', avatarUrl: 'https://i.pravatar.cc/160?img=48' },
  { id: 'm11', name: 'Arjun Bose', avatarUrl: 'https://i.pravatar.cc/160?img=15' },
  { id: 'm12', name: 'Meera Pillai', avatarUrl: 'https://i.pravatar.cc/160?img=44' },
];

export const mockGroups: MockGroup[] = [
  {
    id: 'g1',
    name: 'Flatmates',
    emoji: '🏠',
    members: [mockMembers[0], mockMembers[1], mockMembers[2]],
  },
  {
    id: 'g2',
    name: 'Weekend Trip',
    emoji: '✈️',
    members: [mockMembers[0], mockMembers[1], mockMembers[3], mockMembers[4]],
  },
  {
    id: 'g3',
    name: 'Office Lunch',
    emoji: '🍱',
    members: [mockMembers[0], mockMembers[2], mockMembers[4], mockMembers[5]],
  },
  {
    id: 'g4',
    name: 'Movie Night',
    emoji: '🎬',
    members: [mockMembers[0], mockMembers[1], mockMembers[2], mockMembers[3], mockMembers[4], mockMembers[5]],
  },
  {
    id: 'g5',
    name: 'Gym Bros',
    emoji: '🏋️',
    members: [mockMembers[0], mockMembers[3], mockMembers[5]],
  },
  {
    id: 'g6',
    name: 'College Gang',
    emoji: '🎓',
    members: [
      mockMembers[0], mockMembers[1], mockMembers[2], mockMembers[3],
      mockMembers[4], mockMembers[5], mockMembers[6], mockMembers[7],
      mockMembers[8], mockMembers[9], mockMembers[10], mockMembers[11],
    ],
  },
];

/**
 * Category-specific placeholder suggestions for the description input.
 */
export const categoryPlaceholders: Record<string, string[]> = {
  food_and_dining: ['Dinner at the restaurant', 'Morning coffee ☕', 'Late night pizza 🍕', 'Team lunch'],
  shopping: ['New shoes from Nike', 'Amazon order 📦', 'Gift for birthday 🎁', 'Clothes shopping'],
  transport: ['Uber to office', 'Fuel refill ⛽', 'Metro card recharge', 'Cab to airport'],
  groceries: ["Today's groceries", 'Weekly veggies 🥦', 'Milk and bread', 'Monthly supplies'],
  bills_and_recharges: ['Electricity for April', 'WiFi recharge', 'Water bill', 'Phone recharge'],
  entertainment: ['Movie tickets', 'Netflix subscription', 'Concert tickets 🎵', 'Game night'],
  medical: ['Doctor visit', 'Pharmacy pickup 💊', 'Lab tests', 'Insurance copay'],
  travel: ['Hotel booking', 'Flight tickets ✈️', 'Train fare', 'Travel insurance'],
  rent: ['April rent', 'Security deposit', 'Maintenance charges', 'Parking spot'],
  default: ['What did you spend on?', 'Add a note...', 'Describe this expense', 'Expense details'],
};

/**
 * Get placeholder suggestions for a given category.
 */
export function getPlaceholders(category: string): string[] {
  return categoryPlaceholders[category] ?? categoryPlaceholders.default;
}
