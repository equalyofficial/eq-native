// features/auth/components/auth-text-field.tsx

import { useState, type ReactNode } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";

type AuthTextFieldProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "number-pad" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  textContentType?:
    | "none"
    | "name"
    | "telephoneNumber"
    | "password"
    | "username"
    | "newPassword";
  secureTextEntry?: boolean;
  autoComplete?:
    | "name"
    | "off"
    | "password"
    | "tel"
    | "username"
    | "new-password";
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
  const colorScheme = useEffectiveColorScheme();

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-[11px] font-bold tracking-widest text-muted uppercase">
          {label}
        </Text>
        {labelRight}
      </View>

      <View
        className={[
          "min-h-14 flex-row items-center rounded-2xl bg-card px-4",
          error ? "border border-red-500" : "border border-border",
        ].join(" ")}
      >
        {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}

        <TextInput
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
          keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
          className="flex-1 py-4 text-base font-sans text-foreground"
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setIsSecure((current) => !current)}
            className="pl-3 py-2"
          >
            <Feather
              name={isSecure ? "eye-off" : "eye"}
              size={18}
              color={colorScheme === "dark" ? "#6b6b6b" : "#8e8e8e"}
            />
          </Pressable>
        ) : rightIcon ? (
          <View className="pl-3">{rightIcon}</View>
        ) : null}
      </View>

      {error ? <Text className="text-sm font-sans text-red-500">{error}</Text> : null}
    </View>
  );
}
