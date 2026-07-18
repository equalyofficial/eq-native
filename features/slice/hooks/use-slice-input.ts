import { useState } from 'react';
import { AppToast } from '@/lib/toast';
import * as Haptics from 'expo-haptics';

export function useSliceInput(onLimitExceeded?: () => void) {
  const [amount, setAmount] = useState('0');

  const formatCurrency = (val: string) => {
    const parts = val.split('.');
    // Indian numbering system: 9,99,999
    parts[0] = new Intl.NumberFormat('en-IN').format(parseInt(parts[0] || '0', 10));
    return parts.join('.');
  };

  const handleLimitError = (message: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    AppToast.error(message);
    if (onLimitExceeded) onLimitExceeded();
  };

  const appendDigit = (digit: string) => {
    const rawValue = amount.replace(/,/g, '');

    if (rawValue === '0' && digit !== '.') {
      setAmount(digit);
      return;
    }

    if (digit === '.') {
      if (rawValue.includes('.')) {
        handleLimitError('Only one decimal point allowed');
        return;
      }
      setAmount(rawValue + '.');
      return;
    }

    if (rawValue.includes('.')) {
      const decimalPart = rawValue.split('.')[1];
      if (decimalPart && decimalPart.length >= 2) {
        handleLimitError('Maximum 2 decimal places allowed');
        return;
      }
    }

    const nextValue = rawValue + digit;
    if (parseFloat(nextValue) > 999999.99) {
      handleLimitError('You cannot add more than ₹9,99,999');
      return;
    }

    setAmount(formatCurrency(nextValue));
  };

  const deleteLast = () => {
    setAmount((prev) => {
      const rawValue = prev.replace(/,/g, '');
      if (rawValue.length <= 1) return '0';
      const newAmount = rawValue.slice(0, -1);
      return formatCurrency(newAmount === '' ? '0' : newAmount);
    });
  };

  const clear = () => {
    setAmount('0');
  };

  return {
    amount,
    appendDigit,
    deleteLast,
    clear,
  };
}



