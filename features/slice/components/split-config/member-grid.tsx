import React, { useState } from "react";
import { View, Text, Pressable, Image, TextInput } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useCSSVariable } from "uniwind";
import type { MockMember } from "../../slice-flow.data";
import type { SplitType } from "../../hooks/use-slice-flow-store";

interface MemberGridProps {
  members: MockMember[];
  selectedMemberIds: string[];
  onToggleMember: (id: string) => void;
  splitType: SplitType;
  totalAmount: number;
  percentages: Record<string, number>;
  customAmounts: Record<string, number>;
}

function MemberCell({
  member,
  isSelected,
  shareLabel,
  onToggle,
  fgColor,
  bgColor,
  mutedColor,
}: {
  member: MockMember;
  isSelected: boolean;
  shareLabel: string | null;
  onToggle: () => void;
  fgColor: string;
  bgColor: string;
  mutedColor: string;
}) {
  const scale = useSharedValue(1);
  const firstName = member.name.split(" ")[0] ?? member.name;

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSequence(
      withSpring(0.88, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 14, stiffness: 280 }),
    );
    onToggle();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{ width: "50%", alignItems: "center", paddingVertical: 14, paddingHorizontal: 8 }}
    >
      <Animated.View style={[{ alignItems: "center", gap: 6 }, animStyle]}>
        {/* Avatar with selection ring */}
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            borderWidth: 2.5,
            borderColor: isSelected ? fgColor : "rgba(120,120,120,0.18)",
            padding: 3,
          }}
        >
          <Image
            source={{ uri: member.avatarUrl }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 999,
              opacity: isSelected ? 1 : 0.32,
            }}
          />
          {isSelected && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: fgColor,
                borderWidth: 2,
                borderColor: bgColor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="check" size={10} color={bgColor} />
            </View>
          )}
        </View>

        {/* Name */}
        <Text
          style={{
            fontSize: 12,
            fontFamily: isSelected ? "Outfit_600SemiBold" : "Outfit_400Regular",
            color: isSelected ? fgColor : mutedColor,
            textAlign: "center",
          }}
          numberOfLines={1}
        >
          {firstName}
        </Text>

        {/* Share amount — placeholder height keeps the grid stable when toggling */}
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Outfit_500Medium",
            color: mutedColor,
            height: 16,
          }}
          numberOfLines={1}
        >
          {isSelected && shareLabel ? shareLabel : ""}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function MemberGrid({
  members,
  selectedMemberIds,
  onToggleMember,
  splitType,
  totalAmount,
  percentages,
  customAmounts,
}: MemberGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const showSearch = members.length > 8;

  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000");
  const bgColor = String(useCSSVariable("--color-background") ?? "#fff");
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");
  const cardColor = String(useCSSVariable("--color-card") ?? "#f5f5f5");
  const borderColor = String(useCSSVariable("--color-border") ?? "#e5e7eb");

  const selectedCount = selectedMemberIds.length;
  const equalShare = selectedCount > 0 ? totalAmount / selectedCount : 0;

  const filteredMembers =
    showSearch && searchQuery.trim()
      ? members.filter((m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : members;

  const getShareLabel = (member: MockMember, isSelected: boolean): string | null => {
    if (!isSelected || totalAmount === 0) return null;
    if (splitType === "equal")
      return `₹${Math.round(equalShare).toLocaleString("en-IN")}`;
    if (splitType === "percentage") {
      const pct = percentages[member.id] ?? Math.round(100 / selectedCount);
      return `${pct}%`;
    }
    const custom = customAmounts[member.id] ?? equalShare;
    return `₹${Math.round(custom).toLocaleString("en-IN")}`;
  };

  return (
    <View>
      {/* Search bar — only shown for groups with more than 8 members */}
      {showSearch && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: cardColor,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            gap: 8,
            marginBottom: 12,
            borderWidth: 1,
            borderColor,
          }}
        >
          <Feather name="search" size={15} color={mutedColor} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search members…"
            placeholderTextColor={mutedColor}
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: "Outfit_400Regular",
              color: fgColor,
            }}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")} hitSlop={8}>
              <Feather name="x" size={14} color={mutedColor} />
            </Pressable>
          )}
        </View>
      )}

      {/* 2-column avatar grid */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {filteredMembers.map((member) => {
          const isSelected = selectedMemberIds.includes(member.id);
          return (
            <MemberCell
              key={member.id}
              member={member}
              isSelected={isSelected}
              shareLabel={getShareLabel(member, isSelected)}
              onToggle={() => onToggleMember(member.id)}
              fgColor={fgColor}
              bgColor={bgColor}
              mutedColor={mutedColor}
            />
          );
        })}
      </View>

      {/* Selection count */}
      <Text
        style={{
          fontSize: 11,
          fontFamily: "Outfit_500Medium",
          color: mutedColor,
          textAlign: "center",
          marginTop: 4,
        }}
      >
        {selectedCount} of {members.length} selected
      </Text>
    </View>
  );
}
