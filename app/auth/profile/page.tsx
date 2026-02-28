'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { User, CalendarDays, Clock, Save, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { BIRTH_TIMES } from '@/constants/categories'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import type { Profile, Gender, BirthTime } from '@/types'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => CURRENT_YEAR - i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

function getDaysInMonth(year: string, month: string): number {
  if (!year || !month) return 31
  return new Date(parseInt(year), parseInt(month), 0).getDate()
}

interface FormState {
  nickname: string
  birthYear: string
  birthMonth: string
  birthDay: string
  gender: Gender | ''
  birthTime: BirthTime | ''
}

type FormErrors = Partial<Record<keyof FormState, string>>

const emptyForm: FormState = {
  nickname: '',
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  gender: '',
  birthTime: '',
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [existingProfile, setExistingProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [canEdit, setCanEdit] = useState(true)
  const [nextEditDate, setNextEditDate] = useState<string | null>(null)

  const days = useMemo(
    () => Array.from({ length: getDaysInMonth(form.birthYear, form.birthMonth) }, (_, i) => i + 1),
    [form.birthYear, form.birthMonth]
  )

  // 인증 확인 + 기존 프로필 로드
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.replace('/auth/login?next=/auth/profile')
        return
      }

      setUserId(user.id)

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setExistingProfile(profile as Profile)

        // 수정 제한 체크 (30일)
        if (profile.last_edited_at) {
          const lastEdited = new Date(profile.last_edited_at)
          const diffMs = Date.now() - lastEdited.getTime()
          const diffDays = diffMs / (1000 * 60 * 60 * 24)
          if (diffDays < 30) {
            setCanEdit(false)
            const next = new Date(lastEdited.getTime() + 30 * 24 * 60 * 60 * 1000)
            setNextEditDate(next.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }))
          }
        }

        // 폼 초기값 세팅
        if (profile.birth_date) {
          const [y, m, d] = (profile.birth_date as string).split('-')
          setForm({
            nickname: profile.nickname ?? '',
            birthYear: y,
            birthMonth: String(parseInt(m)),
            birthDay: String(parseInt(d)),
            gender: profile.gender ?? '',
            birthTime: profile.birth_time ?? '',
          })
        }
      }

      setIsLoading(false)
    }

    loadProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!form.nickname.trim()) errs.nickname = '닉네임을 입력해주세요.'
    else if (form.nickname.length > 10) errs.nickname = '닉네임은 10자 이내로 입력해주세요.'
    if (!form.birthYear) errs.birthYear = '출생 연도를 선택해주세요.'
    if (!form.birthMonth) errs.birthMonth = '출생 월을 선택해주세요.'
    if (!form.birthDay) errs.birthDay = '출생 일을 선택해주세요.'
    if (!form.gender) errs.gender = '성별을 선택해주세요.'
    if (!form.birthTime) errs.birthTime = '태어난 시간을 선택해주세요.'
    return errs
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)

    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    if (!userId) return
    setIsSaving(true)

    const y = form.birthYear.padStart(4, '0')
    const m = form.birthMonth.padStart(2, '0')
    const d = form.birthDay.padStart(2, '0')
    const birthDate = `${y}-${m}-${d}`

    const payload = {
      id: userId,
      nickname: form.nickname.trim(),
      birth_date: birthDate,
      gender: form.gender,
      birth_time: form.birthTime,
      is_complete: true,
      last_edited_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' })

    setIsSaving(false)

    if (error) {
      setSaveError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      return
    }

    // 신규 가입이면 홈으로, 수정이면 마이페이지로
    router.push(existingProfile?.isComplete ? '/mypage' : '/')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fdfcff] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-6 h-6 text-violet-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm text-gray-500">불러오는 중...</p>
        </div>
      </div>
    )
  }

  const isNewProfile = !existingProfile?.isComplete

  return (
    <div className="min-h-screen bg-[#fdfcff]">
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              <User className="w-5 h-5 text-violet-600" strokeWidth={1.8} />
            </div>
            <h1 className="text-xl font-black text-gray-900">
              {isNewProfile ? '프로필 설정' : '프로필 수정'}
            </h1>
          </div>
          {isNewProfile ? (
            <p className="text-sm text-gray-500 leading-relaxed">
              사주 분석을 위한 기본 정보를 입력해주세요. 구독 이용 시 이 정보로 분석됩니다.
            </p>
          ) : (
            <p className="text-sm text-gray-500 leading-relaxed">
              프로필은 30일에 한 번 수정할 수 있습니다.
            </p>
          )}
        </div>

        {/* 수정 불가 안내 */}
        {!canEdit && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" strokeWidth={1.8} />
            <div>
              <p className="text-sm font-semibold text-amber-800 mb-0.5">수정 제한 중</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                {nextEditDate}부터 다시 수정할 수 있습니다. (30일 제한)
              </p>
            </div>
          </div>
        )}

        {/* 에러 */}
        {saveError && (
          <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <p className="text-sm text-red-700">{saveError}</p>
          </div>
        )}

        <form onSubmit={handleSave} noValidate>
          <div className="space-y-5">

            {/* 닉네임 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-violet-500" strokeWidth={1.8} />
                <h2 className="text-sm font-bold text-gray-700">닉네임</h2>
              </div>
              <input
                type="text"
                value={form.nickname}
                onChange={(e) => setField('nickname', e.target.value)}
                disabled={!canEdit}
                placeholder="사용할 닉네임 (10자 이내)"
                maxLength={10}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border bg-white text-sm text-gray-900',
                  'placeholder:text-gray-400 outline-none transition-all',
                  'focus:border-violet-400 focus:ring-2 focus:ring-violet-100',
                  errors.nickname ? 'border-red-300' : 'border-gray-200',
                  !canEdit && 'bg-gray-50 cursor-not-allowed opacity-60'
                )}
              />
              {errors.nickname && (
                <p className="mt-1.5 text-xs text-red-500">{errors.nickname}</p>
              )}
            </div>

            {/* 생년월일 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-4 h-4 text-violet-500" strokeWidth={1.8} />
                <h2 className="text-sm font-bold text-gray-700">생년월일 및 성별</h2>
              </div>

              {/* 날짜 */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-2">생년월일</label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={form.birthYear}
                    onChange={(e) => setField('birthYear', e.target.value)}
                    disabled={!canEdit}
                    hasError={!!errors.birthYear}
                    aria-label="출생 연도"
                  >
                    <option value="">연도</option>
                    {YEARS.map((y) => (
                      <option key={y} value={String(y)}>{y}년</option>
                    ))}
                  </Select>
                  <Select
                    value={form.birthMonth}
                    onChange={(e) => {
                      setField('birthMonth', e.target.value)
                      setField('birthDay', '')
                    }}
                    disabled={!canEdit}
                    hasError={!!errors.birthMonth}
                    aria-label="출생 월"
                  >
                    <option value="">월</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={String(m)}>{m}월</option>
                    ))}
                  </Select>
                  <Select
                    value={form.birthDay}
                    onChange={(e) => setField('birthDay', e.target.value)}
                    disabled={!canEdit}
                    hasError={!!errors.birthDay}
                    aria-label="출생 일"
                  >
                    <option value="">일</option>
                    {days.map((d) => (
                      <option key={d} value={String(d)}>{d}일</option>
                    ))}
                  </Select>
                </div>
                {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.birthYear ?? errors.birthMonth ?? errors.birthDay}
                  </p>
                )}
              </div>

              {/* 성별 */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">성별</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['남', '여'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      disabled={!canEdit}
                      onClick={() => setField('gender', g)}
                      className={cn(
                        'py-2.5 rounded-xl text-sm font-medium border transition-all',
                        form.gender === g
                          ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-violet-300 hover:bg-violet-50',
                        !canEdit && 'opacity-60 cursor-not-allowed'
                      )}
                    >
                      {g === '남' ? '남성' : '여성'}
                    </button>
                  ))}
                </div>
                {errors.gender && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.gender}</p>
                )}
              </div>
            </div>

            {/* 태어난 시간 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-violet-500" strokeWidth={1.8} />
                <h2 className="text-sm font-bold text-gray-700">태어난 시간</h2>
              </div>
              <Select
                value={form.birthTime}
                onChange={(e) => setField('birthTime', e.target.value as BirthTime)}
                disabled={!canEdit}
                hasError={!!errors.birthTime}
                aria-label="태어난 시간"
              >
                <option value="">태어난 시간 선택</option>
                {BIRTH_TIMES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
              {errors.birthTime && (
                <p className="mt-1.5 text-xs text-red-500">{errors.birthTime}</p>
              )}
              <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                시간을 모르면 &apos;모름&apos;을 선택해도 됩니다.
                구독 이용 시 이 정보로만 AI 분석이 생성됩니다.
              </p>
            </div>

          </div>

          {/* 저장 버튼 */}
          {canEdit && (
            <button
              type="submit"
              disabled={isSaving}
              className={cn(
                'mt-6 w-full flex items-center justify-center gap-2 py-3.5',
                'bg-gradient-to-b from-violet-600 to-violet-700',
                'hover:from-violet-500 hover:to-violet-600',
                'text-white font-bold rounded-xl text-sm transition-all',
                'shadow-lg shadow-violet-500/25',
                'disabled:opacity-60 disabled:cursor-not-allowed'
              )}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  저장 중...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4" strokeWidth={2} />
                  {isNewProfile ? '프로필 저장하고 시작하기' : '변경사항 저장'}
                </>
              )}
            </button>
          )}
        </form>

      </div>
    </div>
  )
}
