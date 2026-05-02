import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import type { MockMember } from "../../slice-flow.data";

interface MemberListProps {
  members: MockMember[];
  selectedMemberIds: string[];
  onToggleMember: (memberId: string) => void;
}

function MemberRow({
  member,
  isSelected,
  onToggle,
}: {
  member: MockMember;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const checkScale = useSharedValue(isSelected ? 1 : 0);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    checkScale.value = withSpring(isSelected ? 0 : 1, {
      damping: 12,
      stiffness: 300,
    });
    onToggle();
  };

  const fgColor = useCSSVariable("--color-foreground");
  const bgColor = useCSSVariable("--color-background");

  return (
    <Pressable
      onPress={handlePress}
      className="flex-row items-center gap-3 rounded-2xl px-3 py-3 active:bg-foreground/5"
    >
      {/* Avatar */}
      <Image
        source={{ uri: member.avatarUrl }}
        className="h-10 w-10 rounded-full border border-border"
      />

      {/* Name */}
      <Text className="flex-1 text-base font-medium text-foreground">
        {member.name}
      </Text>

      {/* Checkbox */}
      <View
        className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
          isSelected
            ? "border-foreground bg-foreground"
            : "border-border bg-transparent"
        }`}
      >
        {isSelected && (
          <Animated.View style={checkAnimatedStyle}>
            <Feather name="check" size={14} color={String(bgColor)} />
          </Animated.View>
        )}
      </View>
    </Pressable>
  );
}

export function MemberList({
  members,
  selectedMemberIds,
  onToggleMember,
}: MemberListProps) {
  const selectedCount = selectedMemberIds.length;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Feather
            name="users"
            size={14}
            color={String(useCSSVariable("--color-muted"))}
          />
          <Text className="text-sm font-semibold uppercase tracking-widest text-muted">
            Members
          </Text>
        </View>
        <Text className="text-xs text-muted">
          {selectedCount} of {members.length} selected
        </Text>
      </View>

      <View className="rounded-2xl border border-border bg-card/50">
        {members.map((member, index) => (
          <View key={member.id}>
            <MemberRow
              member={member}
              isSelected={selectedMemberIds.includes(member.id)}
              onToggle={() => onToggleMember(member.id)}
            />
            {index < members.length - 1 && (
              <View className="mx-3 h-px bg-border" />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}
