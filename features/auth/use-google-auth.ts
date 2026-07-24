import { useCallback, useState } from "react";
import {
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { GoogleSignin } from "@/lib/google-auth";
import { AppToast } from "@/lib/toast";
import { useGoogleSignIn } from "./auth.hooks";

/**
 * Drives the full native Google Sign-In flow: opens the account picker, pulls
 * the `idToken`, then hands it to the backend via `useGoogleSignIn`. On success
 * the session is set (see `onAuthSuccess` in auth.hooks). Callers pass what to
 * do after a successful backend exchange (e.g. navigate).
 */
export function useGoogleAuth(onSuccess: () => void) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const { mutate: exchange, isPending: isExchanging } = useGoogleSignIn({
    onSuccess,
    onError: (error) =>
      AppToast.error(error.message ?? "Google sign-in failed. Try again."),
  });

  const signIn = useCallback(async () => {
    try {
      setIsSigningIn(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      const idToken =
        response.type === "success" ? response.data.idToken : null;
      if (!idToken) {
        // User dismissed the picker, or no token returned.
        return;
      }

      exchange({ id_token: idToken });
    } catch (error) {
      if (isErrorWithCode(error) && error.code === statusCodes.SIGN_IN_CANCELLED) {
        return; // user backed out — not an error worth surfacing
      }
      AppToast.error("Couldn't start Google sign-in. Try again.");
    } finally {
      setIsSigningIn(false);
    }
  }, [exchange]);

  return { signIn, isLoading: isSigningIn || isExchanging };
}
