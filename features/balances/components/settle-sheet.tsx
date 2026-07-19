import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import { BottomSheet } from "heroui-native";
import * as Haptics from "expo-haptics";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AppTextInput } from "@/components/ui/app-text-input";
import { AppToast } from "@/lib/toast";
import type { SettleTarget } from "../balances.data";

type PaymentApp = {
  id: string;
  label: string;
  color: string;
  initial: string;
};

const APPS: PaymentApp[] = [
  { id: "gpay", label: "GPay", color: "#1A73E8", initial: "G" },
  { id: "phonepe", label: "PhonePe", color: "#5F259F", initial: "Pe" },
  { id: "paytm", label: "Paytm", color: "#00BAF2", initial: "P" },
  { id: "mobikwik", label: "MobiKwik", color: "#2D3092", initial: "M" },
  { id: "amazonpay", label: "Amazon", color: "#FF9900", initial: "a" },
  { id: "bhim", label: "BHIM", color: "#097939", initial: "B" },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function PaymentAppTile({
  app,
  onPress,
}: {
  app: PaymentApp;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 15, stiffness: 220 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 13, stiffness: 180 });
      }}
      onPress={onPress}
      style={animStyle}
      className="w-16 items-center gap-2"
    >
      <View
        className="h-14 w-14 items-center justify-center rounded-2xl border-continuous"
        style={{ backgroundColor: app.color }}
      >
        <Text className="text-lg font-bold text-white">{app.initial}</Text>
      </View>
      <Text className="text-[10px] font-medium text-muted" numberOfLines={1}>
        {app.label}
      </Text>
    </AnimatedPressable>
  );
}

function RecipientOption({
  target,
  selected,
  onPress,
}: {
  target: SettleTarget;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={[
        "flex-row items-center gap-3 rounded-2xl border px-3 py-2.5",
        selected ? "border-accent bg-accent/10" : "border-border bg-background",
      ].join(" ")}
    >
      <Image source={{ uri: target.avatar }} className="h-10 w-10 rounded-full" />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">
          {target.name}
        </Text>
        {target.upiId && (
          <Text className="text-xs text-muted">{target.upiId}</Text>
        )}
      </View>
      <Text className="mr-2 text-sm font-semibold text-muted">
        ₹{target.amount.toLocaleString("en-IN")}
      </Text>
      <View
        className={[
          "h-5 w-5 items-center justify-center rounded-full border",
          selected ? "border-accent bg-accent" : "border-border",
        ].join(" ")}
      >
        {selected && <Feather name="check" size={12} color="#ffffff" />}
      </View>
    </Pressable>
  );
}

export type SettleSheetProps = {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  targets: SettleTarget[];
  onConfirm?: (targetId: string, method: string, amount: number) => void;
};

