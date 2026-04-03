// features/auth/components/auth-inline-link.tsx
// import type { ReactNode } from "react";
// import { Text, View } from "react-native";
//
// type AuthInlineLinkProps = {
//   prompt: string;
//   actionLabel: string;
//   onPress: () => void;
//   align?: "left" | "center";
//   extra?: ReactNode;
// };
//
// export function AuthInlineLink({
//   prompt,
//   actionLabel,
//   onPress,
//   align = "center",
//   extra,
// }: AuthInlineLinkProps) {
//   return (
//     <View
//       className={
//         align === "center" ? "items-center gap-3" : "items-start gap-3"
//       }
//     >
//       <Text className="text-sm leading-6 text-muted">
//         {prompt}{" "}
//         <Text
//           onPress={onPress}
//           className="font-semibold text-foreground underline"
//         >
//           {actionLabel}
//         </Text>
//       </Text>
//       {extra}
//     </View>
//   );
// }

import type { ReactNode } from "react";
import { Text, View } from "react-native";

type AuthInlineLinkProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

export function AuthInlineLink({
  prompt,
  actionLabel,
  onPress,
}: AuthInlineLinkProps) {
  return (
    <View className="items-center gap-3">
      <Text className="text-sm font-sans text-muted">
        {prompt}{" "}
        <Text onPress={onPress} className="font-semibold text-indigo-400">
          {actionLabel}
        </Text>
      </Text>
    </View>
  );
}
