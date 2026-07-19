import { Text, View } from "react-native";
import { spendingCategories } from "../home.data";
import { SpendingBreakdownChart } from "./spending-breakdown-chart/SpendingBreakdownChart";

export function SpendingBreakdown() {
  const totalSpending = spendingCategories.reduce(
    (sum, cat) => sum + cat.numericAmount,
    0
  );

  const totalAmount = `₹${totalSpending.toLocaleString("en-IN")}`;
  const period = new Date().toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <View className="px-5 pt-8">
      <View className="mb-5 flex-row items-center justify-between">
        <Text className="text-2xl font-bold tracking-tight text-foreground">
          Spending
        </Text>
        <View className="rounded-full border border-border px-3 py-1.5">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            {period}
          </Text>
        </View>
      </View>

      <SpendingBreakdownChart
        categories={spendingCategories}
        totalAmount={totalAmount}
        period={period}
      />
    </View>
  );
}
