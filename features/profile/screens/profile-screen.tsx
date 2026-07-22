import { useState, useCallback } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ProfileIdentityCard } from "../components/profile-identity-card";
import { ProfileCurrencySheet } from "../components/profile-currency-sheet";
import { ProfileLogoutSheet } from "../components/profile-logout-sheet";
import { ProfileSettingRow } from "../components/profile-setting-row";
import { ProfileThemeSelector } from "../components/profile-theme-selector";
import { profilePreferences, profileUser } from "../profile.data";
import { useAuthStore } from "@/store/use-auth-store";
import { useLogout } from "@/features/auth";

export default function ProfileScreen() {
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const user = useAuthStore((state) => state.user);

  // Real identity from the session; UPI (not yet bound to an endpoint) falls
  // back to mock for now.
  const displayUser = {
    name: user?.name ?? profileUser.name,
    phone: user?.phone ?? "",
    email: user?.email ?? "",
    avatar: user?.avatar_url ?? "",
    upiId: profileUser.upiId,
  };
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profilePreferences.notificationsEnabled,
  );
  const [preferredCurrency, setPreferredCurrency] = useState(
    profilePreferences.preferredCurrency,
  );
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isCurrencySheetOpen, setIsCurrencySheetOpen] = useState(false);

  const handleToggleNotifications = useCallback((value: boolean) => {
    setNotificationsEnabled(value);
  }, []);

  const handleOpenCurrencySheet = useCallback(() => {
    setIsCurrencySheetOpen(true);
  }, []);

  const handleOpenLogoutSheet = useCallback(() => {
    setIsLogoutSheetOpen(true);
  }, []);

  const goToAuth = useCallback(() => {
    setIsLogoutSheetOpen(false);
    router.replace("/login");
  }, []);

  const { mutate: logout, isPending: isLoggingOut } = useLogout({
    // useLogout already clears tokens + query cache on success.
    onSuccess: goToAuth,
    // Even if the server call fails (expired token, offline), log out locally.
    onError: () => {
      clearTokens();
      goToAuth();
    },
  });

  const handleLogout = useCallback(() => {
    if (refreshToken) {
      logout({ refresh_token: refreshToken });
    } else {
      clearTokens();
      goToAuth();
    }
  }, [refreshToken, logout, clearTokens, goToAuth]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-5 pb-36"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4">
            <View>
              <Text className="text-4xl font-bold tracking-tight text-foreground">
                Profile
              </Text>
            </View>

            <ProfileIdentityCard user={displayUser} />

            <View>
              <ProfileThemeSelector />
            </View>

            <View>
              <ProfileSettingRow
                icon="bell"
                label="Notifications"
                separated
                toggle={{
                  value: notificationsEnabled,
                  onValueChange: handleToggleNotifications,
                }}
              />

              <ProfileSettingRow
                icon="dollar-sign"
                label="Preferred Currency"
                value={preferredCurrency}
                separated
                onPress={handleOpenCurrencySheet}
              />

              <ProfileSettingRow
                icon="shield"
                label="Privacy"
                separated
                onPress={() => {}}
              />

              <ProfileSettingRow
                icon="file-text"
                label="Terms & Conditions"
                separated
                onPress={() => {}}
              />

              <ProfileSettingRow
                icon="help-circle"
                label="Help & Support"
                separated
                onPress={() => {}}
              />

              <ProfileSettingRow
                icon="log-out"
                label="Logout"
                separated
                variant="destructive"
                onPress={handleOpenLogoutSheet}
              />
            </View>
          </View>
        </ScrollView>

        <ProfileCurrencySheet
          value={preferredCurrency}
          onSave={setPreferredCurrency}
          isOpen={isCurrencySheetOpen}
          onOpenChange={setIsCurrencySheetOpen}
        />
        <ProfileLogoutSheet
          isOpen={isLogoutSheetOpen}
          onOpenChange={setIsLogoutSheetOpen}
          onLogout={handleLogout}
          isLoading={isLoggingOut}
        />
      </View>
    </SafeAreaView>
  );
}