export function SettleSheet({
  isOpen,
  onOpenChange,
  targets,
  onConfirm,
}: SettleSheetProps) {
  const insets = useSafeAreaInsets();
  const singleTarget = targets.length === 1;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("0");

  useEffect(() => {
    if (!isOpen) return;
    const initial = singleTarget ? targets[0]?.id ?? null : null;
    setSelectedId(initial);
    setPicking(!singleTarget);
    setValue(initial ? String(targets[0].amount) : "0");
    setEditing(false);
  }, [isOpen]);

  const selected = targets.find((t) => t.id === selectedId);
  const numeric = Math.max(0, parseFloat(value.replace(/,/g, "")) || 0);
  const formatted = numeric.toLocaleString("en-IN");
  const upiLink = selected
    ? `upi://pay?pa=${selected.upiId ?? "user@upi"}&pn=${encodeURIComponent(
        selected.name,
      )}&am=${numeric}&cu=INR`
    : "";

  function pick(target: SettleTarget) {
    Haptics.selectionAsync();
    setSelectedId(target.id);
    setValue(String(target.amount));
    setEditing(false);
    setPicking(false);
  }

  function settleAndToast(targetId: string, method: string, message: string) {
    onConfirm?.(targetId, method, numeric);
    onOpenChange(false);
    setTimeout(() => AppToast.success(message), 320);
  }

  function payWithApp(app: PaymentApp) {
    if (!selected) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    settleAndToast(selected.id, app.id, `Paid ₹${formatted} via ${app.label}`);
  }

  function markPaid() {
    if (!selected) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    settleAndToast(selected.id, "manual", `Marked ₹${formatted} as paid`);
  }

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={onOpenChange}>
      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          detached
          bottomInset={insets.bottom + 12}
          className="mx-4"
          backgroundClassName="rounded-4xl bg-card"
        >
          <View className="flex-row items-center justify-between">
            <BottomSheet.Title className="text-left text-2xl font-bold">
              Settle Up
            </BottomSheet.Title>
            <Pressable
              onPress={() => onOpenChange(false)}
              hitSlop={10}
              className="h-9 w-9 items-center justify-center rounded-full bg-background"
            >
              <Feather name="x" size={18} color="#a1a1aa" />
            </Pressable>
          </View>

          {picking ? (
            <View className="mt-5">
              <Text className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Who are you paying?
              </Text>
              <View className="mt-3 gap-2">
                {targets.map((target) => (
                  <RecipientOption
                    key={target.id}
                    target={target}
                    selected={target.id === selectedId}
                    onPress={() => pick(target)}
                  />
                ))}
              </View>
            </View>
          ) : selected ? (
            <>
              <View className="mt-6 items-center">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                  Total to Pay
                </Text>
                {editing ? (
                  <View className="mt-2 flex-row items-center">
                    <Text className="text-4xl font-bold text-foreground">₹</Text>
                    <AppTextInput
                      autoFocus
                      keyboardType="numeric"
                      value={value}
                      onChangeText={setValue}
                      onBlur={() => setEditing(false)}
                      className="text-4xl font-bold text-foreground"
                      style={{ minWidth: 120 }}
                    />
                  </View>
                ) : (
                  <Pressable
                    onPress={() => setEditing(true)}
                    className="mt-2 flex-row items-center gap-2"
                  >
                    <Text className="text-5xl font-bold tracking-tight text-foreground">
                      ₹{formatted}
                    </Text>
                    <Feather name="edit-2" size={16} color="#71717a" />
                  </Pressable>
                )}
              </View>

              <Pressable
                onPress={() => {
                  if (targets.length > 1) {
                    Haptics.selectionAsync();
                    setPicking(true);
                  }
                }}
                className="mt-6 flex-row items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 active:opacity-80"
              >
                <Image
                  source={{ uri: selected.avatar }}
                  className="h-12 w-12 rounded-full"
                />
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {selected.name}
                  </Text>
                  {selected.upiId && (
                    <Text className="mt-0.5 text-xs text-muted">
                      {selected.upiId}
                    </Text>
                  )}
                </View>
                {targets.length > 1 ? (
                  <View className="flex-row items-center gap-1 rounded-full bg-card px-3 py-1.5">
                    <Text className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                      Change
                    </Text>
                    <Feather name="chevron-down" size={13} color="#a1a1aa" />
                  </View>
                ) : (
                  <View className="rounded-full bg-success/15 px-3 py-1.5">
                    <Text className="text-[10px] font-semibold uppercase tracking-wide text-success">
                      Recipient
                    </Text>
                  </View>
                )}
              </Pressable>

              <View className="mt-6 items-center">
                <View className="rounded-3xl bg-white p-4 border-continuous">
                  <QRCode value={upiLink} size={132} />
                </View>
                <Text className="mt-3 text-xs text-muted">
                  Scan to pay via any UPI app
                </Text>
              </View>

              <Text className="mt-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                Or pay with an app
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingVertical: 12 }}
              >
                {APPS.map((app) => (
                  <PaymentAppTile
                    key={app.id}
                    app={app}
                    onPress={() => payWithApp(app)}
                  />
                ))}
              </ScrollView>

              <Pressable onPress={markPaid} className="mt-2 items-center py-2">
                <Text className="text-sm font-semibold text-muted">
                  Mark as already paid
                </Text>
              </Pressable>
            </>
          ) : (
            <View className="items-center py-8">
              <Text className="text-sm text-muted">
                Select who you want to settle with
              </Text>
            </View>
          )}
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
