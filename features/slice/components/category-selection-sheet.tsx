import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { BottomSheet } from "heroui-native";

import { ALL_CATEGORIES } from "./category-ribbon";

interface CategorySelectionSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategorySelectionSheet({
  isOpen,
  onOpenChange,
  selectedCategory,
  onSelect,
}: CategorySelectionSheetProps) {
  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          className="bg-background"
          contentContainerClassName="pt-3 pb-0"
        >
          <BottomSheet.Title className="text-xl font-bold text-foreground px-6 mb-5">
            Category
          </BottomSheet.Title>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 40 }}
          >
            <View className="flex-row flex-wrap">
              {ALL_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => {
                      onSelect(cat.id);
                      onOpenChange(false);
                    }}
                    className="w-1/4 items-center py-3 px-2"
                  >
                    <View
                      className={[
                        "w-14 h-14 rounded-full items-center justify-center",
                        isActive ? "bg-foreground" : "bg-card",
                      ].join(" ")}
                    >
                      <Text className="text-2xl leading-none">{cat.icon}</Text>
                    </View>
                    <Text
                      numberOfLines={1}
                      className={[
                        "text-xs mt-2 text-center",
                        isActive
                          ? "font-semibold text-foreground"
                          : "font-medium text-muted",
                      ].join(" ")}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
