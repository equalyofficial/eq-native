import { SectionList, Text, View } from "react-native";
import type {
  ActivityItem,
  ActivityKind,
  ActivitySection,
} from "../activity.data";

const DOT_COLOR: Record<ActivityKind, string> = {
  expense: "#F87171",
  settlement: "#4ADE80",
  event: "#818CF8",
};

function TimelineRow({ item }: { item: ActivityItem }) {
  const amountColor =
    item.kind === "expense"
      ? "text-danger"
      : item.kind === "settlement"
        ? "text-success"
        : "text-muted";

  return (
    <View className="flex-row">
      <View className="w-6 items-center">
        <View className="absolute bottom-0 top-0 w-px bg-border" />
        <View className="mt-1.5 h-3 w-3 items-center justify-center">
          <View
            className="absolute h-5 w-5 rounded-full"
            style={{ backgroundColor: DOT_COLOR[item.kind], opacity: 0.1 }}
          />
          <View
            className="h-3 w-3 rounded-full border-2 border-background"
            style={{
              backgroundColor: DOT_COLOR[item.kind],
              shadowColor: DOT_COLOR[item.kind],
              shadowOpacity: 0.4,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 0 },
              elevation: 2,
            }}
          />
        </View>
      </View>

      <View className="flex-1 flex-row items-start justify-between pb-7 pl-2">
        <View className="flex-1 pr-3">
          <Text className="text-lg font-extrabold tracking-tight text-foreground">
            {item.title}
          </Text>
          <Text className="mt-0.5 text-sm text-muted">{item.meta}</Text>
        </View>
        {item.kind === "event" ? (
          <Text className="text-sm font-medium italic text-muted">
            {item.tag}
          </Text>
        ) : (
          <Text className={`text-xl font-bold ${amountColor}`}>
            {item.amount}
          </Text>
        )}
      </View>
    </View>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <View className="flex-row items-center bg-background pb-3 pt-2">
      <View className="w-6 items-center">
        <View className="absolute bottom-0 top-0 w-px bg-border" />
        <View className="h-2.5 w-2.5 rounded-full border border-border bg-background" />
      </View>
      <Text className="pl-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </Text>
    </View>
  );
}

export function ActivityTimeline({ sections }: { sections: ActivitySection[] }) {
  const data = sections.map((s) => ({
    id: s.id,
    title: s.label,
    data: s.items,
  }));

  return (
    <SectionList
      sections={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TimelineRow item={item} />}
      renderSectionHeader={({ section }) => <SectionLabel label={section.title} />}
      stickySectionHeadersEnabled
      showsVerticalScrollIndicator={false}
      contentContainerClassName="px-5 pt-2 pb-40"
    />
  );
}
