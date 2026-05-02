import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

interface BillUploadAreaProps {
  imageUri: string | null;
  onPickImage: () => void;
  onRemoveImage: () => void;
}

export function BillUploadArea({
  imageUri,
  onPickImage,
  onRemoveImage,
}: BillUploadAreaProps) {
  const mutedColor = useCSSVariable("--color-muted");
  const fgColor = useCSSVariable("--color-foreground");
  const bgColor = useCSSVariable("--color-background");
  const borderColor = useCSSVariable("--color-border");

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (imageUri) {
    // Image preview state
    return (
      <View className="gap-3">
        <Text className="text-2xl font-bold text-foreground">
          Bill Attached
        </Text>
        <Text className="text-base text-muted">
          Your receipt is ready to go
        </Text>

        <Animated.View
          entering={FadeIn.duration(300)}
          className="mt-2 overflow-hidden rounded-3xl border border-border"
        >
          <Image
            source={{ uri: imageUri }}
            className="h-56 w-full"
            resizeMode="cover"
          />

          {/* Remove button overlay */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onRemoveImage();
            }}
            className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-foreground"
          >
            <Feather name="x" size={16} color={String(bgColor)} />
          </Pressable>
        </Animated.View>
      </View>
    );
  }

  // Upload area state
  return (
    <View className="gap-3">
      <Text className="text-2xl font-bold text-foreground">Upload Bill</Text>
      <Text className="text-base text-muted">
        Attach a photo of the receipt (optional)
      </Text>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          scale.value = withSpring(0.97, { damping: 12, stiffness: 300 });
          setTimeout(() => {
            scale.value = withSpring(1, { damping: 14, stiffness: 200 });
          }, 150);
          onPickImage();
        }}
      >
        <Animated.View
          style={[animatedStyle, styles.dashedBorder]}
          className="mt-2 h-56 items-center justify-center rounded-3xl bg-card"
        >
          <View className="items-center gap-3">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-foreground/5">
              <Feather name="camera" size={24} color={String(mutedColor)} />
            </View>
            <Text className="text-base font-medium text-muted">
              Tap to upload
            </Text>
            <Text className="text-xs text-muted opacity-60">
              Camera or Gallery
            </Text>
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  dashedBorder: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(128,128,128,0.3)",
  },
});
