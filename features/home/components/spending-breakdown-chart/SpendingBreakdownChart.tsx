import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { DoughnutVisualization } from "./DoughnutVisualization";
import { SegmentLegend } from "./SegmentLegend";
import { calculateSegmentAngles } from "./spending-chart.styles";
import type { SpendingCategory } from "../../home.data";
import type { SegmentData } from "./types";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

const MAX_VISIBLE_SEGMENTS = 5;

interface SpendingBreakdownChartProps {
  categories: SpendingCategory[];
  totalAmount: string;
  period: string;
}

export function SpendingBreakdownChart({
  categories,
  totalAmount,
  period,
}: SpendingBreakdownChartProps) {
  const colorScheme = useEffectiveColorScheme();
  const [selectedSegmentId, setSelectedSegmentId] = React.useState<string | null>(null);
  const [showExpandOverlay, setShowExpandOverlay] = React.useState(false);

  const { segments, hasMore } = useMemo(() => {
    const total = categories.reduce((sum, cat) => sum + cat.numericAmount, 0);
    const needsGrouping = categories.length > MAX_VISIBLE_SEGMENTS;

    if (!needsGrouping) {
      const segs: SegmentData[] = categories.map((cat) => ({
        ...cat,
        color: colorScheme === "dark" ? (cat.colorDark ?? cat.colorLight ?? "#6B7280") : (cat.colorLight ?? "#9CA3AF"),
        percentage: (cat.numericAmount / total) * 100,
        startAngle: 0,
        endAngle: 0,
      }));

      const angles = calculateSegmentAngles(segs);
      segs.forEach((seg, idx) => {
        seg.startAngle = angles[idx].startAngle;
        seg.endAngle = angles[idx].endAngle;
      });

      return { segments: segs, hasMore: false };
    }

    const sorted = [...categories].sort(
      (a, b) => b.numericAmount - a.numericAmount,
    );
    const top5 = sorted.slice(0, MAX_VISIBLE_SEGMENTS);
    const others = sorted.slice(MAX_VISIBLE_SEGMENTS);
    const otherSum = others.reduce((sum, cat) => sum + cat.numericAmount, 0);

    const segs: SegmentData[] = [
      ...top5.map((cat) => ({
        ...cat,
        color: colorScheme === "dark" ? (cat.colorDark ?? cat.colorLight ?? "#6B7280") : (cat.colorLight ?? "#9CA3AF"),
        percentage: (cat.numericAmount / total) * 100,
        startAngle: 0,
        endAngle: 0,
        isMore: false,
      })),
      {
        id: "others-group",
        label: "More",
        amount: `₹${otherSum.toLocaleString("en-IN")}`,
        numericAmount: otherSum,
        maxAmount: total,
        icon: "📦",
        color: colorScheme === "dark" ? "#6B7280" : "#9CA3AF",
        percentage: (otherSum / total) * 100,
        startAngle: 0,
        endAngle: 0,
        isMore: true,
      } as SegmentData,
    ];

    const angles = calculateSegmentAngles(segs);
    segs.forEach((seg, idx) => {
      seg.startAngle = angles[idx].startAngle;
      seg.endAngle = angles[idx].endAngle;
    });

    return { segments: segs, hasMore: true };
  }, [categories, colorScheme]);

  const handleSegmentTap = (segmentId: string) => {
    setSelectedSegmentId((prev) => (prev === segmentId ? null : segmentId));
  };

  const handleSeeMore = () => {
    setShowExpandOverlay(true);
  };

  return (
    <View>
      <DoughnutVisualization
        segments={segments}
        totalAmount={totalAmount}
        period={period}
        selectedSegmentId={selectedSegmentId}
        onSegmentTap={handleSegmentTap}
      />

      {/* Centered divider */}
      <View className="mb-3 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-border" />
        <Text className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
          Breakdown
        </Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <SegmentLegend
        segments={segments}
        totalSpending={categories.reduce(
          (sum, cat) => sum + cat.numericAmount,
          0,
        )}
        selectedSegmentId={selectedSegmentId}
        onSegmentTap={handleSegmentTap}
        hasMore={hasMore}
        onSeeMorePress={handleSeeMore}
      />

      {showExpandOverlay && (
        <View>{/* TODO: Expand overlay implementation */}</View>
      )}
    </View>
  );
}
