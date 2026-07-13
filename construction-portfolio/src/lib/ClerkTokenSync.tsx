import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { registerAuthTokenGetter } from "../service/api";

/**
 * Bridges Clerk's session token into the plain axios client used across the
 * app, so service/api.ts doesn't need to import React/Clerk hooks itself.
 * Mount once, inside <ClerkProvider>.
 */
export default function ClerkTokenSync() {
  const { getToken } = useAuth();

  useEffect(() => {
    registerAuthTokenGetter(() => getToken());
    return () => registerAuthTokenGetter(null);
  }, [getToken]);

  return null;
}
