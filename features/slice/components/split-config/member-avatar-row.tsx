import React from "react";
import { ScrollView, View, Text, Pressable, Image, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import type { MockMember } from "../../slice-flow.data";

interface MemberAvatarRowProps {
  members: MockMember[];
  selectedMemberIds: string[];
  onToggleMember: (memberId: string) => void;
}

function AvatarBubble({
  member,
  isSelected,
  onToggle,
  primaryColor,
}: {
  member: MockMember;
  isSelected: boolean;
  onToggle: () => void;
  primaryColor: string;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
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

  const firstName = member.name.split(" ")[0] ?? member.name;

  return (
    <Animated.View style={[animatedStyle, { width: 60, alignItems: "center", gap: 6 }]}>
      <Pressable onPress={handlePress}>
        <View
          style={[
            styles.avatarWrapper,
            isSelected
              ? { borderColor: primaryColor, borderWidth: 2.5 }
              : { borderColor: "rgba(128,128,128,0.25)", borderWidth: 2 },
          ]}
        >
          <Image
            source={{ uri: member.avatarUrl }}
            style={[styles.avatar, !isSelected && { opacity: 0.5 }]}
          />
        </View>
      </Pressable>
      <Text
        className={isSelected ? "text-xs font-medium text-foreground" : "text-xs font-medium text-muted"}
        numberOfLines={1}
      >
        {firstName}
      </Text>
    </Animated.View>
  );
}

export function MemberAvatarRow({
  members,
  selectedMemberIds,
  onToggleMember,
}: MemberAvatarRowProps) {
  const selectedCount = selectedMemberIds.length;
  const primaryColor = String(useCSSVariable("--color-primary") ?? "#4f46e5");

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs uppercase tracking-widest text-muted">
          Select Members
        </Text>
        <Text className="text-xs font-semibold text-primary">
          {selectedCount} Selected
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingVertical: 4 }}
      >
        {members.map((member) => (
          <AvatarBubble
            key={member.id}
            member={member}
            isSelected={selectedMemberIds.includes(member.id)}
            onToggle={() => onToggleMember(member.id)}
            primaryColor={primaryColor}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
});
