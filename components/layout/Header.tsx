'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sparkles, User, LogIn } from 'lucide-react'

const NAV_LINKS = [
  { href: '/category/doha-sal', label: '도화살' },
  { href: '/category/reunion', label: '재회 가능성' },
  { href: '/category/compatibility', label: '궁합 분석' },
  { href: '/category/yearly-fortune', label: '올해 운세' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/80 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-1.5 font-black text-lg text-violet-700 tracking-tight"
        >
          <Sparkles className="w-4 h-4 text-violet-500" strokeWidth={2} />
          사주가자
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-violet-700 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 우측 버튼 */}
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/auth/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-violet-700 font-medium transition-colors rounded-lg hover:bg-violet-50"
          >
            <LogIn className="w-4 h-4" strokeWidth={1.8} />
            로그인
          </Link>
          <Link
            href="/auth/signup"
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            <User className="w-4 h-4" strokeWidth={1.8} />
            회원가입
          </Link>
        </div>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {menuOpen ? (
            <X className="w-5 h-5" strokeWidth={2} />
          ) : (
            <Menu className="w-5 h-5" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* 모바일 드로어 */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/98 backdrop-blur-md">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 px-3 text-sm text-gray-700 hover:text-violet-700 hover:bg-violet-50 rounded-xl font-medium transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-2 pt-2 flex flex-col gap-1">
              <Link
                href="/auth/login"
                className="py-2.5 px-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn className="w-4 h-4" strokeWidth={1.8} />
                로그인
              </Link>
              <Link
                href="/auth/signup"
                className="py-2.5 px-3 text-sm bg-violet-600 text-white hover:bg-violet-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <User className="w-4 h-4" strokeWidth={1.8} />
                회원가입
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
