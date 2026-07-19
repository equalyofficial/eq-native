import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabProfileButton } from "@/components/tab-profile-button";
import { SpendingBreakdownChart, spendingCategories } from "@/features/home";

export default function InsightsScreen() {
  const total = spendingCategories.reduce((sum, c) => sum + c.numericAmount, 0);
  const totalAmount = `₹${total.toLocaleString("en-IN")}`;

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView
        edges={["top"]}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerClassName="pb-40"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between">
            <Text className="text-4xl font-bold tracking-tight text-foreground">
              Insights
            </Text>
            <TabProfileButton />
          </View>

          <View className="mt-6">
            <SpendingBreakdownChart
              categories={spendingCategories}
              totalAmount={totalAmount}
              period="This month"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
