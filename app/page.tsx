import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap } from 'lucide-react'
import { CATEGORIES, SUBSCRIPTION_PRICE } from '@/constants/categories'
import { formatPrice } from '@/lib/utils'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* 히어로 섹션 */}
      <section className="relative bg-gradient-to-br from-violet-50 via-white to-indigo-50 py-20 md:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-indigo-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="inline-block text-xs font-semibold tracking-widest text-violet-600 bg-violet-100 rounded-full px-4 py-1.5 mb-6">
            AI 기반 사주 분석
          </p>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
            생년월일로 알아보는<br />
            <span className="text-violet-600">나의 운명</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto">
            전통 사주명리학과 AI가 만나 완성하는 정밀 분석.<br />
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
        </div>
      </section>

      {/* 특징 */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
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
              className="flex flex-col items-start gap-3 p-6 rounded-2xl border border-gray-100 hover:border-violet-200 hover:bg-violet-50/30 transition-colors"
            >
              <div className="p-2.5 bg-violet-100 rounded-xl">{item.icon}</div>
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 카테고리 목록 */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-center">
            무엇이 궁금하신가요?
          </h2>
          <p className="text-sm text-gray-500 text-center mb-10">
            카테고리를 선택하면 무료 맛보기를 바로 확인할 수 있습니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:border-violet-300 hover:shadow-md hover:shadow-violet-100 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full shrink-0 ml-2">
                    {formatPrice(cat.price)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{cat.description}</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1} />
                  <span className="font-medium text-gray-600">{cat.avgRating.toFixed(1)}</span>
                  <span className="text-gray-300">|</span>
                  <span>리뷰 {cat.reviewCount.toLocaleString()}개</span>
                </div>
              </Link>
            ))}

            {/* 구독 카드 */}
            <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-violet-200 mb-1">BEST VALUE</p>
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
        </div>
      </section>
    </div>
  )
}
