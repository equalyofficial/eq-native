import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function GroupsScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View className="flex-1 bg-background px-5 pt-4">
        <Text className="text-4xl font-bold tracking-tight text-foreground">Groups</Text>
        <Text className="mt-2 text-base text-muted">Shared group balances will appear here.</Text>
      </View>
    </SafeAreaView>
  );
}
