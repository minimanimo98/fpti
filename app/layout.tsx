import type { Metadata } from "next";
import { Gowun_Dodum, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const gowunDodum = Gowun_Dodum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "FPTI · 친구가 답하는 인성 테스트",
  description: "MBTI는 내가 보는 나, FPTI는 친구가 보는 나. 친구 3명이 답하면 진짜 내 인성이 드러납니다.",
  metadataBase: new URL("https://fpti.kr"),
  openGraph: {
    title: "FPTI · 친구가 답하는 인성 테스트",
    description: "친구들이 답한 진짜 내 인성. 2분이면 결과를 받을 수 있어요.",
    url: "https://fpti.kr",
    siteName: "FPTI",
    images: [{ url: "/api/og", width: 1200, height: 630 }],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FPTI · 친구가 답하는 인성 테스트",
    description: "친구들이 답한 진짜 내 인성",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${gowunDodum.variable} ${ibmPlexMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var ua = navigator.userAgent.toLowerCase();
                var isKakaoInApp = ua.indexOf('kakaotalk') > -1;
                
                if (isKakaoInApp) {
                  var targetUrl = window.location.href;
                  var isAndroid = ua.indexOf('android') > -1;
                  var isIOS = /iphone|ipad|ipod/.test(ua);
                  
                  if (isAndroid) {
                    // Android: 크롬으로 강제 열기
                    window.location.href = 'intent://' + targetUrl.replace(/https?:\\/\\//i, '') + '#Intent;scheme=https;package=com.android.chrome;end';
                  } else if (isIOS) {
                    // iOS: 사파리로 열기 (카카오 정책상 X-button 토글 후 안내)
                    document.body.style.cssText = 'background:#F5E6D8; color:#2C1810; padding:24px; text-align:center; font-family:sans-serif;';
                    document.body.innerHTML = '<div style="max-width:400px; margin:60px auto; padding:24px; background:#fff; border:2px solid #2C1810; border-radius:20px; box-shadow:0 5px 0 #C97D5A;"><div style="font-size:48px; margin-bottom:16px;">📱</div><h2 style="font-size:20px; margin-bottom:12px; color:#2C1810;">사파리로 열어주세요</h2><p style="font-size:14px; color:#5A4030; line-height:1.6; margin-bottom:20px;">카카오톡 안에서는 정상 작동이 안 돼요.<br/>아래 방법으로 사파리에서 열어주세요.</p><div style="background:#F5E6D8; padding:16px; border-radius:12px; text-align:left; font-size:13px; color:#2C1810; line-height:1.8;"><strong>1.</strong> 우상단 <strong>···</strong> 메뉴 클릭<br/><strong>2.</strong> <strong>"Safari로 열기"</strong> 선택</div></div>';
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
