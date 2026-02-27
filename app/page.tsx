import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap } from 'lucide-react'
import {
  CATEGORIES,
  CATEGORY_ICONS,
  MAIN_CATEGORY_SLUGS,
  SUBSCRIPTION_PRICE,
} from '@/constants/categories'
import { formatPrice } from '@/lib/utils'
import type { CategorySlug } from '@/types'

const mainCategories = MAIN_CATEGORY_SLUGS.map(
  (slug) => CATEGORIES.find((c) => c.slug === slug)!
)

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="inline-block text-xs font-semibold tracking-widest text-violet-600 bg-violet-100 rounded-full px-4 py-1.5 mb-6 uppercase">
            AI 기반 사주 분석
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
            생년월일로 알아보는
            <br />
            <span className="text-violet-600">나의 운명</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto">
            전통 사주명리학과 AI가 만나 완성하는 정밀 분석.
            <br />
            도화살부터 올해 운세까지, 궁금한 것을 확인해보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/category/yearly-fortune"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors text-sm md:text-base"
            >
              무료 맛보기 시작
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </Link>
            <Link
              href="/subscribe"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl border border-gray-200 transition-colors text-sm md:text-base"
            >
              1년 무제한 구독 보기
            </Link>
          </div>

          {/* 신뢰 지표 */}
          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1} />
              평균 별점 4.8
            </span>
            <span className="w-px h-3 bg-gray-200" aria-hidden />
            <span>누적 분석 1,157건</span>
            <span className="w-px h-3 bg-gray-200" aria-hidden />
            <span>즉시 결과 확인</span>
          </div>
        </div>
      </section>

      {/* 특징 3가지 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Zap className="w-5 h-5 text-violet-600" strokeWidth={1.8} />,
              title: '즉시 확인',
              desc: '결제 즉시 AI가 실시간으로 나만을 위한 사주를 분석합니다.',
            },
            {
              icon: <Shield className="w-5 h-5 text-violet-600" strokeWidth={1.8} />,
              title: '안전한 결제',
              desc: '토스페이먼츠 & 네이버페이로 안전하게 결제하세요.',
            },
            {
              icon: <Star className="w-5 h-5 text-violet-600" strokeWidth={1.8} />,
              title: '높은 만족도',
              desc: '실제 이용자들의 생생한 후기를 확인해보세요.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-start gap-3 p-5 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-colors"
            >
              <div className="p-2.5 bg-violet-100 rounded-xl">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 카테고리 그리드 */}
      <section className="py-16 px-4 bg-gray-50/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              무엇이 궁금하신가요?
            </h2>
            <p className="text-sm text-gray-500">
              카테고리를 선택하면 무료 맛보기를 바로 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug as CategorySlug]
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/60 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* 아이콘 */}
                    <div className="shrink-0 p-3 bg-violet-50 group-hover:bg-violet-100 rounded-xl transition-colors">
                      <Icon
                        className="w-5 h-5 text-violet-600"
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* 텍스트 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors text-[15px]">
                          {cat.name}
                        </h3>
                        <span className="shrink-0 text-xs font-semibold text-violet-600 bg-violet-50 group-hover:bg-violet-100 px-2.5 py-1 rounded-full transition-colors">
                          {formatPrice(cat.price)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed mb-3">
                        {cat.description}
                      </p>
                      {/* 별점 */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Star
                          className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                          strokeWidth={1}
                        />
                        <span className="font-semibold text-gray-700">
                          {cat.avgRating.toFixed(1)}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span>리뷰 {cat.reviewCount.toLocaleString()}개</span>
                      </div>
                    </div>
                  </div>

                  {/* 호버 시 CTA */}
                  <div className="mt-4 pt-4 border-t border-gray-50 group-hover:border-violet-100 transition-colors flex items-center justify-between">
                    <span className="text-xs text-gray-400 group-hover:text-violet-500 transition-colors">
                      무료 맛보기 포함
                    </span>
                    <span className="text-xs font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      분석 시작
                      <ArrowRight className="w-3 h-3" strokeWidth={2} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* 구독 배너 */}
          <div className="mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wider text-violet-200 mb-1 uppercase">
                  Best Value
                </p>
                <h3 className="text-xl font-bold mb-1">1년 무제한 구독</h3>
                <p className="text-sm text-violet-100 leading-relaxed">
                  전 카테고리 무제한 이용. 건당 결제보다 훨씬 경제적입니다.
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <p className="text-2xl font-bold">{formatPrice(SUBSCRIPTION_PRICE)}</p>
                <Link
                  href="/subscribe"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-white text-violet-700 hover:bg-violet-50 font-semibold rounded-xl text-sm transition-colors"
                >
                  구독 시작하기
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
