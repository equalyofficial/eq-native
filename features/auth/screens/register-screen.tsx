import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCSSVariable } from "uniwind";

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
  email?: string;
  password?: string;
  form?: string;
};

export default function RegisterScreen() {
  const mutedColor = useCSSVariable("--color-muted");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});

  const register = useRegister({
    onSuccess() {
      setErrors({});
      router.replace("/(protected)/(tabs)");
    },
    onError(error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (isApiError(error)) {
        setErrors({
          fullName: error.fieldError("name"),
          email: error.fieldError("email"),
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

  function handleRegister() {
    const result = RegisterSchema.safeParse({
      name: fullName,
      email,
      password,
    });

    if (!result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        fullName: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
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
          label="Email Address"
          placeholder="example@mail.com"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email || errors.form) {
              setErrors((prev) => ({
                ...prev,
                email: undefined,
                form: undefined,
              }));
            }
          }}
          keyboardType="default"
          textContentType="emailAddress"
          autoComplete="email"
          error={errors.email}
          leftIcon={
            <Feather name="mail" size={18} color={String(mutedColor)} />
          }
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
          {/* <AuthSocialButton */}
          {/*   provider="apple" */}
          {/*   label="Sign in with Apple" */}
          {/*   onPress={() => console.log("Apple login")} */}
          {/* /> */}
        </View>
      </View>
    </AuthScreenShell>
  );
}

