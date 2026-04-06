import { Feather } from "@expo/vector-icons";
import { BottomSheet, Button } from "heroui-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ProfileLogoutSheetProps = {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  onLogout: () => void;
};

export function ProfileLogoutSheet({
  isOpen,
  onOpenChange,
  onLogout,
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
          <View className="mb-6 items-center">
            <BottomSheet.Title className="text-left">Logout</BottomSheet.Title>
            <BottomSheet.Description className="mt-2 text-left">
              You’ll be returned to the authentication flow and need to sign in
              again.
            </BottomSheet.Description>
          </View>

          <View className="gap-3">
            <Button variant="danger" onPress={onLogout}>
              Logout
            </Button>
            <Button variant="tertiary" onPress={() => onOpenChange(false)}>
              Cancel
            </Button>
          </View>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
