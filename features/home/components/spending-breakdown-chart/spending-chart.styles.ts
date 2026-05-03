// Doughnut dimensions
export const DOUGHNUT_DIAMETER = 220;
export const DOUGHNUT_RADIUS = DOUGHNUT_DIAMETER / 2;
export const INNER_RADIUS = 80;
export const STROKE_WIDTH = 40;
export const CENTER_X = DOUGHNUT_RADIUS;
export const CENTER_Y = DOUGHNUT_RADIUS;

// Animation timings
export const ENTRY_DURATION = 650;
export const STAGGER_DELAY = 60;
export const TAP_DURATION = 200;
export const THEME_TRANSITION_DURATION = 300;

// Spring configs
export const ENTRY_SPRING = { damping: 18, stiffness: 180, mass: 1 };
export const TAP_SPRING = { damping: 14, stiffness: 200, mass: 1 };

// Segment colors (light mode)
const LIGHT_SEGMENT_COLORS = {
  food: "#10B981",      // Emerald
  travel: "#6366F1",    // Indigo
  entertainment: "#D97706", // Amber (boosted for contrast)
  utilities: "#64748B", // Slate
  others: "#9CA3AF",    // Muted gray
} as const;

// Segment colors (dark mode - desaturated by 15%)
const DARK_SEGMENT_COLORS = {
  food: "#059669",      // Emerald (darker)
  travel: "#4F46E5",    // Indigo (darker)
  entertainment: "#B45309", // Amber (desaturated)
  utilities: "#475569", // Slate (darker)
  others: "#6B7280",    // Muted (lighter for visibility)
} as const;

export type SegmentColorKey = keyof typeof LIGHT_SEGMENT_COLORS;

/**
 * Get segment color based on category and theme
 */
export function getSegmentColor(
  categoryLabel: string,
  colorScheme: "light" | "dark"
): string {
  const key = categoryLabel
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const colorMap =
    colorScheme === "dark"
      ? DARK_SEGMENT_COLORS
      : LIGHT_SEGMENT_COLORS;

  // Validate key exists in color map, otherwise use default
  if (!key || !(key in LIGHT_SEGMENT_COLORS)) {
    return colorMap.others;
  }

  return colorMap[key as SegmentColorKey];
}

/**
 * Convert polar coordinates to SVG x,y
 * Note: SVG coordinate system starts at 3 o'clock (0°), we want 12 o'clock
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): { x: number; y: number } {
  const SVG_ANGLE_OFFSET = -90; // Adjust from 3 o'clock start to 12 o'clock
  const angleInRadians = ((angleInDegrees + SVG_ANGLE_OFFSET) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Generate SVG path for a doughnut segment
 */
export function describeArc(
  centerX: number,
  centerY: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(
    centerX,
    centerY,
    outerRadius,
    endAngle
  );
  const outerEnd = polarToCartesian(
    centerX,
    centerY,
    outerRadius,
    startAngle
  );
  const innerStart = polarToCartesian(
    centerX,
    centerY,
    innerRadius,
    endAngle
  );
  const innerEnd = polarToCartesian(
    centerX,
    centerY,
    innerRadius,
    startAngle
  );

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}

/**
 * Calculate segment angles for a given amount relative to total
 */
export function calculateSegmentAngles(
  segments: { numericAmount: number }[]
): { startAngle: number; endAngle: number }[] {
  const total = segments.reduce((sum, s) => sum + s.numericAmount, 0);

  // Guard against zero total or empty segments
  if (total <= 0 || segments.length === 0) {
    return [];
  }

  const result: { startAngle: number; endAngle: number }[] = [];
  let currentAngle = 0;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const isLastSegment = i === segments.length - 1;
    const sliceAngle = (segment.numericAmount / total) * 360;
    // Normalize last segment to exactly 360 to account for floating-point rounding
    const endAngle = isLastSegment ? 360 : currentAngle + sliceAngle;

    result.push({
      startAngle: currentAngle,
      endAngle,
    });
    currentAngle = endAngle;
  }

  return result;
}
