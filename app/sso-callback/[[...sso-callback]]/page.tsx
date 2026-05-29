import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return <AuthenticateWithRedirectCallback signInFallbackRedirectUrl="/auth/callback" signUpFallbackRedirectUrl="/auth/callback" />;
}
