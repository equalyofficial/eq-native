import { router } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

import { isApiError } from "@/lib/api-error";

import { useForgotPassword } from "../auth.hooks";
import { ForgotPasswordSchema } from "../auth.schemas";
import { AuthPrimaryButton } from "../components/auth-primary-button";
import { AuthScreenShell } from "../components/auth-screen-shell";
import { AuthTextField } from "../components/auth-text-field";
import { AuthModeToggle } from "../components/auth-mode-toggle";

type ForgotPasswordErrors = {
  phone?: string;
  email?: string;
  form?: string;
};

type AuthMode = "email" | "phone";

export function ForgotPasswordScreen() {
  const mutedColor = useCSSVariable("--color-muted") as string;
  const brandIndigo = useCSSVariable("--color-brand-indigo") as string;
  const bgColor = useCSSVariable("--color-background") as string;
  const [authMode, setAuthMode] = useState<AuthMode>("phone");
  const [identifier, setIdentifier] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const forgotPassword = useForgotPassword({
    onSuccess(result) {
      setErrors({});
      setSuccessMessage(result.message);
    },
    onError(error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSuccessMessage("");

      if (isApiError(error)) {
        setErrors({
          phone: error.fieldError("phone"),
          email: error.fieldError("email"),
          form: error.message,
        });
        return;
      }

      setErrors({
        form: "Unable to send reset instructions right now. Please try again.",
      });
    },
  });

  function handleSubmit() {
    const payload = {
      mode: authMode,
      [authMode]: identifier,
    };

    const result = ForgotPasswordSchema.safeParse(payload);

    if (!result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        phone: (fieldErrors as any).phone?.[0],
        email: (fieldErrors as any).email?.[0],
      });
      setSuccessMessage("");
      return;
    }

    setErrors({});
    setSuccessMessage("");
    forgotPassword.mutate(result.data);
  }

  return (
    <AuthScreenShell
      alignHeader="left"
      title={
        <Text className="text-5xl font-bold text-foreground text-left tracking-tight">
          Reset{"\n"}
          <Text className="text-accent">Password</Text>
        </Text>
      }
      description="Enter your details to receive a reset code."
      footer={
        <Pressable
          onPress={() => router.push("/login")}
          className="flex-row items-center gap-2"
        >
          <Feather name="arrow-left" size={16} color={brandIndigo} />
          <Text className="text-sm font-bold text-accent">Return to Login</Text>
        </Pressable>
      }
    >
      <View className="gap-6">
        <AuthModeToggle
          value={authMode}
          onChange={(val) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setAuthMode(val as AuthMode);
            setIdentifier("");
          }}
          options={[
            { value: "phone", label: "Mobile" },
            { value: "email", label: "Email" },
          ]}
        />

        <Animated.View
          key={authMode}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          <AuthTextField
            label={authMode === "phone" ? "PHONE NUMBER" : "EMAIL ADDRESS"}
            placeholder={
              authMode === "phone" ? "+91 70XXX XXX97" : "example@mail.com"
            }
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType={authMode === "phone" ? "number-pad" : "default"}
            autoCapitalize="none"
            textContentType={
              authMode === "phone" ? "telephoneNumber" : "emailAddress"
            }
            autoComplete={authMode === "phone" ? "tel" : "email"}
            returnKeyType="send"
            error={authMode === "phone" ? errors.phone : errors.email}
            leftIcon={
              <Feather
                name={authMode === "phone" ? "smartphone" : "mail"}
                size={18}
                color={mutedColor}
              />
            }
          />
        </Animated.View>

        {errors.form ? (
          <Text className="text-sm font-sans text-red-500">{errors.form}</Text>
        ) : null}
        {successMessage ? (
          <View className="rounded-2xl border border-border bg-card px-4 py-4">
            <Text className="text-sm font-sans leading-6 text-foreground">
              {successMessage}
            </Text>
          </View>
        ) : null}

        <AuthPrimaryButton
          label="Send Code"
          onPress={handleSubmit}
          isLoading={forgotPassword.isPending}
          rightIcon={<Feather name="arrow-right" size={20} color={bgColor} />}
        />
      </View>
    </AuthScreenShell>
  );
}
