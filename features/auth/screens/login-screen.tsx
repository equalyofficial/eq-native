import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { AuthScreenShell } from "@/features/auth/components/auth-screen-shell";
import { AuthTextField } from "@/features/auth/components/auth-text-field";
import { AuthPrimaryButton } from "@/features/auth/components/auth-primary-button";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthSocialButton } from "@/features/auth/components/auth-social-button";
import { AuthInlineLink } from "@/features/auth/components/auth-inline-link";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

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
      // bottomLabel="Simplicity is the ultimate sophistication."
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
          label="Phone Number"
          placeholder="+91 98765 43210"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          rightIcon={<Feather name="smartphone" size={18} color="#555" />}
        />

        <AuthTextField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
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
          onPress={() => console.log("Logging in...")}
        />

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
