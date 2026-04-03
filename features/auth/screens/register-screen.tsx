import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { AuthScreenShell } from "@/features/auth/components/auth-screen-shell";
import { AuthTextField } from "@/features/auth/components/auth-text-field";
import { AuthPrimaryButton } from "@/features/auth/components/auth-primary-button";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthSocialButton } from "@/features/auth/components/auth-social-button";
import { AuthInlineLink } from "@/features/auth/components/auth-inline-link";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthScreenShell
      alignHeader="left"
      title={
        <Text className="text-6xl font-bold tracking-tight text-foreground">
          Create{"\n"}
          <Text className="text-indigo-400">Account</Text>
        </Text>
      }
      description="Start splitting expenses with clarity."
      footer={
        <AuthInlineLink
          prompt="Already have an account?"
          actionLabel="Login"
          onPress={() => router.push("/login")}
        />
      }
    >
      <View className="gap-6">
        <AuthTextField
          label="Full Name"
          placeholder="Enter your name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
        />

        <AuthTextField
          label="Phone Number"
          placeholder="+91 00000 00000"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
        />

        <AuthTextField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
        />

        <AuthPrimaryButton
          label="Register"
          onPress={() => console.log("Registering...")}
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
