'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('next') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // URL에 error 파라미터가 있으면 표시
  const urlError = searchParams.get('error')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.')
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setIsLoading(false)
      if (authError.message.includes('Invalid login credentials')) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else if (authError.message.includes('Email not confirmed')) {
        setError('이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.')
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#fdfcff] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* 로고 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="p-2 bg-violet-100 rounded-xl">
              <Sparkles className="w-5 h-5 text-violet-600" strokeWidth={1.8} />
            </div>
            <span className="text-lg font-black text-gray-900">사주비서</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-900 mb-1">로그인</h1>
          <p className="text-sm text-gray-500">계속하려면 로그인이 필요합니다.</p>
        </div>

        {/* 에러 메시지 */}
        {(error || urlError) && (
          <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-sm text-red-700">
              {error ?? (urlError === 'auth_callback_failed' ? '인증에 실패했습니다. 다시 시도해주세요.' : urlError)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* 이메일 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              이메일
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-white text-sm text-gray-900',
                'placeholder:text-gray-400 outline-none transition-all',
                'focus:border-violet-400 focus:ring-2 focus:ring-violet-100',
                'border-gray-200'
              )}
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-xs text-violet-600 hover:text-violet-700 font-medium"
              >
                비밀번호 찾기
              </Link>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                className={cn(
                  'w-full px-4 py-3 pr-11 rounded-xl border bg-white text-sm text-gray-900',
                  'placeholder:text-gray-400 outline-none transition-all',
                  'focus:border-violet-400 focus:ring-2 focus:ring-violet-100',
                  'border-gray-200'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPassword
                  ? <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                  : <Eye className="w-4 h-4" strokeWidth={1.8} />
                }
              </button>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3.5',
              'bg-gradient-to-b from-violet-600 to-violet-700',
              'hover:from-violet-500 hover:to-violet-600',
              'text-white font-bold rounded-xl text-sm transition-all',
              'shadow-lg shadow-violet-500/25',
              'disabled:opacity-60 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                로그인 중...
              </span>
            ) : (
              <>
                로그인
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* 회원가입 링크 */}
        <p className="text-center text-sm text-gray-600">
          아직 계정이 없으신가요?{' '}
          <Link
            href="/auth/signup"
            className="font-bold text-violet-600 hover:text-violet-700"
          >
            회원가입
          </Link>
        </p>

      </div>
    </div>
  )
}
