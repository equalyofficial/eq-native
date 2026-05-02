import type { SpendingCategory } from "../home.data";

export interface SegmentData extends SpendingCategory {
  percentage: number;
  color: string;
  startAngle: number;
  endAngle: number;
  isMore?: boolean;
}

export interface DoughnutProps {
  segments: SegmentData[];
  totalAmount: string;
  period: string;
  selectedSegmentId: string | null;
  onSegmentTap: (segmentId: string) => void;
}

export interface SegmentLegendProps {
  segments: SegmentData[];
  totalSpending: number;
  selectedSegmentId: string | null;
  onSegmentTap: (segmentId: string) => void;
  hasMore: boolean;
  onSeeMorePress?: () => void;
}
