import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pt-16 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-8">
          <Text className="text-4xl font-bold text-foreground tracking-tight">Equaly</Text>
          <Text className="text-base text-muted mt-2">Ready to build.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
