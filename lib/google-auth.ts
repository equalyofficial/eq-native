import { GoogleSignin } from "@react-native-google-signin/google-signin";

/**
 * Configure the native Google Sign-In SDK. Call once at app startup.
 *
 * `webClientId` is REQUIRED — the returned `idToken`'s audience is the Web
 * OAuth client, and that is what the backend verifies. `iosClientId` is only
 * needed on iOS. Android resolves its client automatically from the package
 * name + SHA-1 registered in Google Cloud (no client ID in code).
 */
export function configureGoogleSignIn() {
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  if (!webClientId) {
    // Missing config — sign-in will no-op rather than crash the app.
    if (__DEV__) {
      console.warn(
        "[google-auth] EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is not set — Google Sign-In is disabled.",
      );
    }
    return;
  }

  GoogleSignin.configure({
    webClientId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    offlineAccess: false,
  });
}

export { GoogleSignin };
