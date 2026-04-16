// features/auth/components/auth-screen-shell.tsx

import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledSafeAreaView = withUniwind(SafeAreaView);

type AuthScreenShellProps = PropsWithChildren<{
  title: ReactNode | string;
  description: string;
  footer?: ReactNode;
  bottomLabel?: string;
  alignHeader?: "center" | "left";
}>;

export function AuthScreenShell({
  title,
  description,
  footer,
  bottomLabel,
  alignHeader = "center",
  children,
}: AuthScreenShellProps) {
  return (
    <StyledSafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="flex-grow px-6 pt-12 pb-8 justify-between"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View>
              <View
                className={[
                   "mb-6 gap-2",
                  alignHeader === "center" ? "items-center" : "items-start",
                ].join(" ")}
              >
                {typeof title === "string" ? (
                  <Text
                    className={[
                      "text-4xl font-bold text-foreground",
                      alignHeader === "center" ? "text-center" : "text-left",
                    ].join(" ")}
                  >
                    {title}
                  </Text>
                ) : (
                  title
                )}
                <Text
                  className={[
                    "text-sm font-sans text-muted mt-1",
                    alignHeader === "center" ? "text-center" : "text-left",
                  ].join(" ")}
                >
                  {description}
                </Text>
              </View>

              {children}
            </View>

            <View className="mt-8 gap-8 items-center">
              {footer}

              {bottomLabel && (
                <View className="items-center gap-3">
                  <View className="h-1 w-8 rounded-full bg-border" />
                  <Text className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                    {bottomLabel}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </StyledSafeAreaView>
  );
}
