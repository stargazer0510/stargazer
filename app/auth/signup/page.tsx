'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type Step = 'form' | 'verify'

export default function SignupPage() {
  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirm?: string }>({})

  function validate() {
    const errs: typeof fieldErrors = {}
    if (!email.trim()) errs.email = '이메일을 입력해주세요.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = '올바른 이메일 형식이 아닙니다.'
    if (!password) errs.password = '비밀번호를 입력해주세요.'
    else if (password.length < 8) errs.password = '비밀번호는 8자 이상이어야 합니다.'
    if (!passwordConfirm) errs.confirm = '비밀번호 확인을 입력해주세요.'
    else if (password !== passwordConfirm) errs.confirm = '비밀번호가 일치하지 않습니다.'
    return errs
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const errs = validate()
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setIsLoading(true)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/profile`,
      },
    })

    setIsLoading(false)

    if (authError) {
      if (authError.message.includes('User already registered')) {
        setFieldErrors({ email: '이미 가입된 이메일입니다. 로그인을 시도해보세요.' })
      } else {
        setError('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
      return
    }

    setStep('verify')
  }

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-[#fdfcff] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-violet-100 rounded-2xl">
              <CheckCircle className="w-10 h-10 text-violet-600" strokeWidth={1.5} />
            </div>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">이메일을 확인해주세요</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            <strong className="text-gray-900">{email}</strong>으로
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-8">
            인증 링크를 보내드렸습니다.
            <br />
            메일함에서 링크를 클릭하면 가입이 완료됩니다.
          </p>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-amber-800 mb-1">메일이 오지 않나요?</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              스팸 메일함을 확인하거나, 몇 분 후 다시 시도해주세요.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-700"
          >
            로그인으로 돌아가기
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-black text-gray-900 mb-1">회원가입</h1>
          <p className="text-sm text-gray-500">가입 후 구독 및 내역 관리가 가능합니다.</p>
        </div>

        {/* 에러 */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-sm text-red-700">{error}</p>
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
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
              }}
              placeholder="example@email.com"
              className={cn(
                'w-full px-4 py-3 rounded-xl border bg-white text-sm text-gray-900',
                'placeholder:text-gray-400 outline-none transition-all',
                'focus:border-violet-400 focus:ring-2 focus:ring-violet-100',
                fieldErrors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200'
              )}
            />
            {fieldErrors.email && (
              <p className="mt-1.5 text-xs text-red-500">{fieldErrors.email}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
              비밀번호 <span className="text-gray-400 font-normal">(8자 이상)</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }))
                }}
                placeholder="비밀번호 입력"
                className={cn(
                  'w-full px-4 py-3 pr-11 rounded-xl border bg-white text-sm text-gray-900',
                  'placeholder:text-gray-400 outline-none transition-all',
                  'focus:border-violet-400 focus:ring-2 focus:ring-violet-100',
                  fieldErrors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200'
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
            {fieldErrors.password && (
              <p className="mt-1.5 text-xs text-red-500">{fieldErrors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1.5">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                id="passwordConfirm"
                type={showPasswordConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={passwordConfirm}
                onChange={(e) => {
                  setPasswordConfirm(e.target.value)
                  if (fieldErrors.confirm) setFieldErrors((p) => ({ ...p, confirm: undefined }))
                }}
                placeholder="비밀번호 재입력"
                className={cn(
                  'w-full px-4 py-3 pr-11 rounded-xl border bg-white text-sm text-gray-900',
                  'placeholder:text-gray-400 outline-none transition-all',
                  'focus:border-violet-400 focus:ring-2 focus:ring-violet-100',
                  fieldErrors.confirm ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                aria-label={showPasswordConfirm ? '비밀번호 숨기기' : '비밀번호 보기'}
              >
                {showPasswordConfirm
                  ? <EyeOff className="w-4 h-4" strokeWidth={1.8} />
                  : <Eye className="w-4 h-4" strokeWidth={1.8} />
                }
              </button>
            </div>
            {fieldErrors.confirm && (
              <p className="mt-1.5 text-xs text-red-500">{fieldErrors.confirm}</p>
            )}
          </div>

          {/* 가입 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3.5 mt-2',
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
                처리 중...
              </span>
            ) : (
              <>
                가입하기
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* 로그인 링크 */}
        <p className="mt-6 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="font-bold text-violet-600 hover:text-violet-700">
            로그인
          </Link>
        </p>

      </div>
    </div>
  )
}
