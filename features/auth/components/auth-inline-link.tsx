// features/auth/components/auth-inline-link.tsx

import { Pressable, Text } from "react-native";

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
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      hitSlop={{ top: 12, bottom: 12, left: 16, right: 16 }}
      className="items-center py-2 active:opacity-60"
    >
      <Text className="text-sm font-sans text-muted">
        {prompt} <Text className="font-bold text-accent">{actionLabel}</Text>
      </Text>
    </Pressable>
  );
}
