import { Feather } from "@expo/vector-icons";
import { View } from "react-native";
import { AppTextInput } from "@/components/ui/app-text-input";

export function BalancesSearchBar({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <View className="mt-4 h-12 flex-row items-center gap-3 rounded-full bg-card px-4">
      <Feather name="search" size={18} color="#71717a" />
      <AppTextInput
        className="flex-1"
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by name or number..."
        placeholderTextColorClassName="accent-muted"
        returnKeyType="search"
      />
    </View>
  );
}
