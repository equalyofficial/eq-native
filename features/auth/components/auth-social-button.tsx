import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

type AuthSocialButtonProps = {
  provider: "google" | "apple";
  label: string;
  onPress: () => void;
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
}: AuthSocialButtonProps) {
  const icon = providerIconMap[provider];
  const colorScheme = useEffectiveColorScheme();
  const iconColor = colorScheme === "dark" ? "#ffffff" : "#000000";

  return (
    <Pressable
      onPress={onPress}
      className="min-h-14 w-full flex-row items-center justify-center rounded-3xl bg-card border border-border px-5"
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
      <Text className="text-sm font-semibold text-foreground ml-2">{label}</Text>
    </Pressable>
  );
}
