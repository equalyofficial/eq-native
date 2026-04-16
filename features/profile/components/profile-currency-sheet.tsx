import { useEffect, useMemo, useState } from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Feather } from "@expo/vector-icons";
import {
  BottomSheet,
  Button,
  FieldError,
  useBottomSheetAwareHandlers,
} from "heroui-native";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffectiveColorScheme } from "@/hooks/use-effective-color-scheme";
import { useCSSVariable } from "uniwind";
import { demoCurrencies, type DemoCurrency } from "../profile.data";

type ProfileCurrencySheetProps = {
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
  value: string;
  onSave: (value: string) => void;
};

function CurrencyField({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  const { onFocus, onBlur } = useBottomSheetAwareHandlers();
  const colorScheme = useEffectiveColorScheme();
  const mutedColor = useCSSVariable("--color-muted");

  return (
    <View className="flex-row items-center rounded-2xl border border-border bg-background px-4">
      <Feather name="search" size={18} color={String(mutedColor)} />
      <TextInput
        placeholder="Enter currency code or symbol"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="search"
        keyboardAppearance={colorScheme === "dark" ? "dark" : "light"}
        placeholderTextColorClassName="accent-muted"
        className="flex-1 py-4 pl-3 text-base font-medium text-foreground"
      />
    </View>
  );
}

function CurrencyBadge({ currency }: { currency: DemoCurrency }) {
  return (
    <View className="h-12 w-12 shrink-0 items-center justify-center rounded-full bg-foreground">
      <Text className="text-sm font-bold text-background">
        {currency.symbol}
      </Text>
    </View>
  );
}

export function ProfileCurrencySheet({
  isOpen,
  onOpenChange,
  value,
  onSave,
}: ProfileCurrencySheetProps) {
  const insets = useSafeAreaInsets();
  const [draftValue, setDraftValue] = useState(value);
  const [searchValue, setSearchValue] = useState("");
  const [showError, setShowError] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const mutedColor = useCSSVariable("--color-muted") as string;
  const snapPoints = useMemo(
    () => (isKeyboardVisible ? ["90%"] : ["60%", "90%"]),
    [isKeyboardVisible],
  );

  const normalizedValue = useMemo(() => draftValue.trim(), [draftValue]);
  const normalizedSearchValue = useMemo(
    () => searchValue.trim().toLowerCase(),
    [searchValue],
  );
  const filteredCurrencies = useMemo(() => {
    if (!normalizedSearchValue) {
      return demoCurrencies;
    }

    return demoCurrencies.filter(
      (currency) =>
        currency.code.toLowerCase().includes(normalizedSearchValue) ||
        currency.label.toLowerCase().includes(normalizedSearchValue),
    );
  }, [normalizedSearchValue]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <BottomSheet
      isOpen={isOpen}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (nextOpen) {
          setDraftValue(value);
          setSearchValue("");
          setShowError(false);
        }
      }}
    >
      <BottomSheet.Portal>
        <BottomSheet.Overlay
          onPress={() => {
            Keyboard.dismiss();
            onOpenChange(false);
          }}
        />
        <BottomSheet.Content
          snapPoints={snapPoints}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          android_keyboardInputMode="adjustResize"
          backgroundClassName="rounded-t-[2rem] bg-card"
          contentContainerClassName="px-5 pt-3"
        >
          <Pressable className="flex-1" onPress={Keyboard.dismiss}>
            <View className="mb-5 gap-4">
              <View className="gap-2">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  Account Preference
                </Text>
                <BottomSheet.Title className="text-[1.55rem] font-bold tracking-tight">
                  Preferred Currency
                </BottomSheet.Title>
                <BottomSheet.Description className="text-sm leading-6 text-muted">
                  Search by code or currency name and choose the format used
                  across balances and settlements.
                </BottomSheet.Description>
              </View>

              <CurrencyField
                value={searchValue}
                onChangeText={(nextValue) => {
                  setSearchValue(nextValue);
                }}
              />

              <View className="flex-row items-center justify-between rounded-[1.1rem] bg-background px-4 py-3">
                <View>
                  <Text className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
                    Current Selection
                  </Text>
                  <Text className="mt-1 text-sm font-semibold text-foreground">
                    {normalizedValue || "No currency selected"}
                  </Text>
                </View>
                <Feather name="check-circle" size={18} color={mutedColor} />
              </View>

              {showError ? (
                <FieldError>Enter a valid preferred currency</FieldError>
              ) : null}
            </View>

            <View className="flex-1">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted">
                  Available Currencies
                </Text>
                <Text className="text-xs font-medium text-muted">
                  {filteredCurrencies.length} options
                </Text>
              </View>

              <BottomSheetScrollView
                className="flex-1"
                contentContainerClassName="gap-2 pb-4"
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="handled"
                onScrollBeginDrag={Keyboard.dismiss}
                showsVerticalScrollIndicator={false}
              >
                {filteredCurrencies.map((currency) => {
                  const selected = currency.code === draftValue.trim();

                  return (
                    <Pressable
                      key={currency.code}
                      onPress={() => {
                        Keyboard.dismiss();
                        setDraftValue(currency.code);
                        setShowError(false);
                      }}
                      className={[
                        "flex-row items-center justify-between rounded-[1.4rem] border px-4 py-3.5",
                        selected
                          ? "border-foreground bg-background"
                          : "border-border bg-background/70",
                      ].join(" ")}
                    >
                      <View className="flex-1 flex-row items-center gap-3 pr-4">
                        <CurrencyBadge currency={currency} />

                        <View className="flex-1">
                          <Text className="text-sm font-semibold text-foreground">
                            {currency.label}
                          </Text>
                          <Text className="mt-1 text-xs font-medium text-muted">
                            {currency.code}
                          </Text>
                        </View>
                      </View>

                       <View className="items-end gap-1">
                         <Text className="text-sm font-semibold text-foreground">
                           {currency.symbol}
                         </Text>
                         <Feather
                           name={selected ? "check" : "arrow-up-right"}
                           size={15}
                           color={String(mutedColor)}
                         />
                       </View>


                    </Pressable>
                  );
                })}

                {filteredCurrencies.length === 0 ? (
                  <View className="rounded-[1.3rem] border border-border bg-background px-4 py-4">
                    <Text className="text-sm font-medium text-foreground">
                      No matching currencies found
                    </Text>
                    <Text className="mt-1 text-sm text-muted">
                      Type a different code or select from the available demo
                      list.
                    </Text>
                  </View>
                ) : null}
              </BottomSheetScrollView>
            </View>

            <View
              className="gap-3 border-t border-border pt-4"
              style={{ paddingBottom: insets.bottom + 8 }}
            >
              <Button
                onPress={() => {
                  if (!normalizedValue) {
                    setShowError(true);
                    return;
                  }

                  onSave(normalizedValue);
                  setShowError(false);
                  onOpenChange(false);
                }}
              >
                Save Currency
              </Button>
              <Button variant="tertiary" onPress={() => onOpenChange(false)}>
                Cancel
              </Button>
            </View>
          </Pressable>
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}
