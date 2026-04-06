import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

import { isApiError } from "@/lib/api-error";
import { AuthScreenShell } from "@/features/auth/components/auth-screen-shell";
import { AuthTextField } from "@/features/auth/components/auth-text-field";
import { AuthPrimaryButton } from "@/features/auth/components/auth-primary-button";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthSocialButton } from "@/features/auth/components/auth-social-button";
import { AuthInlineLink } from "@/features/auth/components/auth-inline-link";
import { useRegister } from "../auth.hooks";
import { RegisterSchema } from "../auth.schemas";

type RegisterErrors = {
  fullName?: string;
  phone?: string;
  password?: string;
  form?: string;
};

export default function RegisterScreen() {
  const register = useRegister({
    onSuccess() {
      setErrors({});
      router.replace("/(protected)/(tabs)");
    },
    onError(error) {
      if (isApiError(error)) {
        setErrors({
          fullName: error.fieldError("name"),
          phone: error.fieldError("phone"),
          password: error.fieldError("password"),
          form: error.message,
        });
        return;
      }

      setErrors({
        form: "Unable to create your account right now. Please try again.",
      });
    },
  });
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});

  function handleRegister() {
    const result = RegisterSchema.safeParse({
      name: fullName,
      phone,
      password,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        fullName: fieldErrors.name?.[0],
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    register.mutate(result.data);
  }

  return (
    <AuthScreenShell
      alignHeader="left"
      title={
        <Text className="text-6xl font-bold tracking-tight text-foreground">
          Create{"\n"}
          <Text className="text-accent">Account</Text>
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
          onChangeText={(text) => {
            setFullName(text);
            if (errors.fullName || errors.form) {
              setErrors((prev) => ({
                ...prev,
                fullName: undefined,
                form: undefined,
              }));
            }
          }}
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          error={errors.fullName}
        />

        <AuthTextField
          label="Phone Number"
          placeholder="+91 00000 00000"
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
            if (errors.phone || errors.form) {
              setErrors((prev) => ({
                ...prev,
                phone: undefined,
                form: undefined,
              }));
            }
          }}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          error={errors.phone}
        />

        <AuthTextField
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password || errors.form) {
              setErrors((prev) => ({
                ...prev,
                password: undefined,
                form: undefined,
              }));
            }
          }}
          secureTextEntry
          textContentType="newPassword"
          error={errors.password}
        />

        {errors.form ? (
          <Text className="text-sm font-sans text-red-500">{errors.form}</Text>
        ) : null}

        <AuthPrimaryButton
          label="Register"
          onPress={handleRegister}
          isLoading={register.isPending}
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
