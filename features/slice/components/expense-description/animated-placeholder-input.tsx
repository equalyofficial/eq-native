import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

interface AnimatedPlaceholderInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholders: string[];
  cycleIntervalMs?: number;
}

export function AnimatedPlaceholderInput({
  value,
  onChangeText,
  placeholders,
  cycleIntervalMs = 2500,
}: AnimatedPlaceholderInputProps) {
  const mutedColor = useCSSVariable("--color-muted");
  const fgColor = useCSSVariable("--color-foreground");
  const borderColor = useCSSVariable("--color-border");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState(
    placeholders[0] ?? "Add a note...",
  );
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values for the placeholder text
  const placeholderOpacity = useSharedValue(1);
  const placeholderTranslateY = useSharedValue(0);

  const advancePlaceholder = () => {
    setCurrentIndex((prev) => {
      const nextIndex = (prev + 1) % placeholders.length;
      return nextIndex;
    });
  };

  // Cycle placeholders when input is empty and not focused
  useEffect(() => {
    if (value.length > 0 || isFocused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      // Fade out + slide up
      placeholderOpacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });
      placeholderTranslateY.value = withTiming(-8, {
        duration: 200,
        easing: Easing.out(Easing.quad),
      });

      // After fade-out, update text and fade in
      setTimeout(() => {
        runOnJS(advancePlaceholder)();
      }, 220);
    }, cycleIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [value, isFocused, cycleIntervalMs]);

  // When index changes, update displayed text and animate in
  useEffect(() => {
    setDisplayedPlaceholder(
      placeholders[currentIndex] ?? "Add a note...",
    );
    placeholderTranslateY.value = 8;
    placeholderOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.in(Easing.quad),
    });
    placeholderTranslateY.value = withTiming(0, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  }, [currentIndex]);

  const placeholderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: placeholderOpacity.value,
    transform: [{ translateY: placeholderTranslateY.value }],
  }));

  const showCustomPlaceholder = value.length === 0;

  return (
    <View className="gap-3">
      <Text className="text-2xl font-bold text-foreground">
        What was this for?
      </Text>
      <Text className="text-base text-muted">
        Add a short description
      </Text>

      <View className="mt-2">
        <View
          className={isFocused ? "rounded-2xl border border-foreground bg-card px-5 py-4" : "rounded-2xl border border-border bg-card px-5 py-4"}
        >
          {/* Custom animated placeholder — positioned behind the TextInput */}
          {showCustomPlaceholder && (
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: "absolute",
                  left: 20,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                },
                placeholderAnimatedStyle,
              ]}
            >
              <Text
                className="text-lg text-muted"
                style={{ opacity: 0.6 }}
              >
                {displayedPlaceholder}
              </Text>
            </Animated.View>
          )}

          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="text-lg text-foreground"
            style={{
              fontFamily: "Outfit_400Regular",
              minHeight: 24,
            }}
            placeholderTextColor="transparent"
            returnKeyType="done"
            autoCorrect={false}
          />
        </View>
      </View>
    </View>
  );
}
