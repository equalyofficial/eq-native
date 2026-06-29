import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { SegmentLegendProps, SegmentData } from "./types";

interface CategoryRowProps {
  segment: SegmentData;
  isSelected: boolean;
  onPress: (segmentId: string) => void;
}

function CategoryRow({ segment, isSelected, onPress }: CategoryRowProps) {
  const highlight = useSharedValue(0);
  const rgbColor = hexToRgb(segment.color);

  React.useEffect(() => {
    highlight.value = withTiming(isSelected ? 1 : 0, { duration: 200 });
  }, [isSelected, highlight]);

  // All visual props — borderRadius, backgroundColor, borderColor — live in the SAME
  // useAnimatedStyle so the native renderer applies them in one pass. Splitting borderRadius
  // into a static style array while backgroundColor is animated causes the clip to be lost
  // on Android's RippleDrawable layer, producing a rectangular highlight.
  const cardStyle = useAnimatedStyle(() => ({
    borderRadius: 14,
    backgroundColor: interpolateColor(
      highlight.value,
      [0, 1],
      ["rgba(0, 0, 0, 0)", `rgba(${rgbColor}, 0.08)`],
    ),
  }));

  return (
    // Pressable is a pure touch handler — no visual style on it.
    // Animated.View owns all visual properties so borderRadius clipping is always correct.
    <Pressable onPress={() => onPress(segment.id)}>
      <Animated.View
        style={[cardStyle, { paddingVertical: 11, paddingHorizontal: 14, minHeight: 44 }]}
      >
        {/* Top row: emoji + label + amount */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <Text style={{ fontSize: 17 }}>{segment.icon}</Text>
            <Text className="text-sm font-semibold text-foreground">
              {segment.label}
            </Text>
          </View>
          <Text className="text-sm font-bold" style={{ color: segment.color }}>
            {segment.amount}
          </Text>
        </View>

        {/* Bottom row: progress bar */}
        <View className="mt-2">
          <View
            style={{
              flex: 1,
              height: 3,
              borderRadius: 999,
              backgroundColor: `rgba(${rgbColor}, 0.12)`,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${segment.percentage}%`,
                height: "100%",
                borderRadius: 999,
                backgroundColor: segment.color,
              }}
            />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function SegmentLegend({
  segments,
  selectedSegmentId,
  onSegmentTap,
  hasMore,
  onSeeMorePress,
}: SegmentLegendProps) {
  return (
    <View>
      <FlatList
        data={segments}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <CategoryRow
            segment={item}
            isSelected={selectedSegmentId === item.id}
            onPress={onSegmentTap}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 7 }} />}
      />

      {hasMore && (
        <Pressable
          onPress={onSeeMorePress}
          style={{
            marginTop: 8,
            paddingVertical: 11,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: "rgba(150, 150, 150, 0.2)",
            alignItems: "center",
          }}
        >
          <Text className="text-sm font-semibold text-primary">
            See All Categories
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0, 0, 0";
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ].join(", ");
}
