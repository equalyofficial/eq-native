import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, View } from 'react-native';

import { HomeHeader } from '../components/home-header';
import { MainSettleButton } from '../components/main-settle-button';
import { NetBalanceCard } from '../components/net-balance-card';
import { RecentActivitySection } from '../components/recent-activity-section';

export default function HomeScreen() {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
      <View className="flex-1 bg-background">
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-36"
          showsVerticalScrollIndicator={false}
        >
          <HomeHeader />
          <NetBalanceCard />
          <View className="px-5 pt-6">
            <MainSettleButton />
          </View>
          <RecentActivitySection />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
