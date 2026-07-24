import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type AuthSocialButtonProps = {
  provider: "google" | "apple";
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

const providerIconMap: Record<
  AuthSocialButtonProps["provider"],
  {
    family: "ant" | "fa6";
    name: string;
  }
> = {
  google: {
    family: "ant",
    name: "google",
  },
  apple: {
    family: "fa6",
    name: "apple",
  },
};

export function AuthSocialButton({
  provider,
  label,
  onPress,
  disabled = false,
}: AuthSocialButtonProps) {
  const icon = providerIconMap[provider];
  const iconColor = useCSSVariable("--color-foreground") as string;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className="min-h-14 w-full flex-row items-center justify-center rounded-full bg-card border border-border px-5 disabled:opacity-50"
    >
      <View className="h-8 w-8 items-center justify-center ">
        {icon.family === "ant" ? (
          <AntDesign
            name={icon.name as ComponentProps<typeof AntDesign>["name"]}
            size={18}
            color={iconColor}
          />
        ) : (
          <FontAwesome6
            name={icon.name as ComponentProps<typeof FontAwesome6>["name"]}
            size={18}
            color={iconColor}
          />
        )}
      </View>
      <Text className="text-sm font-semibold text-foreground ml-2">
        {label}
      </Text>
    </Pressable>
  );
}
