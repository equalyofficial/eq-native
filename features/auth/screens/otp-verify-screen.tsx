import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useCSSVariable } from "uniwind";

import { AppToast } from "@/lib/toast";
import { AuthScreenShell } from "../components/auth-screen-shell";
import { AuthPrimaryButton } from "../components/auth-primary-button";
import {
  useRegisterVerify,
  useLoginOtpVerify,
  useResendOtp,
} from "../auth.hooks";

const OTP_LENGTH = 6;

export function OtpVerifyScreen() {
  const params = useLocalSearchParams<{
    challenge_id: string;
    identifier?: string;
    purpose?: "register" | "login";
  }>();
  const mutedColor = useCSSVariable("--color-muted") as string;
  const brandIndigo = useCSSVariable("--color-brand-indigo") as string;

  const [challengeId, setChallengeId] = useState(params.challenge_id ?? "");
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);
  const isRegister = params.purpose !== "login";

  const onVerified = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/(protected)/(tabs)");
  };
  const onVerifyError = (error: { message?: string }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setCode("");
    AppToast.error(error.message ?? "Invalid or expired code. Try again.");
  };

  const registerVerify = useRegisterVerify({
    onSuccess: onVerified,
    onError: onVerifyError,
  });
  const loginVerify = useLoginOtpVerify({
    onSuccess: onVerified,
    onError: onVerifyError,
  });
  const resend = useResendOtp({
    onSuccess: (challenge) => {
      setChallengeId(challenge.challenge_id);
      AppToast.success("A new code has been sent.");
    },
    onError: (error) =>
      AppToast.error(error.message ?? "Couldn't resend the code."),
  });

  const isPending = registerVerify.isPending || loginVerify.isPending;

  const submit = (value: string) => {
    if (value.length !== OTP_LENGTH) return;
    const body = { challenge_id: challengeId, otp: value };
    if (isRegister) registerVerify.mutate(body);
    else loginVerify.mutate(body);
  };

  const handleChange = (text: string) => {
    const digits = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    setCode(digits);
    if (digits.length === OTP_LENGTH) submit(digits);
  };

  return (
    <AuthScreenShell
      alignHeader="left"
      title={
        <Text className="text-5xl font-bold tracking-tight text-foreground">
          Verify{"\n"}
          <Text className="text-accent">Code</Text>
        </Text>
      }
      description={
        params.identifier
          ? `Enter the 6-digit code we sent to ${params.identifier}.`
          : "Enter the 6-digit code we just sent you."
      }
      footer={
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-2"
        >
          <Feather name="arrow-left" size={16} color={brandIndigo} />
          <Text className="text-sm font-bold text-accent">Go back</Text>
        </Pressable>
      }
    >
      <View className="gap-6">
        <Pressable
          onPress={() => inputRef.current?.focus()}
          className="flex-row justify-between"
        >
          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
            const char = code[i] ?? "";
            const active = i === code.length;
            return (
              <View
                key={i}
                className={[
                  "h-14 w-12 items-center justify-center rounded-2xl border",
                  char || active ? "border-foreground" : "border-border",
                  "bg-card",
                ].join(" ")}
              >
                <Text className="text-2xl font-bold text-foreground">
                  {char}
                </Text>
              </View>
            );
          })}
        </Pressable>

        {/* Hidden input driving the cells */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={handleChange}
          keyboardType="number-pad"
          maxLength={OTP_LENGTH}
          autoFocus
          textContentType="oneTimeCode"
          style={{ position: "absolute", opacity: 0, height: 1, width: 1 }}
        />

        <AuthPrimaryButton
          label="Verify"
          onPress={() => submit(code)}
          isLoading={isPending}
        />

        <Pressable
          onPress={() => resend.mutate({ challenge_id: challengeId })}
          disabled={resend.isPending}
          className="items-center"
        >
          <Text className="text-sm font-semibold text-muted">
            Didn't get it?{" "}
            <Text className="text-accent">
              {resend.isPending ? "Sending…" : "Resend code"}
            </Text>
          </Text>
        </Pressable>
      </View>
    </AuthScreenShell>
  );
}
