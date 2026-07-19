import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";

interface SwipeSwitchProps {
  /** Swipe left — advance to the next item. */
  onNext: () => void;
  /** Swipe right — go to the previous item. */
  onPrev: () => void;
  children: React.ReactNode;
  enabled?: boolean;
}

/**
 * Wraps content in a horizontal pan gesture that fires onNext / onPrev on a
 * left / right swipe. Tuned to coexist with a vertical scroll parent: it only
 * claims the gesture once horizontal travel passes the threshold and bails out
 * the moment vertical movement dominates.
 */
export function SwipeSwitch({
  onNext,
  onPrev,
  children,
  enabled = true,
}: SwipeSwitchProps) {
  // activeOffsetX makes the pan win only on horizontal-dominant movement;
  // omitting failOffsetY lets vertical scroll pass through untouched (the same
  // recipe RNGH's Swipeable uses inside scroll lists). onFinalize (not onEnd)
  // fires even when the gesture ends without formally "activating", so a quick
  // flick over a pressable row still registers.
  const pan = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX([-12, 12])
    .onFinalize((e) => {
      "worklet";
      const fast = Math.abs(e.velocityX) > 250;
      const far = Math.abs(e.translationX) > 30;
      // Ignore taps / vertical scrolls (little horizontal travel, low velocity).
      if (!far && !fast) return;
      if (Math.abs(e.translationX) < 12) return;
      if (e.translationX < 0) {
        runOnJS(onNext)();
      } else {
        runOnJS(onPrev)();
      }
    });

  return <GestureDetector gesture={pan}>{children}</GestureDetector>;
}
