'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { ArrowRight, User, Users } from 'lucide-react'
import { BIRTH_TIMES } from '@/constants/categories'
import { formatPrice, cn } from '@/lib/utils'
import { Select } from '@/components/ui/select'
import type { Category } from '@/types'

// ─── Zod 스키마 ──────────────────────────────────────────────
const BIRTH_TIME_VALUES = BIRTH_TIMES.map((t) => t.value) as [string, ...string[]]

const personSchema = z.object({
  birthYear: z.string().min(1, '출생 연도를 선택해주세요'),
  birthMonth: z.string().min(1, '출생 월을 선택해주세요'),
  birthDay: z.string().min(1, '출생 일을 선택해주세요'),
  gender: z.enum(['남', '여'], { error: '성별을 선택해주세요' }),
  birthTime: z.enum(BIRTH_TIME_VALUES, { error: '태어난 시간을 선택해주세요' }),
})

type PersonData = {
  birthYear: string
  birthMonth: string
  birthDay: string
  gender: string
  birthTime: string
}

type PersonErrors = Partial<Record<keyof PersonData, string>>

// ─── 헬퍼: 월/연도에 맞는 일 수 계산 ─────────────────────────
function getDaysInMonth(year: string, month: string): number {
  if (!year || !month) return 31
  return new Date(parseInt(year), parseInt(month), 0).getDate()
}

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1930 + 1 }, (_, i) => CURRENT_YEAR - i)
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1)

const emptyPerson: PersonData = {
  birthYear: '',
  birthMonth: '',
  birthDay: '',
  gender: '',
  birthTime: '',
}

// ─── 단일 인물 입력 필드 ──────────────────────────────────────
interface PersonFieldsProps {
  label?: string
  data: PersonData
  errors: PersonErrors
  onChange: (field: keyof PersonData, value: string) => void
  showLabel?: boolean
}

