import { useBottomSheetTimingConfigs } from "@gorhom/bottom-sheet";
import { Easing } from "react-native-reanimated";

/**
 * Shared open/close timing for all bottom sheets.
 * A decelerating cubic curve (no spring overshoot) — smooth and jitter-free,
 * matching the iOS sheet feel.
 */
export function useSheetAnimation(duration = 320) {
  return useBottomSheetTimingConfigs({
    duration,
    easing: Easing.out(Easing.cubic),
  });
}
