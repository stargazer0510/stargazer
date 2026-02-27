import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronLeft, Star } from 'lucide-react'
import { CATEGORY_MAP, CATEGORY_ICONS } from '@/constants/categories'
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
    description: category.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = CATEGORY_MAP[slug as CategorySlug]

  if (!category || !category.isActive) notFound()

  const Icon = CATEGORY_ICONS[slug as CategorySlug]

  return (
    <div className="min-h-screen bg-gray-50/60">
      {/* 상단 헤더 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            aria-label="홈으로 돌아가기"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </Link>
          <h1 className="font-semibold text-gray-900 text-sm">{category.name}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* 카테고리 소개 카드 */}
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-3 bg-white rounded-xl shadow-sm">
              <Icon className="w-6 h-6 text-violet-600" strokeWidth={1.8} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {category.description}
              </p>

              {/* 가격 + 별점 */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-base font-bold text-violet-700">
                  {formatPrice(category.price)}
                </span>
                <span className="w-px h-4 bg-violet-200" aria-hidden />
                <div className="flex items-center gap-1 text-sm">
                  <Star
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                    strokeWidth={1}
                  />
                  <span className="font-semibold text-gray-800">
                    {category.avgRating.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-xs">
                    ({category.reviewCount.toLocaleString()}개 리뷰)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 이용 안내 */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">이용 안내</h3>
          <ul className="space-y-2">
            {[
              '생년월일과 성별을 정확히 입력할수록 정밀한 분석이 가능합니다.',
              '무료 맛보기는 즉시 확인할 수 있습니다.',
              'AI 프리미엄 분석은 결제 후 실시간으로 생성됩니다.',
              ...(slug === 'compatibility'
                ? ['두 사람의 정보를 모두 입력해야 궁합 분석이 가능합니다.']
                : []),
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-violet-400" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 입력 폼 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 px-1">
            {slug === 'compatibility' ? '두 사람의 정보를 입력해주세요' : '생년월일 정보를 입력해주세요'}
          </h3>
          <SajuInputForm category={category} />
        </div>
      </div>
    </div>
  )
}
