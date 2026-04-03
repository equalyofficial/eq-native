import { Link } from 'expo-router';
import { View, Text } from 'react-native';

export default function ModalScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-2xl font-bold text-foreground">Modal</Text>
      <Link href="/" dismissTo>
        <Text className="text-base text-muted mt-4">Go back</Text>
      </Link>
    </View>
  );
}
