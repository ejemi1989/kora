import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { CurrencyProvider } from "@/lib/hooks/currency-context";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deni",
  description: "Authentic African food, delivered",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <LanguageProvider>
        <CurrencyProvider>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "var(--primary)",
              colorText: "var(--ink)",
              colorTextSecondary: "var(--body)",
              colorBackground: "var(--surface-card)",
              colorInputBackground: "var(--surface-card)",
              colorInputText: "var(--ink)",
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-sans)",
              fontFamilyButtons: "var(--font-sans)",
              fontSize: "13px",
            },
            elements: {
              card: { boxShadow: "var(--shadow-card)", border: "1px solid var(--hairline)", borderRadius: "var(--radius-md)" },
              formButtonPrimary: { background: "var(--primary)", borderRadius: "9999px", fontSize: "14px", fontWeight: 600, height: "40px", textTransform: "none" },
              formButtonPrimaryHover: { background: "var(--primary-deep)" },
              formFieldLabel: { fontSize: "12px", fontWeight: 600, color: "var(--ink)" },
              formFieldInput: { borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: "13px", height: "40px", padding: "0 12px" },
              formFieldInputFocus: { borderColor: "var(--primary)", boxShadow: "0 0 0 3px var(--primary-bg)" },
              footerActionLink: { color: "var(--primary)", fontSize: "13px", fontWeight: 500 },
              footerActionText: { fontSize: "13px", color: "var(--body)" },
              socialButtonsBlockButton: { borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)", fontSize: "13px", fontWeight: 500, height: "40px", color: "var(--ink)" },
              socialButtonsBlockButtonText: { color: "var(--ink)" },
              dividerLine: { background: "var(--hairline)" },
              dividerText: { color: "var(--muted)", fontSize: "12px" },
              alert: { borderRadius: "var(--radius-sm)" },
              otpCodeFieldInput: { borderRadius: "var(--radius-sm)", border: "1px solid var(--hairline)" },
            },
          }}
        >
          {children}
        </ClerkProvider>
        </CurrencyProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}