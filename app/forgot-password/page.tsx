"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "code" | "reset">("email");

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!signIn) { setFormError("Not ready yet"); return; }

    const formData = new FormData(e.currentTarget);
    const emailAddress = formData.get("email") as string;

    const { error } = await signIn.create({ identifier: emailAddress });
    if (error) { setFormError(error.message); return; }

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendError) { setFormError(sendError.message); return; }

    setStep("code");
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!signIn) { setFormError("Not ready yet"); return; }

    const formData = new FormData(e.currentTarget);
    const code = formData.get("code") as string;

    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (error) { setFormError(error.message); return; }

    if (signIn.status === "needs_new_password") {
      setStep("reset");
    } else {
      setFormError("Unexpected status. Please try again.");
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!signIn) { setFormError("Not ready yet"); return; }

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
      signOutOfOtherSessions: true,
    });
    if (error) { setFormError(error.message); return; }

    if (signIn.status === "complete") {
      router.push("/auth/callback");
    } else {
      setFormError("Something went wrong. Please try again.");
    }
  };

  const handleResendCode = async () => {
    setFormError(null);
    if (!signIn) return;
    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    if (error) setFormError(error.message);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--canvas)" }}>
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-12 gap-12" style={{ background: "var(--ink)" }}>
        <div>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ width: 32, height: 32, borderRadius: "var(--radius-sm)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--on-primary)", fontWeight: 700, fontSize: 16 }}>N</span>
            <span style={{ color: "var(--on-primary)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.03em" }}>Deni</span>
          </Link>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 12, marginBottom: 0 }}>
            Reset your password securely
          </p>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            "Enter your email address to receive a reset code",
            "Check your inbox for the verification code",
            "Create a new password for your account",
          ].map((f) => (
            <li key={f} style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.5, paddingLeft: 20, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, top: 7, width: 6, height: 6, borderRadius: "50%", background: "var(--primary)" }} />
              {f}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div className="lg:hidden mb-8">
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
              <span style={{ width: 28, height: 28, borderRadius: "var(--radius-xs)", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--on-primary)", fontWeight: 700, fontSize: 14 }}>N</span>
              <span style={{ color: "var(--ink)", fontSize: 16, fontWeight: 600, letterSpacing: "-0.03em" }}>Deni</span>
            </Link>
          </div>

          {step === "email" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>
                  Forgot password?
                </h1>
                <p style={{ fontSize: 14, color: "var(--body)", marginTop: 4, marginBottom: 0 }}>
                  No worries. Enter your email and we&apos;ll send you a reset code.
                </p>
              </div>

              <form onSubmit={handleSendCode} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {formError && (
                  <p style={{ fontSize: 12, color: "var(--danger)", padding: "8px 12px", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)" }}>
                    {formError}
                  </p>
                )}

                <div>
                  <label htmlFor="email" style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 4 }}>Email address</label>
                  <input
                    id="email" name="email" type="email" required
                    style={{ width: "100%", height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 13, padding: "0 12px", background: "var(--surface-card)", color: "var(--ink)" }}
                  />
                  {errors?.fields?.identifier && (
                    <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 2 }}>{errors.fields.identifier.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={fetchStatus === "fetching"}
                  style={{
                    width: "100%", height: 40, borderRadius: 9999, border: "none",
                    background: "var(--primary)", color: "var(--on-primary)",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    opacity: fetchStatus === "fetching" ? 0.6 : 1,
                  }}
                >
                  {fetchStatus === "fetching" ? "Sending..." : "Send reset code"}
                </button>
              </form>

              <div style={{ marginTop: 16, textAlign: "center" }}>
                <Link href="/sign-in" style={{ fontSize: 13, color: "var(--body)", textDecoration: "none" }}>← Back to sign in</Link>
              </div>
            </>
          )}

          {step === "code" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>
                  Check your email
                </h1>
                <p style={{ fontSize: 14, color: "var(--body)", marginTop: 4, marginBottom: 0 }}>
                  Enter the reset code we sent to your inbox
                </p>
              </div>

              <form onSubmit={handleVerifyCode} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {formError && (
                  <p style={{ fontSize: 12, color: "var(--danger)", padding: "8px 12px", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)" }}>
                    {formError}
                  </p>
                )}

                <div>
                  <label htmlFor="code" style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 4 }}>Reset code</label>
                  <input
                    id="code" name="code" type="text" required
                    style={{ width: "100%", height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 13, padding: "0 12px", background: "var(--surface-card)", color: "var(--ink)", textAlign: "center", letterSpacing: "0.3em" }}
                    placeholder="000000"
                  />
                  {errors?.fields?.code && (
                    <p style={{ fontSize: 12, color: "var(--danger)", marginTop: 2 }}>{errors.fields.code.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={fetchStatus === "fetching"}
                  style={{
                    width: "100%", height: 40, borderRadius: 9999, border: "none",
                    background: "var(--primary)", color: "var(--on-primary)",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    opacity: fetchStatus === "fetching" ? 0.6 : 1,
                  }}
                >
                  {fetchStatus === "fetching" ? "Verifying..." : "Verify code"}
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
                  onClick={() => { signIn?.reset(); setStep("email"); setFormError(null); }}
                  style={{ fontSize: 13, color: "var(--body)", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                >
                  ← Back to email
                </button>
              </div>
            </>
          )}

          {step === "reset" && (
            <>
              <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--ink)", margin: 0 }}>
                  Create new password
                </h1>
                <p style={{ fontSize: 14, color: "var(--body)", marginTop: 4, marginBottom: 0 }}>
                  Choose a strong password you haven&apos;t used before
                </p>
              </div>

              <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {formError && (
                  <p style={{ fontSize: 12, color: "var(--danger)", padding: "8px 12px", background: "var(--danger-bg)", borderRadius: "var(--radius-sm)" }}>
                    {formError}
                  </p>
                )}

                <div>
                  <label htmlFor="password" style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 4 }}>New password</label>
                  <input
                    id="password" name="password" type="password" required
                    minLength={8}
                    style={{ width: "100%", height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 13, padding: "0 12px", background: "var(--surface-card)", color: "var(--ink)" }}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "block", marginBottom: 4 }}>Confirm password</label>
                  <input
                    id="confirmPassword" name="confirmPassword" type="password" required
                    minLength={8}
                    style={{ width: "100%", height: 40, borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: 13, padding: "0 12px", background: "var(--surface-card)", color: "var(--ink)" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={fetchStatus === "fetching"}
                  style={{
                    width: "100%", height: 40, borderRadius: 9999, border: "none",
                    background: "var(--primary)", color: "var(--on-primary)",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    opacity: fetchStatus === "fetching" ? 0.6 : 1,
                  }}
                >
                  {fetchStatus === "fetching" ? "Resetting..." : "Reset password"}
                </button>
              </form>
            </>
          )}

          <div id="clerk-captcha" />
        </div>
      </div>
    </div>
  );
}
