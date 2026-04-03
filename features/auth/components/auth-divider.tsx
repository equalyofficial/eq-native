import { Text, View } from "react-native";

export function AuthDivider() {
  return (
    <View className="my-3 flex-row items-center">
      <View className="h-px flex-1 bg-border" />
      <Text className="mx-4 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
        Or continue with
      </Text>
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}
