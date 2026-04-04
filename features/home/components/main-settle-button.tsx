import { Pressable, Text } from 'react-native';

export function MainSettleButton() {
  return (
    <Pressable className="h-14 items-center justify-center rounded-full bg-linear-to-r from-zinc-100 to-[#7C7EFF]">
      <Text className="text-lg font-bold text-white">Settle Up</Text>
    </Pressable>
  );
}
