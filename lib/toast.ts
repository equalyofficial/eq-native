import { toast, ToastPosition } from '@backpackapp-io/react-native-toast';

/**
 * Premium Toast Utility for Equaly
 * Ensures singleton behavior and theme-consistent styling.
 */
export const AppToast = {
  error: (message: string) => {
    // Dismiss any existing toasts to prevent stacking (Singleton behavior)
    toast.dismiss();
    
    toast.error(message, {
      position: ToastPosition.BOTTOM,
      duration: 3000,
      // Custom styling is handled via the Toasts provider in _layout.tsx 
      // or passed here if the library supports a style object.
    });
  },
  
  success: (message: string) => {
    toast.dismiss();
    toast.success(message, {
      position: ToastPosition.BOTTOM,
      duration: 3000,
    });
  },
  
  info: (message: string) => {
    toast.dismiss();
    toast(message, {
      position: ToastPosition.BOTTOM,
      duration: 3000,
    });
  }
};
