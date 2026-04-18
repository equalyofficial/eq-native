import React from "react";
import { ScrollView, View, Text, Pressable, Image, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
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
}: {
  member: MockMember;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const scale = useSharedValue(1);
  const primaryColor = useCSSVariable("--color-primary");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.88, { damping: 10, stiffness: 400 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 14, stiffness: 280 });
    }, 100);
    onToggle();
  };

  const firstName = member.name.split(" ")[0] ?? member.name;

  return (
    <Pressable onPress={handlePress} className="items-center gap-1.5" style={{ width: 60 }}>
      <Animated.View style={[animatedStyle, styles.avatarWrapper, isSelected ? { borderColor: String(primaryColor), borderWidth: 2.5 } : { borderColor: "rgba(128,128,128,0.25)", borderWidth: 2 }]}>
        <Image
          source={{ uri: member.avatarUrl }}
          style={[styles.avatar, !isSelected && { opacity: 0.5 }]}
        />
      </Animated.View>
      <Text
        className={`text-xs font-medium ${isSelected ? "text-foreground" : "text-muted"}`}
        numberOfLines={1}
      >
        {firstName}
      </Text>
    </Pressable>
  );
}

export function MemberAvatarRow({
  members,
  selectedMemberIds,
  onToggleMember,
}: MemberAvatarRowProps) {
  const selectedCount = selectedMemberIds.length;

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold uppercase tracking-widest text-muted">
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
