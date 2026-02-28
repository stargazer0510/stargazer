import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ChevronLeft, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { getFreeReading } from '@/lib/saju/getFreeReading'
import { CATEGORY_MAP, CATEGORY_ICONS } from '@/constants/categories'
import { formatPrice } from '@/lib/utils'
import type { CategorySlug, ReadingContent, ReadingSection } from '@/types'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    birthDate?: string
    gender?: string
    birthTime?: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const cat = CATEGORY_MAP[slug as CategorySlug]
  return { title: cat ? `${cat.name} 무료 결과` : '무료 결과' }
}

// ─── 사주팔자 기둥 셀 ──────────────────────────────────────

interface PillarCellProps {
  label: string
  gan: string
  zhi: string
  highlight?: boolean
}

function PillarCell({ label, gan, zhi, highlight }: PillarCellProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-bold text-violet-300 tracking-widest uppercase">
        {label}
      </span>
      {/* 천간 */}
      <div
        className={[
          'flex items-center justify-center w-14 h-14 rounded-2xl text-xl font-black transition-all',
          highlight
            ? 'bg-white text-violet-700 shadow-lg shadow-violet-500/20'
            : 'bg-white/10 text-white',
        ].join(' ')}
      >
        {gan === '?' ? (
          <span className="text-white/30 text-base font-medium">?</span>
        ) : (
          <span>{gan}</span>
        )}
      </div>
      {/* 지지 */}
      <div
        className={[
          'flex items-center justify-center w-14 h-14 rounded-2xl text-xl font-black transition-all',
          highlight
            ? 'bg-white text-indigo-700 shadow-lg shadow-indigo-500/20'
            : 'bg-white/10 text-white',
        ].join(' ')}
      >
        {zhi === '?' ? (
          <span className="text-white/30 text-base font-medium">?</span>
        ) : (
          <span>{zhi}</span>
        )}
      </div>
    </div>
  )
}

// ─── 무료 공개 섹션 카드 ────────────────────────────────────

function ReadingCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 mb-3 text-sm">{title}</h3>
      <p className="text-sm text-gray-600 leading-[1.75]">{body}</p>
    </div>
  )
}

// ─── 블러 처리된 프리미엄 섹션 카드 ───────────────────────
// 제목은 선명하게, 본문은 blur 처리해서 내용이 있음을 보여주되 읽을 수 없게

function PremiumLockedCard({ section }: { section: ReadingSection }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* 잠금 뱃지 */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-0.5 bg-violet-100 rounded-full">
        <Lock className="w-2.5 h-2.5 text-violet-600" strokeWidth={2.5} />
        <span className="text-[10px] font-bold text-violet-600">잠금</span>
      </div>

      <div className="p-5">
        {/* 제목: 선명하게 표시 */}
        <h3 className="font-bold text-gray-900 mb-3 text-sm pr-14">{section.title}</h3>

        {/* 본문: blur 처리 */}
        <div className="relative select-none" aria-hidden>
          <p className="text-sm text-gray-600 leading-[1.75] blur-[4px]">
            {section.body}
          </p>
          {/* 추가 오버레이: 하단 페이드 */}
          <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/80 to-transparent" />
        </div>
      </div>
    </div>
  )
}

// ─── 카테고리별 기본 블러 섹션 (DB 데이터 없을 때) ─────────

