import { useUniwind } from 'uniwind';

import { useColorScheme } from '@/hooks/use-color-scheme';

export function useEffectiveColorScheme(): 'light' | 'dark' {
  const systemColorScheme = useColorScheme();
  const { theme, hasAdaptiveThemes } = useUniwind();

  if (hasAdaptiveThemes) {
    return systemColorScheme ?? 'light';
  }

  return theme === 'dark' ? 'dark' : 'light';
}
