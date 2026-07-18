import { forwardRef } from "react";
import { TextInput, type TextInputProps } from "react-native";

export const AppTextInput = forwardRef<TextInput, TextInputProps>(
  function AppTextInput({ className, style, ...props }, ref) {
    return (
      <TextInput
        ref={ref}
        style={[
          { fontSize: 16, textAlignVertical: "center", includeFontPadding: false },
          style,
        ]}
        className={["font-sans text-foreground", className]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />
    );
  },
);
