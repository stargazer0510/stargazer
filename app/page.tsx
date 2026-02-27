import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap, Check, ChevronRight } from 'lucide-react'
import {
  CATEGORIES,
  CATEGORY_ICONS,
  CATEGORY_HOOKS,
  MAIN_CATEGORY_SLUGS,
  SUBSCRIPTION_PRICE,
} from '@/constants/categories'
import { formatPrice } from '@/lib/utils'
import type { CategorySlug } from '@/types'

const mainCategories = MAIN_CATEGORY_SLUGS.map(
  (slug) => CATEGORIES.find((c) => c.slug === slug)!
)

const PAIN_POINTS = [
  '이 사람이 나의 진짜 인연인지 확신이 없어요',
  '왜 나는 항상 연애가 잘 안 풀릴까요',
  '헤어진 그 사람과 다시 만날 수 있을까요',
  '올해 중요한 결정, 지금 이 타이밍이 맞을까요',
]

const STEPS = [
  {
    num: '01',
    title: '생년월일 입력',
    desc: '이름도 별명도 필요 없습니다. 생년월일, 성별, 태어난 시간 세 가지면 충분합니다.',
  },
  {
    num: '02',
    title: '무료 맛보기 확인',
    desc: '결제 없이 먼저 확인하세요. 내 사주의 방향성을 미리 읽어볼 수 있습니다.',
  },
  {
    num: '03',
    title: 'AI 프리미엄 분석',
    desc: '결제 즉시, Claude AI가 오직 나를 위한 깊이 있는 사주 분석을 실시간으로 생성합니다.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* ── 히어로 ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#fdfcff] py-24 md:py-32 px-4">
        {/* 배경 패턴 */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden
        />
        {/* 배경 블러 글로우 */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-violet-300/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 -right-24 w-[360px] h-[360px] bg-indigo-300/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-violet-600 bg-violet-100/80 border border-violet-200/60 rounded-full px-4 py-1.5 mb-7 uppercase">
            <Zap className="w-3 h-3" strokeWidth={2.5} />
            AI 기반 정밀 사주 분석
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-950 leading-[1.1] tracking-tight mb-6">
            운명을 미리 안다는 것,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              삶이 달라집니다
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-3 max-w-xl mx-auto">
            전통 사주명리학 수백 년의 지혜에 AI를 더했습니다.
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-10 max-w-xl mx-auto font-medium">
            연애·재회·궁합·올해 운세 — 내 생년월일이 말해주는 모든 것을 지금 확인하세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link
              href="/category/yearly-fortune"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-b from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 text-sm md:text-base"
            >
              지금 바로 확인하기
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/subscribe"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl border border-gray-200 hover:border-gray-300 transition-all text-sm md:text-base"
            >
              1년 무제한 구독 보기
              <ChevronRight className="w-4 h-4 text-gray-400" strokeWidth={2} />
            </Link>
          </div>

          {/* 신뢰 지표 */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1} />
              <span className="text-gray-600 font-semibold">평균 별점 4.8</span>
            </span>
            <span className="hidden sm:block w-px h-3 bg-gray-200" aria-hidden />
            <span>누적 분석 <span className="text-gray-600 font-semibold">1,157건</span></span>
            <span className="hidden sm:block w-px h-3 bg-gray-200" aria-hidden />
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-gray-400" strokeWidth={1.8} />
              결제 즉시 확인
            </span>
          </div>
        </div>
      </section>

      {/* ── 공감 페인포인트 ───────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              혹시 이런 고민을 하고 계신가요?
            </h2>
            <p className="text-sm text-gray-500">
              그 고민의 답이 이미 당신의 사주에 있을 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAIN_POINTS.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 p-5 bg-violet-50/60 border border-violet-100/80 rounded-2xl"
              >
                <span
                  className="shrink-0 text-3xl font-black text-violet-200 leading-none select-none mt-[-4px]"
                  aria-hidden
                >
                  "
                </span>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{point}</p>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            사주명리학은 수백 년간 이 질문들에 답해왔습니다. 이제 AI가 더 빠르고 정확하게 분석합니다.
          </p>
        </div>
      </section>

      {/* ── 카테고리 그리드 ───────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              무엇이 궁금하신가요?
            </h2>
            <p className="text-sm text-gray-500">
              카테고리를 선택하면 무료 맛보기를 즉시 확인할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mainCategories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.slug as CategorySlug]
              const hook = CATEGORY_HOOKS[cat.slug as CategorySlug]
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group relative bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-violet-200/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  {/* 호버 시 상단 액센트 라인 */}
                  <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-3xl bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden />

                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 bg-violet-50 group-hover:bg-violet-100 rounded-2xl transition-colors">
                      <Icon className="w-5 h-5 text-violet-600" strokeWidth={1.8} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-gray-900 group-hover:text-violet-700 transition-colors text-[15px]">
                          {cat.name}
                        </h3>
                        <span className="shrink-0 text-xs font-bold text-violet-600 bg-violet-50 group-hover:bg-violet-100 px-2.5 py-1 rounded-full transition-colors">
                          {formatPrice(cat.price)}
                        </span>
                      </div>

                      {/* 훅 문구 */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-3 font-medium">
                        {hook}
                      </p>

                      {/* 별점 */}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" strokeWidth={1} />
                        <span className="font-bold text-gray-700">{cat.avgRating.toFixed(1)}</span>
                        <span className="text-gray-300">|</span>
                        <span>리뷰 {cat.reviewCount.toLocaleString()}개</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-50 group-hover:border-violet-100 transition-colors flex items-center justify-between">
                    <span className="text-xs text-gray-400 group-hover:text-violet-500 transition-colors">
                      무료 맛보기 포함
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-violet-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      분석 시작
                      <ArrowRight className="w-3 h-3" strokeWidth={2.5} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 이용 방법 ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              3단계면 끝납니다
            </h2>
            <p className="text-sm text-gray-500">복잡한 절차 없이, 30초 안에 내 사주를 분석할 수 있습니다.</p>
          </div>

          <div className="relative">
            {/* 연결선 (데스크탑) */}
            <div
              className="absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-violet-200 via-violet-300 to-violet-200 hidden md:block"
              aria-hidden
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STEPS.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center gap-3">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white font-black text-lg shadow-lg shadow-violet-500/25">
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1.5">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 구독 배너 ─────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50/60">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-violet-500/20">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" aria-hidden />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/2" aria-hidden />

            <div className="relative">
              <p className="text-xs font-bold tracking-widest text-violet-200 mb-3 uppercase">
                가장 현명한 선택
              </p>
              <h2 className="text-2xl md:text-3xl font-black mb-3 leading-tight">
                4번 이상 쓸 예정이라면,
                <br />
                구독이 훨씬 유리합니다
              </h2>
              <p className="text-violet-100 text-sm leading-relaxed mb-2">
                건당 결제 시 최소 <span className="text-white font-bold">3,900원</span>. 4번이면
                이미 <span className="text-white font-bold">15,600원</span>.
              </p>
              <p className="text-violet-100 text-sm leading-relaxed mb-6">
                1년 무제한 구독은 단{' '}
                <span className="text-white font-bold text-base">
                  {formatPrice(SUBSCRIPTION_PRICE)}
                </span>
                으로 전 카테고리 무제한 이용.
              </p>

              {/* 혜택 목록 */}
              <ul className="flex flex-col gap-2 mb-7">
                {[
                  '전 카테고리 무제한 이용',
                  '구독 기간 내 프로필 기반 분석 무제한',
                  '신규 카테고리 추가 시 자동 포함',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 text-sm text-violet-100">
                    <Check className="w-4 h-4 shrink-0 text-violet-300" strokeWidth={2.5} />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/subscribe"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-violet-700 hover:bg-violet-50 font-bold rounded-2xl text-sm transition-colors shadow-sm"
                >
                  구독 시작하기
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </Link>
                <p className="text-xs text-violet-200">회원가입 후 바로 이용 가능합니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
