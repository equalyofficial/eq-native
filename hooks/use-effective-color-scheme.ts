import { useUniwind } from 'uniwind';

import { useColorScheme } from '@/hooks/use-color-scheme';

export function useEffectiveColorScheme(): 'light' | 'dark' {
  const systemColorScheme = useColorScheme();
  const { theme, hasAdaptiveThemes } = useUniwind();

  if (hasAdaptiveThemes) {
    // systemColorScheme can be null briefly on Android new arch — fall back to theme
    return (systemColorScheme ?? theme) === 'dark' ? 'dark' : 'light';
  }

  return theme === 'dark' ? 'dark' : 'light';
}
