import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Settings, LogOut, ShoppingBag, Crown, ChevronRight, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '마이페이지',
}

export default async function MypagePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?next=/mypage')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 구독 정보
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const isSubscribed = !!subscription

  const menuItems = [
    {
      href: '/auth/profile',
      icon: Settings,
      label: '프로필 수정',
      desc: '생년월일·시간·성별 정보 변경 (30일 1회)',
    },
    {
      href: '/mypage/orders',
      icon: ShoppingBag,
      label: '결제 내역',
      desc: '지금까지 결제한 사주 분석 내역',
    },
    {
      href: '/subscribe',
      icon: Crown,
      label: isSubscribed ? '구독 관리' : '구독 시작하기',
      desc: isSubscribed
        ? `${new Date(subscription.expires_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}까지 이용 가능`
        : '전 카테고리 무제한 이용 — 49,900원/년',
      highlight: !isSubscribed,
    },
  ]

  return (
    <div className="min-h-screen bg-[#fdfcff]">
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* 프로필 헤더 */}
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white mb-6 shadow-xl shadow-violet-500/20">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-white mb-0.5">
                {profile?.nickname ?? '이름 없음'}
              </h1>
              <p className="text-sm text-violet-200 truncate">{user.email}</p>
            </div>
          </div>

          {/* 구독 상태 배지 */}
          {isSubscribed ? (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-full">
              <Crown className="w-3.5 h-3.5 text-amber-300" strokeWidth={2} />
              <span className="text-xs font-bold text-white">구독 중</span>
            </div>
          ) : (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full">
              <span className="text-xs text-violet-200">무료 회원</span>
            </div>
          )}
        </div>

        {/* 프로필 정보 요약 */}
        {profile?.is_complete && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-violet-500" strokeWidth={1.8} />
              <h2 className="text-sm font-bold text-gray-700">내 사주 정보</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.birth_date && (
                <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.birth_date}
                </span>
              )}
              {profile.gender && (
                <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.gender}성
                </span>
              )}
              {profile.birth_time && (
                <span className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                  {profile.birth_time}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 메뉴 */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden mb-4">
          {menuItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors',
                  idx < menuItems.length - 1 && 'border-b border-gray-50',
                  item.highlight && 'bg-violet-50/40 hover:bg-violet-50/70'
                )}
              >
                <div className={cn(
                  'p-2 rounded-xl',
                  item.highlight ? 'bg-violet-100' : 'bg-gray-100'
                )}>
                  <Icon className={cn(
                    'w-4 h-4',
                    item.highlight ? 'text-violet-600' : 'text-gray-500'
                  )} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm font-semibold',
                    item.highlight ? 'text-violet-700' : 'text-gray-800'
                  )}>
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed truncate">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" strokeWidth={2} />
              </Link>
            )
          })}
        </div>

        {/* 로그아웃 */}
        <LogoutButton />

      </div>
    </div>
  )
}

function LogoutButton() {
  return (
    <form action="/auth/logout" method="POST">
      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-3 text-sm text-gray-500 hover:text-red-500 transition-colors rounded-2xl hover:bg-red-50 border border-gray-100"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.8} />
        로그아웃
      </button>
    </form>
  )
}
