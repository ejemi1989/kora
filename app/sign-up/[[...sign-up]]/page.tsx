"use client";

import { useSignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

type Role = "CUSTOMER" | "SELLER" | "ADMIN";

const roles: { key: Role; label: string; title: string; subtitle: string }[] = [
  { key: "CUSTOMER", label: "Buyer", title: "Create your account", subtitle: "Join Deni and start ordering" },
  { key: "SELLER", label: "Seller", title: "Become a seller", subtitle: "List your African food business on Deni" },
  { key: "ADMIN", label: "Admin", title: "Admin access", subtitle: "Restricted to authorized administrators" },
];

const features: Record<Role, string[]> = {
  CUSTOMER: [
    "Browse products from trusted African food vendors",
    "Place secure orders with Stripe-powered checkout",
    "Track deliveries from dispatch to doorstep",
    "Join a growing community of diaspora food lovers",
  ],
  SELLER: [
    "Reach thousands of diaspora food lovers",
    "Manage your menu and pricing in real time",
    "Receive orders and update availability instantly",
    "Get paid securely through Stripe",
  ],
  ADMIN: [
    "Manage platform users and vendors",
    "Oversee orders and dispute resolution",
    "Access platform analytics and reports",
    "Configure system settings and policies",
  ],
};

const tabColors: Record<Role, { bg: string; ring: string }> = {
  CUSTOMER: { bg: "var(--primary)", ring: "var(--primary)" },
  SELLER: { bg: "#2563eb", ring: "#2563eb" },
  ADMIN: { bg: "#7c3aed", ring: "#7c3aed" },
};

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [step, setStep] = useState<"sign-up" | "verify">("sign-up");

  useEffect(() => {
    if (isSignedIn) router.push("/auth/callback");
  }, [isSignedIn, router]);

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!signUp) { setFormError("Sign-up not ready yet"); return; }

    const formData = new FormData(e.currentTarget);
    const emailAddress = formData.get("emailAddress") as string;
    const password = formData.get("password") as string;

    const { error } = await signUp.password({
      emailAddress,
      password,
      unsafeMetadata: { role } as any,
    });
    if (error) { setFormError(error.message); return; }

    if (
      signUp.status === "missing_requirements" &&
      signUp.unverifiedFields?.includes("email_address")
    ) {
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) { setFormError(sendError.message); return; }
      setStep("verify");
      return;
    }

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          const url = decorateUrl("/auth/callback");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
      if (finalizeError) { setFormError(finalizeError.message); }
      return;
    }

    setFormError(`Unexpected sign-up status: ${signUp.status}. Please try again.`);
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!signUp) { setFormError("Sign-up not ready yet"); return; }

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) { setFormError(error.message); return; }

    if (signUp.status === "complete") {
      const { error: finalizeError } = await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          const url = decorateUrl("/auth/callback");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
      if (finalizeError) { setFormError(finalizeError.message); }
      return;
    }

    setFormError(`Unexpected status: ${signUp.status}. Please try again.`);
  };

  const handleGoogleSignUp = async () => {
    await signUp.sso({
      strategy: "oauth_google",
      redirectUrl: "/auth/callback",
      redirectCallbackUrl: "/sso-callback",
    });
  };

  const handleResendCode = async () => {
    await signUp.verifications.sendEmailCode();
  };

  if (isSignedIn) return null;

  const color = tabColors[role];

  return (
    <div className="min-h-screen flex" style={{ background: "var(--canvas)" }}>
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-12 gap-12" style={{ background: "var(--ink)" }}>
        <div>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: color.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--on-primary)", fontWeight: 700, fontSize: 16 }}>N</span>
            <span style={{ color: "var(--on-primary)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em" }}>Deni</span>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 12, marginBottom: 0 }}>
            {role === "CUSTOMER" && "Authentic African food, delivered"}
            {role === "SELLER" && "Your kitchen, thousands of customers"}
            {role === "ADMIN" && "Platform administration"}
          </p>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {features[role].map((f) => (
            <li key={f} style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.5, paddingLeft: 20, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: 7, width: 6, height: 6, borderRadius: "50%", background: color.bg }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div className="lg:hidden mb-8">
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ width: 28, height: 28, borderRadius: "var(--radius-xs)", background: color.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--on-primary)", fontWeight: 700, fontSize: 14 }}>N</span>
              <span style={{ color: "var(--ink)", fontSize: 16, fontWeight: 600, letterSpacing: "-0.03em" }}>Deni</span>
            </Link>
          </div>

          {step === "sign-up" && (
            <>
              <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", overflow: "hidden" }}>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => setRole(r.key)}
                    style={{
                      flex: 1, padding: "8px 0", fontSize: 13, fontWeight: role === r.key ? 600 : 500,
                      border: "none", cursor: "pointer",
                      background: role === r.key ? color.bg : "var(--surface-card)",
                      color: role === r.key ? "var(--on-primary)" : "var(--body)",
                      transition: "all var(--transition)",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>
                  {roles.find((r) => r.key === role)?.title}
                </h1>
                <p style={{ fontSize: 14, color: "var(--body)", marginTop: 4, marginBottom: 0 }}>
                  {roles.find((r) => r.key === role)?.subtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {formError && (
                  <p style={{ fontSize: 12, color: "var(--danger)", padding: "8px 12px", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)" }}>
                    {formError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleGoogleSignUp}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", height: 40, borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--hairline)", background: "var(--surface-card)",
                    fontSize: 13, fontWeight: 500, color: "var(--ink)", cursor: "pointer",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>or</span>
                  <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
                </div>

                <div>
                  <label htmlFor="emailAddress" style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 4 }}>Email address</label>
                  <input
                    id="emailAddress" name="emailAddress" type="email" required
                    style={{ width: "100%", height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 13, padding: "0 12px", background: "var(--surface-card)", color: "var(--ink)" }}
                  />
                  {errors?.fields?.emailAddress && (
                    <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 2 }}>{errors.fields.emailAddress.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 4 }}>Password</label>
                  <input
                    id="password" name="password" type="password" required
                    style={{ width: "100%", height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 13, padding: "0 12px", background: "var(--surface-card)", color: "var(--ink)" }}
                  />
                  {errors?.fields?.password && (
                    <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 2 }}>{errors.fields.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={fetchStatus === "fetching"}
                  style={{
                    width: "100%", height: 40, borderRadius: 9999, border: "none",
                    background: color.bg, color: "var(--on-primary)",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    opacity: fetchStatus === "fetching" ? 0.6 : 1,
                  }}
                >
                  {fetchStatus === "fetching" ? "Creating account..." : "Continue"}
                </button>
              </form>

              <p style={{ fontSize: 13, color: "var(--body)", textAlign: "center", marginTop: 16 }}>
                Already have an account?{" "}
                <Link href="/sign-in" style={{ color: "var(--primary)", fontWeight: 500, textDecoration: "none" }}>Sign in</Link>
              </p>

              <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 12 }}>
                Secured by Deni
              </p>

              <div style={{ marginTop: 16, textAlign: "center" }}>
                <Link href="/" style={{ fontSize: 13, color: "var(--body)", textDecoration: "none" }}>← Back to home</Link>
              </div>

              <div id="clerk-captcha" />
            </>
          )}

          {step === "verify" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>Check your email</h1>
                <p style={{ fontSize: 14, color: "var(--body)", marginTop: 4, marginBottom: 0 }}>Enter the verification code sent to your email</p>
              </div>

              <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label htmlFor="code" style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 4 }}>Verification code</label>
                  <input
                    id="code" name="code" type="text" required
                    style={{ width: "100%", height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 13, padding: "0 12px", background: "var(--surface-card)", color: "var(--ink)", textAlign: "center", letterSpacing: "0.3em" }}
                    placeholder="000000"
                  />
                  {errors?.fields?.code && (
                    <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 2 }}>{errors.fields.code.message}</p>
                  )}
                </div>

                {formError && (
                  <p style={{ fontSize: 12, color: "var(--danger)", padding: "8px 12px", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)" }}>
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={fetchStatus === "fetching"}
                  style={{
                    width: "100%", height: 40, borderRadius: 9999, border: "none",
                    background: color.bg, color: "var(--on-primary)",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    opacity: fetchStatus === "fetching" ? 0.6 : 1,
                  }}
                >
                  {fetchStatus === "fetching" ? "Verifying..." : "Verify email"}
                </button>
              </form>

              <p style={{ fontSize: 13, color: "var(--body)", textAlign: "center", marginTop: 16 }}>
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  style={{ color: "var(--primary)", fontWeight: 500, cursor: "pointer", background: "none", border: "none", fontSize: 13, padding: 0 }}
                >
                  Resend
                </button>
              </p>

              <div style={{ marginTop: 16, textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => { signUp.reset(); setStep("sign-up"); }}
                  style={{ fontSize: 13, color: "var(--body)", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                >
                  ← Back to sign up
                </button>
              </div>

              <div id="clerk-captcha" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