const DEFAULT_PREMIUM_SECTIONS: Record<string, ReadingSection[]> = {
  'yearly-fortune': [
    { title: '재물·금전운 심층 분석', body: '올해의 재물운은 전반적으로 상승 흐름을 보이고 있습니다. 특히 하반기에 예상치 못한 수입의 흐름이 감지되며, 투자와 저축의 균형이 중요한 시기입니다. 큰 지출이 예상되는 시기를 미리 파악하고 대비하는 것이 핵심입니다.' },
    { title: '직업·커리어와 결정적 시기', body: '올해는 커리어에서 중요한 전환점이 찾아옵니다. 오래 준비해온 것들이 빛을 발하는 시기로, 스스로에 대한 확신을 잃지 않는 것이 중요합니다. 특정 시기에 찾아오는 기회를 놓치지 않도록 주의를 기울이세요.' },
    { title: '월별 운세와 구체적 조언', body: '월별로 에너지의 흐름이 달라집니다. 강한 달에는 적극적으로 행동하고, 약한 달에는 내실을 다지는 것이 이상적입니다. 각 달의 구체적인 조언을 통해 1년을 전략적으로 설계해보세요.' },
  ],
  'doha-sal': [
    { title: '도화살의 구체적 발현 시기', body: '올해 도화 기운이 가장 강하게 발동하는 시기가 분명히 존재합니다. 이 시기를 미리 알고 준비하는 것과 그렇지 않은 것은 큰 차이를 만들어냅니다. 만남의 기회를 극대화할 수 있는 구체적인 시기와 장소를 분석했습니다.' },
    { title: '올해 연애운과 이성 인연', body: '도화살과 올해의 운세가 어떻게 결합되는지 분석합니다. 새로운 인연이 찾아오는 구체적인 시기, 현재 관계가 발전하는 타이밍, 그리고 주의해야 할 시기를 상세히 다룹니다.' },
    { title: '도화살 강화 전략과 주의사항', body: '타고난 도화 기운을 최대한 발휘하는 방법과, 반대로 도화살이 부정적으로 작용할 때 나타나는 신호를 알아두어야 합니다. 구체적인 행동 지침을 통해 올해 이성운을 완전히 내 편으로 만드세요.' },
  ],
  'reunion': [
    { title: '재회 가능성 — 구체적 수치 분석', body: '사주팔자를 기반으로 계산한 재회 가능성 지수와 그 근거를 상세히 설명합니다. 어떤 조건이 갖춰졌을 때 재회가 성사될 가능성이 높아지는지, 현실적인 분석을 제공합니다.' },
    { title: '재회 최적 타이밍과 접근법', body: '올해 재회를 시도한다면 언제, 어떤 방식으로 접근하는 것이 가장 효과적인지 분석합니다. 사주가 알려주는 최적의 연락 타이밍과 첫 만남 이후의 전략을 구체적으로 다룹니다.' },
    { title: '재회 후 관계 지속 가능성', body: '재회 자체보다 중요한 것은 재회 후의 관계입니다. 두 사람의 사주에서 발견되는 장기적인 궁합과, 이전과 다른 패턴을 만들기 위한 핵심 포인트를 짚어드립니다.' },
  ],
  'compatibility': [
    { title: '궁합 점수와 세부 영역 분석', body: '연애운, 결혼운, 재물 궁합, 성격 궁합, 장기적 발전 가능성을 각 영역별로 점수화하여 분석합니다. 어떤 부분에서 잘 맞고 어떤 부분에서 보완이 필요한지 상세하게 다룹니다.' },
    { title: '갈등 예방과 관계 발전 전략', body: '두 사람의 사주에서 예측되는 갈등 포인트와 이를 예방하는 방법을 분석합니다. 서로 다른 기운이 충돌하는 지점을 이해하면 관계가 한층 더 성숙해집니다.' },
    { title: '함께하면 좋은 시기와 주의 시기', body: '두 사람의 에너지가 가장 잘 맞는 시기와, 오해나 갈등이 생기기 쉬운 시기를 알아두면 관계를 훨씬 현명하게 이끌어갈 수 있습니다.' },
  ],
}

// ─── 메인 페이지 ─────────────────────────────────────────────

