// features/auth/components/auth-primary-button.tsx

import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { ReactNode } from "react";

type AuthPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  isLoading?: boolean;
  rightIcon?: ReactNode;
};

export function AuthPrimaryButton({
  label,
  onPress,
  isLoading = false,
  rightIcon,
}: AuthPrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={[
        "mt-2 min-h-14 flex-row items-center justify-center rounded-full bg-button-primary px-5",
        isLoading ? "opacity-70" : "opacity-100",
      ].join(" ")}
    >
      {isLoading ? (
        <ActivityIndicator colorClassName="accent-primary-foreground" />
      ) : (
        <>
          <Text className="text-base font-bold text-primary-foreground">
            {label}
          </Text>
          {rightIcon ? <View className="ml-2 mt-0.5">{rightIcon}</View> : null}
        </>
      )}
    </Pressable>
  );
}
