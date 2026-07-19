import { useMemo, useState } from "react";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image, Pressable, Text, View } from "react-native";
import { AppTextInput } from "@/components/ui/app-text-input";
import type { MockMember } from "../../slice-flow.data";

function MemberTile({
  member,
  selected,
  onPress,
}: {
  member: MockMember;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-1/3 items-center px-1 py-3 active:opacity-80"
    >
      <View
        className={[
          "h-16 w-16 overflow-hidden rounded-full border-2",
          selected ? "border-brand-gold" : "border-transparent opacity-40",
        ].join(" ")}
      >
        <Image source={{ uri: member.avatarUrl }} className="h-full w-full" />
      </View>
      {selected && (
        <View className="absolute right-4 top-2 h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-accent">
          <Feather name="check" size={11} color="#ffffff" />
        </View>
      )}
      <Text
        numberOfLines={1}
        className={[
          "mt-2 text-[11px] font-semibold uppercase tracking-[0.08em]",
          selected ? "text-foreground" : "text-muted",
        ].join(" ")}
      >
        {member.name.split(" ")[0]}
      </Text>
    </Pressable>
  );
}

export function MemberSelectGrid({
  members,
  selectedIds,
  onToggle,
  onInvite,
}: {
  members: MockMember[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onInvite?: () => void;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () => members.filter((m) => m.name.toLowerCase().includes(q)),
    [members, q],
  );

  return (
    <View className="gap-3">
      <View className="h-11 flex-row items-center gap-2.5 rounded-full bg-card px-4">
        <Feather name="search" size={16} color="#71717a" />
        <AppTextInput
          className="flex-1"
          value={query}
          onChangeText={setQuery}
          placeholder="Search friends"
          placeholderTextColorClassName="accent-muted"
        />
      </View>

      <View className="flex-row flex-wrap">
        {filtered.map((member) => (
          <MemberTile
            key={member.id}
            member={member}
            selected={selectedIds.includes(member.id)}
            onPress={() => {
              Haptics.selectionAsync();
              onToggle(member.id);
            }}
          />
        ))}

        {onInvite && (
          <Pressable
            onPress={onInvite}
            className="w-1/3 items-center px-1 py-3 active:opacity-80"
          >
            <View
              className="h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-border"
            >
              <Feather name="user-plus" size={20} color="#71717a" />
            </View>
            <Text className="mt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
              Invite
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
