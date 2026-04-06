import { Pressable, Text, View } from 'react-native';

export function MainSettleButton({ show }: { show: boolean }) {
  if (!show) {
    return (
      <View className="h-14 items-center justify-center rounded-full border border-border bg-card">
        <Text className="text-base font-semibold text-foreground">
          You're all clear
        </Text>
      </View>
    );
  }

  return (
    <Pressable className="h-14 items-center justify-center rounded-full bg-linear-to-r from-zinc-100 to-[#7C7EFF]">
      <Text className="text-lg font-bold text-white">Settle Up</Text>
    </Pressable>
  );
}
