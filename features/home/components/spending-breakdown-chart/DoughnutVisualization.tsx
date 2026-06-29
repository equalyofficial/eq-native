import React, { useEffect } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Pressable, Text, View } from "react-native";

import {
  DOUGHNUT_DIAMETER,
  DOUGHNUT_RADIUS,
  INNER_RADIUS,
  CENTER_X,
  CENTER_Y,
  ENTRY_DURATION,
  STAGGER_DELAY,
  TAP_SPRING,
  TAP_DURATION,
  MID_RADIUS,
  RING_STROKE_WIDTH,
  RING_CIRCUMFERENCE,
} from "./spending-chart.styles";
import type { SegmentData, DoughnutProps } from "./types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Cap extension = strokeWidth/2 (11px) = 6.6°. Gap = 2*(TRIM - 6.6°).
// SEGMENT_TRIM=7 → gap ≈ 1.3px — subtle line between rounded caps, not chunky.
const SEGMENT_TRIM = 7;
const SELECTED_STROKE_GROWTH = 6;

function SegmentItem({
  segment,
  index,
  isSelected,
}: {
  segment: SegmentData;
  index: number;
  isSelected: boolean;
}) {
  const opacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const strokeAnim = useSharedValue(RING_STROKE_WIDTH);

  const segmentAngle = segment.endAngle - segment.startAngle;
  const arcLength = Math.max(
    0,
    ((segmentAngle - SEGMENT_TRIM * 2) / 360) * RING_CIRCUMFERENCE,
  );
  const rotation = segment.startAngle + SEGMENT_TRIM - 90;

  useEffect(() => {
    opacity.value = withDelay(
      index * STAGGER_DELAY,
      withTiming(1, { duration: ENTRY_DURATION }),
    );
  }, [index, opacity]);

  useEffect(() => {
    strokeAnim.value = withSpring(
      isSelected ? RING_STROKE_WIDTH + SELECTED_STROKE_GROWTH : RING_STROKE_WIDTH,
      TAP_SPRING,
    );
    glowOpacity.value = withTiming(isSelected ? 0.22 : 0, { duration: TAP_DURATION });
  }, [isSelected, strokeAnim, glowOpacity]);

  const segmentColor = segment.color;

  const mainProps = useAnimatedProps(() => ({
    opacity: opacity.value,
    strokeWidth: strokeAnim.value,
  }));

  const glowProps = useAnimatedProps(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <>
      <AnimatedCircle
        cx={CENTER_X}
        cy={CENTER_Y}
        r={MID_RADIUS}
        fill="none"
        stroke={segmentColor}
        strokeWidth={RING_STROKE_WIDTH + 22}
        strokeLinecap="round"
        strokeDasharray={`${arcLength} ${RING_CIRCUMFERENCE}`}
        transform={`rotate(${rotation} ${CENTER_X} ${CENTER_Y})`}
        animatedProps={glowProps}
      />
      <AnimatedCircle
        cx={CENTER_X}
        cy={CENTER_Y}
        r={MID_RADIUS}
        fill="none"
        stroke={segmentColor}
        strokeLinecap="round"
        strokeDasharray={`${arcLength} ${RING_CIRCUMFERENCE}`}
        transform={`rotate(${rotation} ${CENTER_X} ${CENTER_Y})`}
        animatedProps={mainProps}
      />
    </>
  );
}

