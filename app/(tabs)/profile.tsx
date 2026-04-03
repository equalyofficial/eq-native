import { View, Text, ScrollView, Pressable } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

export default function ProfileScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const activeTheme = hasAdaptiveThemes ? 'system' : theme;

  const themes = [
    { name: 'light', label: 'Light' },
    { name: 'dark', label: 'Dark' },
    { name: 'system', label: 'System' },
  ] as const;

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-10">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Profile</Text>
          <Text className="text-base text-muted mt-2">Your account.</Text>
        </View>

        <View className="gap-3">
          <Text className="text-sm font-semibold text-muted uppercase tracking-widest mb-1">
            Appearance
          </Text>
          {themes.map((t) => (
            <Pressable
              key={t.name}
              onPress={() => Uniwind.setTheme(t.name)}
              className={[
                'flex-row items-center justify-between px-5 py-4 rounded-xl border',
                activeTheme === t.name
                  ? 'bg-foreground border-foreground'
                  : 'bg-card border-border',
              ].join(' ')}
            >
              <Text
                className={[
                  'text-base font-medium',
                  activeTheme === t.name ? 'text-background' : 'text-foreground',
                ].join(' ')}
              >
                {t.label}
              </Text>
              {activeTheme === t.name && (
                <View className="w-2 h-2 rounded-full bg-background" />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
