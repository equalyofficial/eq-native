import { Feather } from "@expo/vector-icons";
import { Pressable, Switch, Text, View } from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";

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

export function ProfileSettingRow({
  icon,
  label,
  value,
  variant = "default",
  separated = false,
  onPress,
  toggle,
  rightSlot,
}: ProfileSettingRowProps) {
  const mutedColor = useThemeColor({}, "muted");
  const borderColor = useThemeColor({}, "border");
  const accentColor = useThemeColor({}, "accent");
  const labelClassName =
    variant === "destructive" ? "text-red-500" : "text-foreground";

  const content = (
    <View
      className={[
        "flex-row items-center justify-between px-1 py-4",
        separated ? "border-b border-border bg-transparent" : "rounded-[1.4rem] border border-border bg-card px-4",
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
            color={variant === "destructive" ? "#EF4444" : mutedColor}
          />
        </View>

        <Text className={`text-base font-semibold ${labelClassName}`}>{label}</Text>
      </View>

      {toggle ? (
        <Switch
          value={toggle.value}
          onValueChange={toggle.onValueChange}
          trackColor={{ false: borderColor, true: accentColor }}
          thumbColor="#FFFFFF"
        />
      ) : rightSlot ? (
        rightSlot
      ) : (
        <View className="flex-row items-center gap-2">
          {value ? <Text className="text-sm font-medium text-muted">{value}</Text> : null}
          <Feather
            name="chevron-right"
            size={18}
            color={variant === "destructive" ? "#EF4444" : mutedColor}
          />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}
