import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { router } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useEffectiveColorScheme } from '@/hooks/use-effective-color-scheme';

type VisibleRouteName = 'index' | 'groups' | 'friends' | 'activity';

type TabItemProps = {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onPress: () => void;
};

function TabItem({ icon, label, isActive, onPress }: TabItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 items-center justify-center gap-2 px-1 pt-5 pb-3"
    >
      {icon}
      <Text
        className={[
          'text-[10px] font-semibold uppercase tracking-[0.22em]',
          isActive ? 'text-accent' : 'text-muted',
        ].join(' ')}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const tabMeta: Record<
  VisibleRouteName,
  {
    label: string;
    icon: (
      focused: boolean,
      activeColor: string,
      inactiveColor: string,
    ) => React.ReactNode;
  }
> = {
  index: {
    label: 'Home',
    icon: (focused, activeColor, inactiveColor) => (
      <Ionicons
        name="home"
        size={24}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  groups: {
    label: 'Groups',
    icon: (focused, activeColor, inactiveColor) => (
      <MaterialIcons
        name="groups"
        size={26}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  friends: {
    label: 'Friends',
    icon: (focused, activeColor, inactiveColor) => (
      <Feather
        name="user"
        size={24}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
  activity: {
    label: 'Activity',
    icon: (focused, activeColor, inactiveColor) => (
      <Feather
        name="bell"
        size={24}
        color={focused ? activeColor : inactiveColor}
      />
    ),
  },
};

export function CustomBottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useEffectiveColorScheme();
  const colors = Colors[colorScheme];

  const visibleRoutes = state.routes.filter(
    (
      route,
    ): route is (typeof state.routes)[number] & { name: VisibleRouteName } =>
      route.name in tabMeta,
  );

  const bottomInset =
    Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 12;

  return (
    <View className="absolute inset-x-0 bottom-0 w-full" pointerEvents="box-none">
      <View
        className="w-full rounded-t-[2rem] border-t border-border bg-card"
        style={{ paddingBottom: bottomInset }}
      >
        <View className="flex-row px-2">
          {visibleRoutes.slice(0, 2).map((route) => {
            const routeIndex = state.routes.findIndex(
              (item) => item.key === route.key,
            );
            const focused = state.index === routeIndex;
            const meta = tabMeta[route.name];

            return (
              <TabItem
                key={route.key}
                label={meta.label}
                isActive={focused}
                icon={meta.icon(focused, colors.accent, colors.muted)}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
              />
            );
          })}

          <View className="flex-1" />

          {visibleRoutes.slice(2).map((route) => {
            const routeIndex = state.routes.findIndex(
              (item) => item.key === route.key,
            );
            const focused = state.index === routeIndex;
            const meta = tabMeta[route.name];

            return (
              <TabItem
                key={route.key}
                label={meta.label}
                isActive={focused}
                icon={meta.icon(focused, colors.accent, colors.muted)}
                onPress={() => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!focused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
              />
            );
          })}
        </View>
      </View>

      <View
        className="absolute inset-x-0 top-0 items-center justify-center"
        pointerEvents="box-none"
      >
        <Pressable
          className="h-16 w-16 items-center justify-center rounded-full border-4 border-background bg-white"
          style={{ top: -28 }}
          onPress={() => router.push('/modal')}
        >
          <Feather name="plus" size={30} color="#000000" />
        </Pressable>
      </View>
    </View>
  );
}
