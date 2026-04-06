export type ProfileThemeOption = "light" | "dark" | "system";

export type ProfileUser = {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  upiId?: string;
};

export type ProfilePreference = {
  notificationsEnabled: boolean;
  preferredCurrency: string;
};

export type DemoCurrency = {
  code: string;
  label: string;
  symbol: string;
};

export const profileUser: ProfileUser = {
  name: "Aryan Sharma",
  phone: "+91 98765 43210",
  email: "aryan.sharma@equaly.app",
  avatar: "https://i.pravatar.cc/240?img=19",
  upiId: "aryan.sharma@oksbi",
};

export const profilePreferences: ProfilePreference = {
  notificationsEnabled: true,
  preferredCurrency: "INR (₹)",
};

export const demoCurrencies: DemoCurrency[] = [
  { code: "INR (₹)", label: "Indian Rupee", symbol: "₹" },
  { code: "USD ($)", label: "US Dollar", symbol: "$" },
  { code: "EUR (€)", label: "Euro", symbol: "€" },
  { code: "GBP (£)", label: "British Pound", symbol: "£" },
  { code: "AED (د.إ)", label: "UAE Dirham", symbol: "د.إ" },
  { code: "SGD (S$)", label: "Singapore Dollar", symbol: "S$" },
  { code: "CAD (C$)", label: "Canadian Dollar", symbol: "C$" },
  { code: "AUD (A$)", label: "Australian Dollar", symbol: "A$" },
  { code: "JPY (¥)", label: "Japanese Yen", symbol: "¥" },
  { code: "CHF (CHF)", label: "Swiss Franc", symbol: "Fr" },
  { code: "SAR (﷼)", label: "Saudi Riyal", symbol: "﷼" },
  { code: "ZAR (R)", label: "South African Rand", symbol: "R" },
];
