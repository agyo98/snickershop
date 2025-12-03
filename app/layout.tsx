import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "SNEAKR - 프리미엄 스니커즈 마켓플레이스",
  description: "한정판 스니커즈부터 클래식까지, 당신이 찾는 모든 신발을 만나보세요. 100% 정품 보장, 안전한 거래.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <script src="https://js.tosspayments.com/v2/standard"></script>
      </head>
      <body>
        <ErrorBoundary>
          <AuthProvider>{children}</AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

