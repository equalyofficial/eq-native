import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { AuthScreenShell } from "@/features/auth/components/auth-screen-shell";
import { AuthTextField } from "@/features/auth/components/auth-text-field";
import { AuthPrimaryButton } from "@/features/auth/components/auth-primary-button";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthSocialButton } from "@/features/auth/components/auth-social-button";
import { AuthInlineLink } from "@/features/auth/components/auth-inline-link";
import { useThemeColor } from "@/hooks/use-theme-color";
import { LoginSchema } from "../auth.schemas";

export default function LoginScreen() {
  const mutedColor = useThemeColor({}, "muted");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>(
    {},
  );

  function handleLogin() {
    const result = LoginSchema.safeParse({ phone, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors = {
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
      };
      setErrors(newErrors);

      return;
    }

    setErrors({});
    router.replace("/(protected)/(tabs)");
  }

  return (
    <AuthScreenShell
      alignHeader="left"
      title={
        <Text className="text-6xl font-bold tracking-tight text-foreground">
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
        <AuthTextField
          label="Phone Number *"
          placeholder="+91 98765 43210"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (errors.phone)
              setErrors((prev) => ({ ...prev, phone: undefined }));
          }}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          error={errors.phone}
          rightIcon={<Feather name="smartphone" size={18} color={mutedColor} />}
        />

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

        <AuthPrimaryButton label="Login" onPress={handleLogin} />

        <AuthDivider />

        <View className="gap-3">
          <AuthSocialButton
            provider="google"
            label="Login with Google"
            onPress={() => console.log("Google login")}
          />
          <AuthSocialButton
            provider="apple"
            label="Sign in with Apple"
            onPress={() => console.log("Apple login")}
          />
        </View>
      </View>
    </AuthScreenShell>
  );
}
