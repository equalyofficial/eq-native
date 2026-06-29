// Doughnut dimensions
export const DOUGHNUT_DIAMETER = 220;
export const DOUGHNUT_RADIUS = DOUGHNUT_DIAMETER / 2;
export const INNER_RADIUS = 80;
export const STROKE_WIDTH = 40;
// Stroke-based ring rendering
export const MID_RADIUS = (DOUGHNUT_RADIUS + INNER_RADIUS) / 2; // 95 — center of the ring
export const RING_STROKE_WIDTH = 22; // ring thickness (thinner = less prominent rounded caps)
export const RING_CIRCUMFERENCE = 2 * Math.PI * MID_RADIUS; // ~596.9
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

// Selection pop — segment radius grows outward (not inward into the hole)
export const SELECTED_RADIUS_OFFSET = 4;
// Tint overlay intensity when selected (0–1 brightness lift)
export const SELECTED_COLOR_LIGHTEN = 0.12;
// Gradient top-stop lighten amount for 3D bevel
export const GRADIENT_TOP_LIGHTEN = 0.18;

// Lighten (positive) or darken (negative) a hex color by shifting each channel.
export function shadeHex(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(((n >> 16) & 0xff) + Math.round(amount * 255));
  const g = clamp(((n >> 8) & 0xff) + Math.round(amount * 255));
  const b = clamp((n & 0xff) + Math.round(amount * 255));
  return `#${(((r << 16) | (g << 8) | b) >>> 0).toString(16).padStart(6, "0")}`;
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
