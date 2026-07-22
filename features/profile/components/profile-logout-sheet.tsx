import { Feather } from "@expo/vector-icons";
import { BottomSheet, Button } from "heroui-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ProfileLogoutSheetProps = {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onLogout: () => void;
  isLoading?: boolean;
};

export function ProfileLogoutSheet({
  isOpen,
  onOpenChange,
  onLogout,
  isLoading = false,
}: ProfileLogoutSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          detached
          bottomInset={insets.bottom + 12}
          className="mx-4"
          backgroundClassName="rounded-4xl bg-card"
        >
          <View className="mb-6">
            <BottomSheet.Title className="text-left">Logout</BottomSheet.Title>
            <BottomSheet.Description className="mt-2 text-left">
              We'll miss you! You'll be returned to the authentication flow.
            </BottomSheet.Description>
          </View>

          <View className="gap-3">
            <Button
              variant="danger"
              onPress={onLogout}
              isDisabled={isLoading}
            >
              {isLoading ? "Logging out…" : "Logout"}
            </Button>
            <Button
              variant="tertiary"
              onPress={() => onOpenChange(false)}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
