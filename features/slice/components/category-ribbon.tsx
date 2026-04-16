import React from 'react';
import { ScrollView, Text, Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCSSVariable } from 'uniwind';

const ALL_CATEGORIES = [
  { id: 'food_and_dining', label: 'Food', icon: '🍕' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'groceries', label: 'Groceries', icon: '🛒' },
  { id: 'bills_and_recharges', label: 'Bills', icon: '💡' },
  { id: 'entertainment', label: 'Movies', icon: '🎬' },
  { id: 'medical', label: 'Medical', icon: '🏥' },
  { id: 'travel', label: 'Travel', icon: '✈️' },
  { id: 'transfers', label: 'Transfer', icon: '💸' },
  { id: 'repayments', label: 'Repay', icon: '♻️' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'services', label: 'Services', icon: '🛠️' },
  { id: 'insurance', label: 'Insurance', icon: '🛡️' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'small_shops', label: 'Local Shop', icon: '🏪' },
  { id: 'rent', label: 'Rent', icon: '🏠' },
  { id: 'logistics', label: 'Logistics', icon: '📦' },
  { id: 'subscription', label: 'Sub', icon: '💎' },
  { id: 'investment', label: 'Invest', icon: '📈' },
  { id: 'fitness', label: 'Fitness', icon: '🏋️' },
  { id: 'pet', label: 'Pet', icon: '🐾' },
  { id: 'miscellaneous', label: 'Misc', icon: '📦' },
];

interface CategoryRibbonProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onMorePress: () => void;
}

export function CategoryRibbon({ selectedCategory, onSelectCategory, onMorePress }: CategoryRibbonProps) {
  const majorCategories = ALL_CATEGORIES.slice(0, 5);
  const [mutedColor] = useCSSVariable(['--color-muted']) as [string];

  // Move selected category to the front if it's not already in the major list
  const selectedCat = ALL_CATEGORIES.find(c => c.id === selectedCategory);
  const displayCategories = selectedCat && !majorCategories.find(c => c.id === selectedCategory)
    ? [selectedCat, ...majorCategories]
    : majorCategories;

  return (
    <View className="py-3">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {displayCategories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => onSelectCategory(cat.id)}
              className={[
                'flex-row items-center gap-2 px-4 py-2.5 rounded-full',
                isActive ? 'bg-foreground' : 'bg-card',
              ].join(' ')}
            >
              <Text className="text-base leading-none">{cat.icon}</Text>
              <Text
                className={[
                  'text-sm font-semibold',
                  isActive ? 'text-background' : 'text-foreground',
                ].join(' ')}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={onMorePress}
          className="flex-row items-center gap-1.5 px-4 py-2.5 rounded-full bg-card"
        >
          <Text className="text-sm font-semibold text-muted">More</Text>
          <Feather name="chevron-right" size={13} color={mutedColor} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

export { ALL_CATEGORIES };