function CenterContent({
  totalAmount,
  period,
  selectedSegment,
}: {
  totalAmount: string;
  period: string;
  selectedSegment: SegmentData | null;
}) {
  const totalOpacity = useSharedValue(1);
  const detailOpacity = useSharedValue(0);

  useEffect(() => {
    if (selectedSegment) {
      totalOpacity.value = withTiming(0, { duration: 180 });
      detailOpacity.value = withTiming(1, { duration: 220 });
    } else {
      totalOpacity.value = withTiming(1, { duration: 220 });
      detailOpacity.value = withTiming(0, { duration: 180 });
    }
  }, [selectedSegment, totalOpacity, detailOpacity]);

  const totalStyle = useAnimatedStyle(() => ({ opacity: totalOpacity.value }));
  const detailStyle = useAnimatedStyle(() => ({ opacity: detailOpacity.value }));

  return (
    <View
      className="absolute items-center justify-center rounded-full bg-background"
      style={{
        width: INNER_RADIUS * 2,
        height: INNER_RADIUS * 2,
        top: DOUGHNUT_RADIUS - INNER_RADIUS,
        left: DOUGHNUT_RADIUS - INNER_RADIUS,
      }}
    >
      <Animated.View
        style={[totalStyle, { position: "absolute", alignItems: "center" }]}
        pointerEvents={selectedSegment ? "none" : "auto"}
      >
        <Text className="text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
          TOTAL
        </Text>
        <Text className="text-xl font-bold tracking-tight text-foreground">
          {totalAmount}
        </Text>
        <Text className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-muted">
          {period}
        </Text>
      </Animated.View>

      <Animated.View
        style={[detailStyle, { position: "absolute", alignItems: "center" }]}
        pointerEvents={selectedSegment ? "auto" : "none"}
      >
        {selectedSegment && (
          <>
            <Text style={{ fontSize: 20, lineHeight: 26 }}>
              {selectedSegment.icon}
            </Text>
            <Text
              className="mt-0.5 text-[11px] font-semibold text-foreground"
              numberOfLines={1}
              style={{ maxWidth: INNER_RADIUS * 1.6 }}
            >
              {selectedSegment.label}
            </Text>
            <Text
              className="text-sm font-bold tracking-tight"
              style={{ color: selectedSegment.color }}
            >
              {selectedSegment.amount}
            </Text>
            <Text className="text-[9px] font-medium text-muted">
              {selectedSegment.percentage.toFixed(0)}%
            </Text>
          </>
        )}
      </Animated.View>
    </View>
  );
}

export function DoughnutVisualization({
  segments,
  totalAmount,
  period,
  selectedSegmentId,
  onSegmentTap,
}: DoughnutProps) {
  const selectedSegment = selectedSegmentId
    ? (segments.find((s) => s.id === selectedSegmentId) ?? null)
    : null;

  // Coordinate-based segment detection — avoids the strokeDasharray invisible-area bug
  // where the full circle stroke receives touches even outside the visible arc.
  const handleRingPress = (evt: any) => {
    const { locationX, locationY } = evt.nativeEvent;
    const dx = locationX - CENTER_X;
    const dy = locationY - CENTER_Y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Only respond to taps within the ring band
    if (dist < INNER_RADIUS || dist > DOUGHNUT_RADIUS) return;

    // atan2 → degrees, rotate so 12 o'clock = 0°, normalise to [0, 360)
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
    if (angle < 0) angle += 360;

    const tapped = segments.find(
      (seg) => angle >= seg.startAngle && angle < seg.endAngle,
    );
    if (tapped) onSegmentTap(tapped.id);
  };

  return (
    <View className="items-center py-6">
      <View
        style={{
          position: "relative",
          width: DOUGHNUT_DIAMETER,
          height: DOUGHNUT_DIAMETER,
        }}
      >
        {/* Single Pressable over the full SVG — coordinate math picks the right segment */}
        <Pressable
          onPress={handleRingPress}
          style={{ width: DOUGHNUT_DIAMETER, height: DOUGHNUT_DIAMETER }}
        >
          <Svg
            width={DOUGHNUT_DIAMETER}
            height={DOUGHNUT_DIAMETER}
            viewBox={`0 0 ${DOUGHNUT_DIAMETER} ${DOUGHNUT_DIAMETER}`}
          >
            {segments.map((segment, index) => (
              <SegmentItem
                key={segment.id}
                segment={segment}
                index={index}
                isSelected={selectedSegmentId === segment.id}
              />
            ))}
          </Svg>
        </Pressable>

        {/* Center hole — floats above the Pressable, captures its own touch area */}
        <CenterContent
          totalAmount={totalAmount}
          period={period}
          selectedSegment={selectedSegment}
        />
      </View>
    </View>
  );
}
