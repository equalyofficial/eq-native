// features/auth/components/auth-inline-link.tsx

import { Text, View } from "react-native";

type AuthInlineLinkProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

export function AuthInlineLink({
  prompt,
  actionLabel,
  onPress,
}: AuthInlineLinkProps) {
  return (
    <View className="items-center gap-3">
      <Text className="text-sm font-sans text-muted">
        {prompt}{" "}
        <Text onPress={onPress} className="font-bold text-accent">
          {actionLabel}
        </Text>
      </Text>
    </View>
  );
}
