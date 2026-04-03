import { router } from "expo-router";
import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

import { isApiError } from "@/lib/api-error";

import { useForgotPassword } from "../auth.hooks";
import { ForgotPasswordSchema } from "../auth.schemas";
import { AuthPrimaryButton } from "../components/auth-primary-button";
import { AuthScreenShell } from "../components/auth-screen-shell";
import { AuthTextField } from "../components/auth-text-field";

type ForgotPasswordErrors = {
  phone?: string;
  form?: string;
};

export function ForgotPasswordScreen() {
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  const forgotPassword = useForgotPassword({
    onSuccess(message) {
      setErrors({});
      setSuccessMessage(message);
    },
    onError(error) {
      setSuccessMessage("");

      if (isApiError(error)) {
        setErrors({
          phone: error.fieldError("phone"),
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
    const result = ForgotPasswordSchema.safeParse({ phone });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({ phone: fieldErrors.phone?.[0] });
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
        <Text className="text-6xl font-bold text-foreground text-left tracking-tight">
          Reset{"\n"}
          <Text className="text-indigo-400">Password</Text>
        </Text>
      }
      description="Enter your phone number to receive a reset code."
      footer={
        <Pressable
          onPress={() => router.push("/login")}
          className="flex-row items-center gap-2"
        >
          <Feather name="arrow-left" size={16} color="#A5B4FC" />
          <Text className="text-sm font-bold text-indigo-400">
            Return to Login
          </Text>
        </Pressable>
      }
    >
      <View className="gap-5">
        <AuthTextField
          label="PHONE NUMBER"
          placeholder="+91 70XXX XXX97"
          value={phone}
          onChangeText={setPhone}
          keyboardType="number-pad"
          autoCapitalize="none"
          textContentType="telephoneNumber"
          autoComplete="tel"
          returnKeyType="send"
          error={errors.phone}
          leftIcon={<Feather name="smartphone" size={18} color="#555" />}
        />

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
          rightIcon={<Feather name="arrow-right" size={20} color="#000" />}
        />
      </View>
    </AuthScreenShell>
  );
}
