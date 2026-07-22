import { Image, Text, View } from "react-native";

function initials(name?: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

/**
 * Avatar that shows the user's picture when available, otherwise a clean
 * initials fallback (email/password accounts have no avatar).
 */
export function UserAvatar({
  uri,
  name,
  className = "h-full w-full",
  textClassName = "text-base font-bold text-foreground",
}: {
  uri?: string | null;
  name?: string | null;
  className?: string;
  textClassName?: string;
}) {
  if (uri) {
    return <Image source={{ uri }} className={className} />;
  }
  return (
    <View className={`items-center justify-center bg-card ${className}`}>
      <Text className={textClassName}>{initials(name)}</Text>
    </View>
  );
}
