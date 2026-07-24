import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCSSVariable } from "uniwind";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { AuthScreenShell } from "@/features/auth/components/auth-screen-shell";
import { AuthTextField } from "@/features/auth/components/auth-text-field";
import { AuthPrimaryButton } from "@/features/auth/components/auth-primary-button";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthSocialButton } from "@/features/auth/components/auth-social-button";
import { AuthInlineLink } from "@/features/auth/components/auth-inline-link";
import { AuthModeToggle } from "../components/auth-mode-toggle";
import { LoginSchema } from "../auth.schemas";
import { useLogin } from "../auth.hooks";
import { useGoogleAuth } from "../use-google-auth";
import { AppToast } from "@/lib/toast";

type AuthMode = "email" | "phone";

export default function LoginScreen() {
  const mutedColor = useCSSVariable("--color-muted") as string;
  const [authMode, setAuthMode] = useState<AuthMode>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    phone?: string;
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const { mutate: login, isPending } = useLogin({
    onSuccess: () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(protected)/(tabs)");
    },
    onError: (error) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      AppToast.error(error.message ?? "Unable to log in. Please try again.");
    },
  });

  const { signIn: signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth(
    () => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(protected)/(tabs)");
    },
  );

  function handleLogin() {
    const payload = {
      mode: authMode,
      [authMode]: identifier.trim(),
      password,
    };

    const result = LoginSchema.safeParse(payload);

    if (!result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const fieldErrors = result.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >;
      setErrors({
        phone: fieldErrors.phone?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    login(
      authMode === "email"
        ? { email: identifier.trim(), password }
        : { phone: identifier.trim(), password },
    );
  }

  return (
    <AuthScreenShell
      alignHeader="left"
      title={
        <Text className="text-5xl font-bold tracking-tight text-foreground">
          Welcome{"\n"}
          <Text className="text-accent">Back</Text>
        </Text>
      }
      description="The premium ledger for modern collective living."
      footer={
        <AuthInlineLink
          prompt="Don't have an account?"
          actionLabel="Register"
          onPress={() => router.push("/register")}
        />
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
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone" },
          ]}
        />

        <Animated.View
          key={authMode}
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          <AuthTextField
            label={authMode === "email" ? "EMAIL ADDRESS *" : "PHONE NUMBER *"}
            placeholder={
              authMode === "email" ? "example@mail.com" : "9876543210"
            }
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              if (errors.phone || errors.email)
                setErrors((prev) => ({
                  ...prev,
                  phone: undefined,
                  email: undefined,
                }));
            }}
            keyboardType={authMode === "email" ? "default" : "phone-pad"}
            textContentType={
              authMode === "email" ? "emailAddress" : "telephoneNumber"
            }
            autoComplete={authMode === "email" ? "email" : "tel"}
            error={authMode === "email" ? errors.email : errors.phone}
            rightIcon={
              <Feather
                name={authMode === "email" ? "mail" : "smartphone"}
                size={18}
                color={mutedColor}
              />
            }
          />
        </Animated.View>

        <AuthTextField
          label="Password *"
          placeholder="••••••••"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password)
              setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          secureTextEntry
          textContentType="password"
          error={errors.password}
          labelRight={
            <Pressable onPress={() => router.push("/forgot-password")}>
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Forgot Password?
              </Text>
            </Pressable>
          }
        />

        <AuthPrimaryButton
          label="Login"
          onPress={handleLogin}
          isLoading={isPending}
        />

        <AuthDivider />

        <View className="gap-3">
          <AuthSocialButton
            provider="google"
            label={isGoogleLoading ? "Connecting…" : "Login with Google"}
            onPress={signInWithGoogle}
            disabled={isGoogleLoading}
          />
        </View>
      </View>
    </AuthScreenShell>
  );
}
