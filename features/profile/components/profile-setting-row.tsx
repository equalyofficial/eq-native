import React, { memo } from "react";
import { Feather } from "@expo/vector-icons";
import { Pressable, Switch, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";

type ProfileSettingRowProps = {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value?: string;
  variant?: "default" | "destructive";
  separated?: boolean;
  onPress?: () => void;
  toggle?: {
    value: boolean;
    onValueChange: (value: boolean) => void;
  };
  rightSlot?: React.ReactNode;
};

export const ProfileSettingRow = memo(function ProfileSettingRow({
  icon,
  label,
  value,
  variant = "default",
  separated = false,
  onPress,
  toggle,
  rightSlot,
}: ProfileSettingRowProps) {
  const [muted, border, accent, danger, background] = useCSSVariable([
    "--color-muted",
    "--color-border",
    "--color-accent",
    "--color-danger",
    "--color-background",
  ]);
  
  const mutedColor = muted as string;
  const borderColor = border as string;
  const accentColor = accent as string;
  const dangerColor = danger as string;
  const bgColor = background as string;
  
  const labelClassName =
    variant === "destructive" ? "text-red-500" : "text-foreground";


  const content = (
    <View
      className={[
        "flex-row items-center justify-between px-1 py-4",
        separated ? "border-b border-border bg-transparent" : "rounded-2xl border border-border bg-card px-4",
      ].join(" ")}
    >
      <View className="flex-1 flex-row items-center gap-3 pr-4">
        <View
          className={[
            "h-11 w-11 items-center justify-center rounded-full",
            separated ? "bg-card" : "bg-background",
          ].join(" ")}
        >
          <Feather
            name={icon}
            size={18}
            color={variant === "destructive" ? dangerColor : mutedColor}
          />
        </View>

        <Text className={`text-base font-semibold ${labelClassName}`}>{label}</Text>
      </View>

      {toggle ? (
         <Switch
           value={toggle.value}
           onValueChange={toggle.onValueChange}
           trackColor={{ false: borderColor, true: accentColor }}
           thumbColor={bgColor}
         />

      ) : rightSlot ? (
        rightSlot
      ) : (
        <View className="flex-row items-center gap-2">
          {value ? <Text className="text-sm font-medium text-muted">{value}</Text> : null}
           <Feather
             name="chevron-right"
             size={18}
             color={variant === "destructive" ? dangerColor : mutedColor}
           />

        </View>
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
});
