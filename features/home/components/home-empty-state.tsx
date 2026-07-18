import { Pressable, Text, View } from 'react-native';

type HomeEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onPress?: () => void;
};

export function HomeEmptyState({
  title,
  description,
  actionLabel,
  onPress,
}: HomeEmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="w-full max-w-sm items-center rounded-3xl border border-border bg-card px-6 py-8">
        <Text className="text-center text-2xl font-bold tracking-tight text-foreground">
          {title}
        </Text>
        <Text className="mt-3 text-center text-base leading-7 text-muted">
          {description}
        </Text>

         {actionLabel && onPress ? (
           <Pressable
             onPress={onPress}
             className="mt-6 h-12 min-w-48 items-center justify-center rounded-full bg-linear-to-r from-zinc-100 to-brand-accent px-6"
           >
             <Text className="text-base font-bold text-white">{actionLabel}</Text>
           </Pressable>
         ) : null}

      </View>
    </View>
  );
}
