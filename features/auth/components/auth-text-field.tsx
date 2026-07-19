// features/auth/components/auth-text-field.tsx

import { useState, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";
import { useCSSVariable } from "uniwind";
import { AppTextInput } from "@/components/ui/app-text-input";

type AuthTextFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "number-pad" | "phone-pad" | "email-address";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  textContentType?:
    | "none"
    | "name"
    | "telephoneNumber"
    | "password"
    | "username"
    | "newPassword"
    | "emailAddress";
  secureTextEntry?: boolean;
  autoComplete?:
    | "name"
    | "off"
    | "password"
    | "tel"
    | "username"
    | "new-password"
    | "email";
  returnKeyType?: "done" | "next" | "go" | "send";
  error?: string;
  labelRight?: ReactNode;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
};

export function AuthTextField({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "none",
  textContentType = "none",
  secureTextEntry = false,
  autoComplete = "off",
  returnKeyType = "done",
  error,
  labelRight,
  rightIcon,
  leftIcon,
}: AuthTextFieldProps) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);
  const colorScheme = useEffectiveColorScheme();
  
  const [accentVar, borderVar, mutedVar, errorVar] = useCSSVariable([
    "--color-accent",
    "--color-border",
    "--color-muted",
    "--color-error",
  ]);

  const accentColor = accentVar as string;
  const borderColor = borderVar as string;
  const mutedColor = mutedVar as string;
  const errorColor = errorVar as string;

  const rightIconColor = error ? errorColor : isFocused ? accentColor : mutedColor;
  const fieldBorderColor = error ? errorColor : isFocused ? accentColor : borderColor;

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold tracking-[0.18em] text-muted uppercase">
          {label}
        </Text>
        {labelRight}
      </View>

      <View
        className="min-h-14 flex-row items-center rounded-2xl bg-card px-4"
        style={{ borderWidth: 1, borderColor: fieldBorderColor }}
      >
        {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}

        <AppTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColorClassName="accent-muted"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          autoComplete={autoComplete}
          secureTextEntry={isSecure}
          returnKeyType={returnKeyType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
          className="flex-1"
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setIsSecure((current) => !current)}
            className="pl-3 py-2"
          >
            <Feather
              name={isSecure ? "eye-off" : "eye"}
              size={18}
              color={rightIconColor}
            />
          </Pressable>
        ) : rightIcon ? (
          <View className="pl-3" style={{ opacity: isFocused ? 1 : 0.9 }}>
            {rightIcon}
          </View>
        ) : null}
      </View>

      {error ? <Text className="text-sm font-sans text-red-500">{error}</Text> : null}
    </View>
  );
}
