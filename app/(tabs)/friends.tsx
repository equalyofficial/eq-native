import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from 'react-native';

export default function FriendsScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View className="flex-1 bg-background px-5 pt-4">
        <Text className="text-4xl font-bold tracking-tight text-foreground">Friends</Text>
        <Text className="mt-2 text-base text-muted">Your direct balances and contacts live here.</Text>
      </View>
    </SafeAreaView>
  );
}
