import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { BottomSheet } from "heroui-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import Animated, { FadeIn } from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { useSliceFlowStore } from "../../hooks/use-slice-flow-store";

interface BillUploadSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BillUploadSheet({ isOpen, onOpenChange }: BillUploadSheetProps) {
  const { billImageUri, setBillImage } = useSliceFlowStore();
  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000000");
  const bgColor = String(useCSSVariable("--color-background") ?? "#ffffff");
  const mutedColor = String(useCSSVariable("--color-muted") ?? "#71717a");

  const pickImage = async (fromCamera: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.85, allowsEditing: true });

    if (!result.canceled && result.assets[0]) {
      setBillImage(result.assets[0].uri);
      onOpenChange(false);
    }
  };

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBillImage(null);
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          className="bg-background"
          contentContainerClassName="pt-2 pb-0"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 pb-5 pt-2">
            <Text className="text-xl font-bold text-foreground">
              {billImageUri ? "Bill Receipt" : "Upload Bill Receipt"}
            </Text>
            <Pressable
              onPress={() => onOpenChange(false)}
              className="h-9 w-9 items-center justify-center rounded-full bg-card active:opacity-70"
            >
              <Feather name="x" size={18} color={fgColor} />
            </Pressable>
          </View>

          <View className="px-4 pb-12 gap-4">
            {billImageUri ? (
              /* Preview State */
              <Animated.View entering={FadeIn.duration(250)} className="gap-4">
                <View className="overflow-hidden rounded-3xl border border-border" style={{ height: 220 }}>
                  <Image
                    source={{ uri: billImageUri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={handleRemove}
                    className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-foreground active:opacity-80"
                  >
                    <Feather name="x" size={16} color={bgColor} />
                  </Pressable>
                </View>
                <Pressable
                  onPress={() => pickImage(false)}
                  className="items-center rounded-full border border-border py-3.5 active:opacity-70"
                >
                  <Text className="text-base font-semibold text-foreground">Replace Photo</Text>
                </Pressable>
              </Animated.View>
            ) : (
              /* Upload State */
              <Animated.View entering={FadeIn.duration(250)} className="gap-4">
                {/* Dashed upload area */}
                <View
                  className="h-44 items-center justify-center rounded-3xl bg-card"
                  style={styles.dashed}
                >
                  <View className="items-center gap-3">
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-foreground/5">
                      <Feather name="camera" size={24} color={mutedColor} />
                    </View>
                    <Text className="text-sm font-medium text-muted">Attach receipt photo</Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => pickImage(true)}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-full border border-border bg-card py-3.5 active:opacity-70"
                  >
                    <Feather name="camera" size={16} color={fgColor} />
                    <Text className="text-sm font-semibold text-foreground">Take Photo</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => pickImage(false)}
                    className="flex-1 flex-row items-center justify-center gap-2 rounded-full bg-foreground py-3.5 active:opacity-80"
                    style={styles.shadow}
                  >
                    <Feather name="image" size={16} color={bgColor} />
                    <Text className="text-sm font-semibold text-background">Gallery</Text>
                  </Pressable>
                </View>
              </Animated.View>
            )}
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  dashed: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(128,128,128,0.3)",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
