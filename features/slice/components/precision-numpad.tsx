import React, { useRef } from 'react';
import { View, Text, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useCSSVariable } from 'uniwind';

interface PrecisionNumpadProps {
  onDigitPress: (digit: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export function PrecisionNumpad({ onDigitPress, onDelete, onClear }: PrecisionNumpadProps) {
  const mutedColor = useCSSVariable('--color-muted');
  const deleteTimer = useRef<NodeJS.Timeout | null>(null);

  const digits = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['.', '0', 'delete'],
  ];

  const handlePress = (val: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (val === 'delete') {
      onDelete();
    } else if (val === 'clear') {
      onClear();
    } else {
      onDigitPress(val);
    }
  };

  const handlePressIn = (val: string) => {
    if (val === 'delete') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDelete();
      
      // Trigger "Clear All" after a hold threshold (500ms)
      deleteTimer.current = setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onClear();
      }, 500);
    } else {
      handlePress(val);
    }
  };

  const handlePressOut = () => {
    if (deleteTimer.current) {
      clearTimeout(deleteTimer.current);
      deleteTimer.current = null;
    }
  };

  const renderButton = (key: string, row: number, col: number) => (
    <Pressable
      key={key}
      onPressIn={() => handlePressIn(key)}
      onPressOut={handlePressOut}
      className="flex-1 h-18 items-center justify-center rounded-full active:bg-foreground/5"
    >
      {key === 'delete' ? (
        <Feather name="chevron-left" size={32} color={String(mutedColor)} />
      ) : (
        <Text className="text-3xl font-medium text-foreground">
          {key}
        </Text>
      )}
    </Pressable>
  );

  return (
    <View className="w-full px-4">
      {digits.map((row, rowIndex) => (
        <View key={rowIndex} className="flex-row">
          {row.map((key, colIndex) => renderButton(key, rowIndex, colIndex))}
        </View>
      ))}
    </View>
  );
}
