import { Heart, RefreshCw, Users, CalendarDays, Hash, type LucideIcon } from 'lucide-react'
import type { Category, CategorySlug } from '@/types'

export const CATEGORIES: Category[] = [
  {
    id: '1',
    slug: 'doha-sal',
    name: '도화살 알아보기',
    description: '나에게 도화살이 있는지, 연애운과 매력이 어떤지 분석해드립니다.',
    price: 3900,
    avgRating: 4.8,
    reviewCount: 127,
    isActive: true,
    sortOrder: 1,
  },
  {
    id: '2',
    slug: 'name-score',
    name: '나의 이름 점수',
    description: '성명학을 기반으로 이름이 운명에 미치는 영향을 분석합니다.',
    price: 2900,
    avgRating: 4.7,
    reviewCount: 84,
    isActive: false, // 서비스 준비 중
    sortOrder: 2,
  },
  {
    id: '3',
    slug: 'reunion',
    name: '재회 가능성',
    description: '헤어진 연인과의 재회 가능성과 인연의 깊이를 분석합니다.',
    price: 4900,
    avgRating: 4.9,
    reviewCount: 203,
    isActive: true,
    sortOrder: 3,
  },
  {
    id: '4',
    slug: 'compatibility',
    name: '궁합 분석',
    description: '두 사람의 사주로 알아보는 깊이 있는 궁합 분석입니다.',
    price: 5900,
    avgRating: 4.8,
    reviewCount: 315,
    isActive: true,
    sortOrder: 4,
  },
  {
    id: '5',
    slug: 'yearly-fortune',
    name: '올해 종합 운세',
    description: '올해 전반적인 운의 흐름 — 연애, 재물, 건강, 직업운을 분석합니다.',
    price: 5900,
    avgRating: 4.9,
    reviewCount: 428,
    isActive: true,
    sortOrder: 5,
  },
]

export const CATEGORY_MAP: Record<CategorySlug, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<CategorySlug, Category>

export const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  'doha-sal': Heart,
  'name-score': Hash,
  'reunion': RefreshCw,
  'compatibility': Users,
  'yearly-fortune': CalendarDays,
}

/** 메인 페이지 그리드 노출 4개 (순서 고정) */
export const MAIN_CATEGORY_SLUGS: CategorySlug[] = [
  'doha-sal',
  'reunion',
  'compatibility',
  'yearly-fortune',
]

/** 카테고리별 훅 문구 (카드에 표시) */
export const CATEGORY_HOOKS: Record<CategorySlug, string> = {
  'doha-sal': '내 매력이 왜 통하지 않는지, 이유가 있습니다',
  'name-score': '이름이 운명에 미치는 영향을 분석합니다',
  'reunion': '포기하기 전, 사주가 말해주는 재회의 타이밍',
  'compatibility': '설레는 감정 뒤에, 사주가 말하는 두 사람의 진짜 궁합',
  'yearly-fortune': '2026년, 먼저 아는 사람이 기회를 잡습니다',
}

export const SUBSCRIPTION_PRICE = 49900

/**
 * 태어난 시간 — 한국 표준시(KST) 기준
 * KST는 동경 135도 기준 UTC+9 = 전통 시각보다 30분 앞섬
 * 따라서 전통 시각에서 +30분 보정 적용
 */
export const BIRTH_TIMES = [
  { value: '자시', label: '자시 (23:30 ~ 01:30)' },
  { value: '축시', label: '축시 (01:30 ~ 03:30)' },
  { value: '인시', label: '인시 (03:30 ~ 05:30)' },
  { value: '묘시', label: '묘시 (05:30 ~ 07:30)' },
  { value: '진시', label: '진시 (07:30 ~ 09:30)' },
  { value: '사시', label: '사시 (09:30 ~ 11:30)' },
  { value: '오시', label: '오시 (11:30 ~ 13:30)' },
  { value: '미시', label: '미시 (13:30 ~ 15:30)' },
  { value: '신시', label: '신시 (15:30 ~ 17:30)' },
  { value: '유시', label: '유시 (17:30 ~ 19:30)' },
  { value: '술시', label: '술시 (19:30 ~ 21:30)' },
  { value: '해시', label: '해시 (21:30 ~ 23:30)' },
  { value: '모름', label: '모름' },
] as const
