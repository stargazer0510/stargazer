import type { Metadata, Viewport } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: '사주비서 — AI 사주 분석 서비스',
    template: '%s | 사주비서',
  },
  description: '생년월일로 알아보는 나의 운명. AI 기반 정밀 사주 분석 — 도화살, 이름 점수, 재회 가능성, 궁합, 올해 운세.',
  keywords: ['사주', '사주팔자', '운세', '궁합', '도화살', 'AI 사주', '사주 분석'],
  openGraph: {
    title: '사주비서 — AI 사주 분석 서비스',
    description: '생년월일로 알아보는 나의 운명. AI 기반 정밀 사주 분석.',
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
      <body className="min-h-screen flex flex-col bg-[#fafaf9] text-gray-900 antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