export default async function FreeResultPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams

  const birthDate = sp.birthDate
  const gender = sp.gender
  const birthTime = sp.birthTime

  if (!birthDate || !gender || !birthTime) {
    redirect(`/category/${slug}`)
  }

  const category = CATEGORY_MAP[slug as CategorySlug]
  if (!category || !category.isActive) notFound()

  const result = await getFreeReading(slug, birthDate, gender, birthTime)
  if (!result) notFound()

  const { sajuPillars, yearGan, yearZhi, reading, categoryPrice } = result
  const Icon = CATEGORY_ICONS[slug as CategorySlug]

  const content = reading?.content as ReadingContent | null
  const allSections = content?.sections ?? []

  // 무료: 앞 2개 섹션 / 잠금: 나머지 3개
  const freeSections = allSections.slice(0, 2)
  const premiumSections: ReadingSection[] =
    allSections.length > 2
      ? allSections.slice(2)
      : (DEFAULT_PREMIUM_SECTIONS[slug] ?? DEFAULT_PREMIUM_SECTIONS['yearly-fortune'])

  const hasFreeContent = freeSections.length > 0

  const paymentParams = new URLSearchParams({
    slug,
    birthDate,
    gender,
    birthTime,
  })

  return (
    <div className="min-h-screen bg-[#fdfcff]">

      {/* 상단 네비 */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-100/80 sticky top-14 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <Link
            href={`/category/${slug}`}
            className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700 shrink-0"
            aria-label="입력 폼으로"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </Link>
          <span className="text-xs text-gray-400">{category.name}</span>
          <span className="text-xs text-gray-300">/</span>
          <span className="text-xs font-semibold text-gray-700">무료 맛보기 결과</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* ── 사주팔자 카드 ───────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700 rounded-3xl p-6 shadow-xl shadow-violet-500/20">
          <div className="absolute top-0 right-0 w-52 h-52 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" aria-hidden />
          <div className="relative">
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-5">
              <div className="p-2 bg-white/15 rounded-xl backdrop-blur-sm">
                <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-xs text-violet-200 font-medium">
                  {birthDate} · {gender}성 · {birthTime}
                </p>
                <p className="text-sm font-bold text-white">
                  연주 {yearGan}{yearZhi}년생
                </p>
              </div>
            </div>

            {/* 4주 표 */}
            <div className="flex items-start justify-center gap-3 sm:gap-5">
              <PillarCell label="연주" gan={sajuPillars.year.gan} zhi={sajuPillars.year.zhi} highlight />
              <PillarCell label="월주" gan={sajuPillars.month.gan} zhi={sajuPillars.month.zhi} />
              <PillarCell label="일주" gan={sajuPillars.day.gan} zhi={sajuPillars.day.zhi} />
              <PillarCell
                label="시주"
                gan={sajuPillars.hour?.gan ?? '?'}
                zhi={sajuPillars.hour?.zhi ?? '?'}
              />
            </div>

            {sajuPillars.hour === null && (
              <p className="mt-4 text-center text-xs text-violet-200/80">
                시주는 태어난 시간을 알 경우 더 정밀하게 계산됩니다.
              </p>
            )}

            {/* 오행 설명 */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-4 gap-2 text-center">
              {[
                { label: '연주', val: `${sajuPillars.year.gan}${sajuPillars.year.zhi}` },
                { label: '월주', val: `${sajuPillars.month.gan}${sajuPillars.month.zhi}` },
                { label: '일주', val: `${sajuPillars.day.gan}${sajuPillars.day.zhi}` },
                { label: '시주', val: sajuPillars.hour ? `${sajuPillars.hour.gan}${sajuPillars.hour.zhi}` : '미정' },
              ].map((p) => (
                <div key={p.label}>
                  <p className="text-[10px] text-violet-300 mb-0.5">{p.label}</p>
                  <p className="text-xs font-bold text-white">{p.val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 무료 맛보기 분석 ──────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" strokeWidth={1.8} />
            <h2 className="text-sm font-bold text-gray-800">무료 맛보기 분석</h2>
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {hasFreeContent ? `${freeSections.length}개 공개` : '준비 중'}
            </span>
          </div>

          {/* 요약 */}
          {content?.summary ? (
            <div className="relative bg-violet-50 border border-violet-100/80 rounded-2xl p-5">
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl bg-gradient-to-b from-violet-400 to-indigo-400" aria-hidden />
              <p className="text-sm text-gray-700 leading-[1.75] font-medium pl-1">
                {content.summary}
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <p className="text-sm font-semibold text-amber-800 mb-1">무료 데이터를 준비 중입니다</p>
              <p className="text-sm text-amber-700 leading-relaxed">
                {yearGan}{yearZhi}년생({gender}성)의 콘텐츠를 곧 업데이트할 예정입니다.
                지금은 AI 프리미엄 분석으로 바로 확인하실 수 있습니다.
              </p>
            </div>
          )}

          {/* 공개 섹션 */}
          {hasFreeContent && (
            <div className="space-y-3">
              {freeSections.map((section) => (
                <ReadingCard key={section.title} title={section.title} body={section.body} />
              ))}
            </div>
          )}
        </div>

        {/* ── AI 프리미엄 잠금 영역 ─────────────────────── */}
        <div>
          {/* 구분 헤더 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
              <Lock className="w-3 h-3 text-gray-500" strokeWidth={2.5} />
              <span className="text-xs font-semibold text-gray-600">
                AI 프리미엄 분석 ({premiumSections.length}개 추가 섹션)
              </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>

          {/* 실제 텍스트 블러 카드들 */}
          <div className="space-y-3">
            {premiumSections.map((section) => (
              <PremiumLockedCard key={section.title} section={section} />
            ))}
          </div>

          {/* 하단 페이드 + 잠금 CTA */}
          <div className="relative mt-1">
            <div className="absolute inset-x-0 -top-16 h-16 bg-gradient-to-b from-transparent to-[#fdfcff]" aria-hidden />
            <div className="relative flex flex-col items-center text-center pt-4">
              <p className="text-sm text-gray-600 leading-relaxed mb-1 max-w-xs">
                위 {premiumSections.length}개 섹션의 전체 내용을 보려면
              </p>
              <p className="text-sm font-bold text-gray-900 mb-4">
                Claude AI 프리미엄 분석이 필요합니다.
              </p>
            </div>
          </div>
        </div>

        {/* ── 결제 CTA 카드 ──────────────────────────────── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-violet-500/25">
          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" aria-hidden />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/3" aria-hidden />

          <div className="relative">
            <p className="text-xs font-bold text-violet-200 mb-1.5 uppercase tracking-wider">
              AI 프리미엄 분석
            </p>
            <h3 className="text-lg font-black mb-2 leading-tight">
              {yearGan}{yearZhi}년생 {gender}성을 위한
              <br />
              완전한 사주 분석 보기
            </h3>
            <p className="text-sm text-violet-100 leading-relaxed mb-5">
              Claude AI가 실시간으로 생성하는 맞춤 분석.
              재물운·직업운·건강·연애·월별 조언까지
              {hasFreeContent ? ' 나머지 전체를 확인하세요.' : ' 전 영역을 확인하세요.'}
            </p>

            {/* 혜택 목록 */}
            <ul className="flex flex-col gap-1.5 mb-5">
              {[
                `${premiumSections.length}개 추가 섹션 즉시 공개`,
                '월별 세부 운세 및 구체적 조언',
                '결제 즉시 AI 실시간 생성',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-violet-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-300 shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href={`/payment?${paymentParams.toString()}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-white text-violet-700 hover:bg-violet-50 font-bold rounded-2xl text-sm transition-colors shadow-sm"
            >
              풀 버전 보기 — {formatPrice(categoryPrice)}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>

            <p className="mt-3 text-center text-xs text-violet-200/80">
              결제 즉시 생성 · 구독자는 무료 · 환불 정책 없음
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
