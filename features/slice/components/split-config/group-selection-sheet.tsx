import React from "react";
import { ScrollView, View, Text, Pressable, Image } from "react-native";
import { BottomSheet } from "heroui-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import type { MockGroup } from "../../slice-flow.data";

interface GroupSelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  groups: MockGroup[];
  selectedGroupId: string | null;
  onSelect: (groupId: string) => void;
}

function GroupRow({
  group,
  isActive,
  onPress,
}: {
  group: MockGroup;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const fgColor = useCSSVariable("--color-foreground");

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 10, stiffness: 420 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 14, stiffness: 300 });
      }}
      onPress={onPress}
    >
      <Animated.View
        style={animatedStyle}
        className={
          isActive
            ? "flex-row items-center gap-4 rounded-2xl px-4 py-4 border border-foreground bg-foreground/5"
            : "flex-row items-center gap-4 rounded-2xl px-4 py-4 bg-card"
        }
      >
        {/* Group emoji */}
        <View
          className={
            isActive
              ? "h-12 w-12 items-center justify-center rounded-full bg-foreground"
              : "h-12 w-12 items-center justify-center rounded-full bg-background"
          }
        >
          <Text className="text-xl leading-none">{group.emoji}</Text>
        </View>

        {/* Group info */}
        <View className="flex-1 gap-0.5">
          <Text className="text-base font-semibold text-foreground">
            {group.name}
          </Text>
          <Text className="text-xs text-muted">
            {group.members.length} member
            {group.members.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Member avatars stack */}
        <View className="flex-row -space-x-2">
          {group.members.slice(0, 3).map((member, index) => (
            <Image
              key={member.id}
              source={{ uri: member.avatarUrl }}
              className="h-7 w-7 rounded-full border-2 border-background"
              style={{ marginLeft: index > 0 ? -8 : 0 }}
            />
          ))}
          {group.members.length > 3 && (
            <View
              className="h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-card"
              style={{ marginLeft: -8 }}
            >
              <Text className="text-[10px] font-semibold text-muted">
                +{group.members.length - 3}
              </Text>
            </View>
          )}
        </View>

        {/* Checkmark */}
        {isActive && (
          <Feather
            name="check"
            size={18}
            color={String(fgColor)}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}

export function GroupSelectionSheet({
  isOpen,
  onOpenChange,
  groups,
  selectedGroupId,
  onSelect,
}: GroupSelectionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          className="bg-background"
          contentContainerClassName="pt-3 pb-0"
        >
          <BottomSheet.Title className="mb-5 px-6 text-xl font-bold text-foreground">
            Select Group
          </BottomSheet.Title>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 40,
              gap: 8,
            }}
          >
            {groups.map((group) => (
              <GroupRow
                key={group.id}
                group={group}
                isActive={selectedGroupId === group.id}
                onPress={() => {
                  onSelect(group.id);
                  onOpenChange(false);
                }}
              />
            ))}
          </ScrollView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
