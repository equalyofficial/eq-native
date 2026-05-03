import React, { useEffect } from "react";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { Text, View } from "react-native";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

import {
  DOUGHNUT_DIAMETER,
  DOUGHNUT_RADIUS,
  INNER_RADIUS,
  STROKE_WIDTH,
  CENTER_X,
  CENTER_Y,
  ENTRY_DURATION,
  STAGGER_DELAY,
  ENTRY_SPRING,
  TAP_SPRING,
  TAP_DURATION,
  describeArc,
  calculateSegmentAngles,
  getSegmentColor,
} from "./spending-chart.styles";
import type { SegmentData, DoughnutProps } from "./types";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface SegmentState {
  scale: SharedValue<number>;
  opacity: SharedValue<number>;
  glowOpacity: SharedValue<number>;
}

// Segment renderer component that manages its own animation state
function SegmentItem({
  segment,
  index,
  angle,
  colorScheme,
  isSelected,
  onSegmentTap,
}: {
  segment: SegmentData;
  index: number;
  angle: { startAngle: number; endAngle: number };
  colorScheme: "light" | "dark";
  isSelected: boolean;
  onSegmentTap: (id: string) => void;
}) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  // Entry animation
  useEffect(() => {
    scale.value = withDelay(index * STAGGER_DELAY, withSpring(1, ENTRY_SPRING));
    opacity.value = withDelay(
      index * STAGGER_DELAY,
      withTiming(1, { duration: ENTRY_DURATION })
    );
  }, [index, scale, opacity]);

  // Tap feedback animation
  useEffect(() => {
    if (isSelected) {
      scale.value = withSpring(1.1, TAP_SPRING);
      glowOpacity.value = withTiming(0.3, { duration: TAP_DURATION });
    } else {
      scale.value = withSpring(1, TAP_SPRING);
      glowOpacity.value = withTiming(0, { duration: TAP_DURATION });
    }
  }, [isSelected, scale, glowOpacity]);

  const segmentColor = getSegmentColor(segment.label, colorScheme);

  // Animated props for glow circle
  const glowAnimatedProps = useAnimatedProps(() => ({
    opacity: glowOpacity.value,
  }));

  // Animated props for segment path
  const pathAnimatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }));

  return (
    <React.Fragment key={segment.id}>
      {/* Glow (background) */}
      {isSelected && (
        <AnimatedCircle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={DOUGHNUT_RADIUS}
          fill="none"
          stroke={segmentColor}
          strokeWidth={STROKE_WIDTH + 10}
          animatedProps={glowAnimatedProps}
        />
      )}

      {/* Segment path */}
      <AnimatedPath
        d={describeArc(
          CENTER_X,
          CENTER_Y,
          DOUGHNUT_RADIUS,
          INNER_RADIUS,
          angle.startAngle,
          angle.endAngle
        )}
        fill={segmentColor}
        animatedProps={pathAnimatedProps}
        onPress={() => onSegmentTap(segment.id)}
      />
    </React.Fragment>
  );
}

export function DoughnutVisualization({
  segments,
  totalAmount,
  period,
  selectedSegmentId,
  onSegmentTap,
}: DoughnutProps) {
  const colorScheme = useEffectiveColorScheme();

  // Calculate segment angles
  const angles = calculateSegmentAngles(segments);

  return (
    <View className="items-center py-6">
      {/* SVG Doughnut */}
      <View style={{ position: "relative", width: DOUGHNUT_DIAMETER, height: DOUGHNUT_DIAMETER }}>
        <AnimatedSvg
          width={DOUGHNUT_DIAMETER}
          height={DOUGHNUT_DIAMETER}
          viewBox={`0 0 ${DOUGHNUT_DIAMETER} ${DOUGHNUT_DIAMETER}`}
        >
          {/* Render segments */}
          {segments.map((segment, index) => (
            <SegmentItem
              key={segment.id}
              segment={segment}
              index={index}
              angle={angles[index]}
              colorScheme={colorScheme}
              isSelected={selectedSegmentId === segment.id}
              onSegmentTap={onSegmentTap}
            />
          ))}
        </AnimatedSvg>

        {/* Center circle with total spending */}
        <View
          className="absolute items-center justify-center rounded-full bg-background"
          style={{
            width: INNER_RADIUS * 2,
            height: INNER_RADIUS * 2,
            top: DOUGHNUT_RADIUS - INNER_RADIUS,
            left: DOUGHNUT_RADIUS - INNER_RADIUS,
          }}
        >
          <Text className="text-2xl font-bold text-foreground">
            {totalAmount}
          </Text>
          <Text className="mt-0.5 text-xs font-medium text-muted uppercase tracking-wide">
            {period}
          </Text>
        </View>
      </View>
    </View>
  );
}
