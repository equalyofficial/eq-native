import { Feather } from "@expo/vector-icons";
import { BottomSheet } from "heroui-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Pressable, Text, View } from "react-native";
import { useCSSVariable } from "uniwind";
import { MemberSelectGrid } from "./member-select-grid";
import { useSheetAnimation } from "@/hooks/use-sheet-animation";
import type { MockMember } from "../../slice-flow.data";

interface MemberSelectSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  members: MockMember[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onInvite?: () => void;
}

export function MemberSelectSheet({
  isOpen,
  onOpenChange,
  title,
  members,
  selectedIds,
  onToggle,
  onInvite,
}: MemberSelectSheetProps) {
  const fgColor = String(useCSSVariable("--color-foreground") ?? "#000");
  const animationConfigs = useSheetAnimation();

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay className="bg-black/40" />
        <BottomSheet.Content
          snapPoints={["78%"]}
          animationConfigs={animationConfigs}
          enableOverDrag={false}
          enableDynamicSizing={false}
          backgroundClassName="rounded-t-3xl bg-background"
          contentContainerClassName="pt-3 pb-0 h-full"
        >
          <View className="flex-row items-center justify-between px-6 pb-4">
            <BottomSheet.Title className="text-xl font-bold text-foreground">
              {title}
            </BottomSheet.Title>
            <Pressable
              onPress={() => onOpenChange(false)}
              className="h-9 w-9 items-center justify-center rounded-full bg-card active:opacity-70"
            >
              <Feather name="x" size={18} color={fgColor} />
            </Pressable>
          </View>

          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 120 }}
          >
            <MemberSelectGrid
              members={members}
              selectedIds={selectedIds}
              onToggle={onToggle}
              onInvite={onInvite}
            />
          </BottomSheetScrollView>

          <View className="absolute bottom-0 left-0 right-0 bg-background px-5 pb-10 pt-4">
            <Pressable
              onPress={() => onOpenChange(false)}
              disabled={selectedIds.length === 0}
              className={
                selectedIds.length > 0
                  ? "items-center rounded-full bg-foreground py-3.5 active:opacity-80"
                  : "items-center rounded-full bg-foreground/30 py-3.5"
              }
            >
              <Text className="text-base font-semibold text-background">
                {selectedIds.length > 0
                  ? `Done · ${selectedIds.length} selected`
                  : "Select members"}
              </Text>
            </Pressable>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
