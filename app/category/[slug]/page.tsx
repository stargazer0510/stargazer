import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronLeft, Star, Info } from 'lucide-react'
import { CATEGORY_MAP, CATEGORY_ICONS, CATEGORY_HOOKS } from '@/constants/categories'
import { formatPrice } from '@/lib/utils'
import type { CategorySlug } from '@/types'
import SajuInputForm from '@/components/saju/SajuInputForm'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = CATEGORY_MAP[slug as CategorySlug]
  if (!category) return {}
  return {
    title: category.name,
    description: CATEGORY_HOOKS[slug as CategorySlug] ?? category.description,
  }
}

const CATEGORY_NOTICES: Partial<Record<CategorySlug, string[]>> = {
  compatibility: ['두 사람의 생년월일을 모두 정확히 입력해야 분석이 가능합니다.'],
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = CATEGORY_MAP[slug as CategorySlug]

  if (!category || !category.isActive) notFound()

  const Icon = CATEGORY_ICONS[slug as CategorySlug]
  const hook = CATEGORY_HOOKS[slug as CategorySlug]
  const notices = CATEGORY_NOTICES[slug as CategorySlug] ?? []

  const baseNotices = [
    '생년월일과 성별을 정확히 입력할수록 정밀한 분석이 가능합니다.',
    '무료 맛보기는 입력 즉시 확인할 수 있습니다.',
    'AI 프리미엄 분석은 결제 후 Claude AI가 실시간으로 생성합니다.',
  ]

  return (
    <div className="min-h-screen bg-[#fdfcff]">

      {/* 상단 네비 바 */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100/80 sticky top-14 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <Link
            href="/"
            className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700 shrink-0"
            aria-label="홈으로"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </Link>
          <span className="text-xs text-gray-400">홈</span>
          <span className="text-xs text-gray-300">/</span>
          <span className="text-xs font-semibold text-gray-700 truncate">{category.name}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-5">

        {/* 카테고리 소개 */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-violet-500/20">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" aria-hidden />

          <div className="relative flex items-start gap-4">
            <div className="shrink-0 p-3 bg-white/15 rounded-2xl backdrop-blur-sm">
              <Icon className="w-6 h-6 text-white" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black mb-1 leading-tight">{category.name}</h1>
              {hook && (
                <p className="text-violet-100 text-sm leading-relaxed mb-4 font-medium">
                  {hook}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-lg font-black">{formatPrice(category.price)}</span>
                <span className="w-px h-4 bg-violet-400/60" aria-hidden />
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" strokeWidth={1} />
                  <span className="font-bold">{category.avgRating.toFixed(1)}</span>
                  <span className="text-violet-200 text-xs">
                    ({category.reviewCount.toLocaleString()}개 리뷰)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 이용 안내 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-violet-500 shrink-0" strokeWidth={1.8} />
            <h2 className="text-sm font-bold text-gray-700">이용 안내</h2>
          </div>
          <ul className="space-y-2">
            {[...baseNotices, ...notices].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-500 leading-relaxed">
                <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-violet-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 입력 폼 영역 */}
        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-3 px-1">
            {slug === 'compatibility'
              ? '두 사람의 정보를 입력해주세요'
              : '생년월일 정보를 입력해주세요'}
          </h2>
          <SajuInputForm category={category} />
        </div>

      </div>
    </div>
  )
}