function PersonFields({ label, data, errors, onChange, showLabel = false }: PersonFieldsProps) {
  const days = useMemo(
    () =>
      Array.from(
        { length: getDaysInMonth(data.birthYear, data.birthMonth) },
        (_, i) => i + 1
      ),
    [data.birthYear, data.birthMonth]
  )

  return (
    <div>
      {showLabel && label && (
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-violet-100 rounded-lg">
            <User className="w-4 h-4 text-violet-600" strokeWidth={1.8} />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
        </div>
      )}

      <div className="space-y-4">
        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            생년월일
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* 년도 */}
            <div>
              <Select
                value={data.birthYear}
                onChange={(e) => onChange('birthYear', e.target.value)}
                hasError={!!errors.birthYear}
                aria-label="출생 연도"
              >
                <option value="">연도</option>
                {YEARS.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}년
                  </option>
                ))}
              </Select>
            </div>

            {/* 월 */}
            <div>
              <Select
                value={data.birthMonth}
                onChange={(e) => {
                  onChange('birthMonth', e.target.value)
                  // 월 변경 시 일 초기화
                  onChange('birthDay', '')
                }}
                hasError={!!errors.birthMonth}
                aria-label="출생 월"
              >
                <option value="">월</option>
                {MONTHS.map((m) => (
                  <option key={m} value={String(m)}>
                    {m}월
                  </option>
                ))}
              </Select>
            </div>

            {/* 일 */}
            <div>
              <Select
                value={data.birthDay}
                onChange={(e) => onChange('birthDay', e.target.value)}
                hasError={!!errors.birthDay}
                aria-label="출생 일"
              >
                <option value="">일</option>
                {days.map((d) => (
                  <option key={d} value={String(d)}>
                    {d}일
                  </option>
                ))}
              </Select>
            </div>
          </div>
          {/* 생년월일 에러 메시지 (첫 번째 에러만 표시) */}
          {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors.birthYear || errors.birthMonth || errors.birthDay}
            </p>
          )}
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            성별
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['남', '여'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onChange('gender', g)}
                className={cn(
                  'py-2.5 rounded-xl text-sm font-medium border transition-all',
                  data.gender === g
                    ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-violet-300 hover:bg-violet-50'
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

        {/* 태어난 시간 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            태어난 시간
          </label>
          <Select
            value={data.birthTime}
            onChange={(e) => onChange('birthTime', e.target.value)}
            hasError={!!errors.birthTime}
            aria-label="태어난 시간"
          >
            <option value="">태어난 시간 선택</option>
            {BIRTH_TIMES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
          {errors.birthTime && (
            <p className="mt-1.5 text-xs text-red-500">{errors.birthTime}</p>
          )}
          <div className="mt-2 bg-amber-50/80 border border-amber-100 rounded-xl px-3 py-2 space-y-0.5">
            <p className="text-xs text-amber-700 font-semibold">한국 표준시(KST) 기준 안내</p>
            <p className="text-xs text-amber-600/90 leading-relaxed">
              표시된 시각은 KST(UTC+9) 기준입니다. 전통 시각보다 30분 더한 값으로,
              예를 들어 오전 12시 출생이면 오시(11:30~13:30)를 선택하세요.
            </p>
            <p className="text-xs text-amber-500">시간을 모르면 &apos;모름&apos;을 선택해도 됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 메인 폼 컴포넌트 ─────────────────────────────────────────
interface SajuInputFormProps {
  category: Category
}

export default function SajuInputForm({ category }: SajuInputFormProps) {
  const router = useRouter()
  const isCompatibility = category.slug === 'compatibility'

  const [person1, setPerson1] = useState<PersonData>({ ...emptyPerson })
  const [person2, setPerson2] = useState<PersonData>({ ...emptyPerson })
  const [errors1, setErrors1] = useState<PersonErrors>({})
  const [errors2, setErrors2] = useState<PersonErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange1 = (field: keyof PersonData, value: string) => {
    setPerson1((prev) => ({ ...prev, [field]: value }))
    if (errors1[field]) setErrors1((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleChange2 = (field: keyof PersonData, value: string) => {
    setPerson2((prev) => ({ ...prev, [field]: value }))
    if (errors2[field]) setErrors2((prev) => ({ ...prev, [field]: undefined }))
  }

  function validatePerson(data: PersonData): PersonErrors {
    const result = personSchema.safeParse(data)
    if (result.success) return {}
    const errs: PersonErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof PersonData
      if (!errs[field]) errs[field] = issue.message
    }
    return errs
  }

  function buildBirthDate(data: PersonData): string {
    const y = data.birthYear.padStart(4, '0')
    const m = data.birthMonth.padStart(2, '0')
    const d = data.birthDay.padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const e1 = validatePerson(person1)
    const e2 = isCompatibility ? validatePerson(person2) : {}
    setErrors1(e1)
    setErrors2(e2)

    if (Object.keys(e1).length > 0 || Object.keys(e2).length > 0) return

    setIsSubmitting(true)

    const params = new URLSearchParams({
      birthDate: buildBirthDate(person1),
      gender: person1.gender,
      birthTime: person1.birthTime,
    })
    if (isCompatibility) {
      params.set('p2BirthDate', buildBirthDate(person2))
      params.set('p2Gender', person2.gender)
      params.set('p2BirthTime', person2.birthTime)
    }

    router.push(`/result/free/${category.slug}?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* 가격 요약 카드 */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs text-violet-500 font-medium mb-0.5">무료 맛보기 포함</p>
          <p className="text-sm text-gray-700">
            AI 프리미엄 분석{' '}
            <span className="font-bold text-violet-700">{formatPrice(category.price)}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">결제 후 즉시 확인</p>
        </div>
      </div>

      {isCompatibility ? (
        /* 궁합: 2인 입력 */
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <PersonFields
              label="첫 번째 사람 (나)"
              data={person1}
              errors={errors1}
              onChange={handleChange1}
              showLabel
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-100 rounded-full">
              <Users className="w-3.5 h-3.5 text-violet-600" strokeWidth={1.8} />
              <span className="text-xs font-medium text-violet-700">궁합 비교</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <PersonFields
              label="두 번째 사람 (상대방)"
              data={person2}
              errors={errors2}
              onChange={handleChange2}
              showLabel
            />
          </div>
        </div>
      ) : (
        /* 일반: 1인 입력 */
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <PersonFields
            data={person1}
            errors={errors1}
            onChange={handleChange1}
          />
        </div>
      )}

      {/* 제출 버튼 */}
      <div className="mt-6 space-y-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-3.5 px-6',
            'bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl',
            'transition-colors text-sm md:text-base',
            'disabled:opacity-60 disabled:cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              분석 중...
            </span>
          ) : (
            <>
              무료 맛보기 확인하기
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400">
          무료 맛보기 먼저 확인 후 AI 프리미엄 분석을 결제할 수 있습니다.
        </p>
      </div>
    </form>
  )
}
