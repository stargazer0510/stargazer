import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: '사주가자 — AI 사주 분석 서비스',
    template: '%s | 사주가자',
  },
  description: '생년월일이 말해주는 당신의 운명. AI 기반 정밀 사주 분석 — 도화살, 재회 가능성, 궁합, 올해 운세.',
  keywords: ['사주', '사주팔자', '운세', '궁합', '도화살', 'AI 사주', '사주 분석', '재회'],
  openGraph: {
    title: '사주가자 — AI 사주 분석 서비스',
    description: '생년월일이 말해주는 당신의 운명. AI 기반 정밀 사주 분석.',
    locale: 'ko_KR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col bg-[#fdfcff] text-gray-900 antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
