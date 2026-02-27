import type { Category, CategorySlug } from '@/types'

export const CATEGORIES: Category[] = [
  {
    id: '1',
    slug: 'doha-sal',
    name: '도화살 알아보기',
    description: '나에게 도화살이 있는지, 연애운과 매력이 어떤지 분석해드립니다.',
    price: 3900,
    avgRating: 4.8,
    reviewCount: 0,
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
    reviewCount: 0,
    isActive: true,
    sortOrder: 2,
  },
  {
    id: '3',
    slug: 'reunion',
    name: '재회 가능성',
    description: '헤어진 연인과의 재회 가능성과 인연의 깊이를 분석합니다.',
    price: 4900,
    avgRating: 4.9,
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
    isActive: true,
    sortOrder: 5,
  },
]

export const CATEGORY_MAP: Record<CategorySlug, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c])
) as Record<CategorySlug, Category>

export const SUBSCRIPTION_PRICE = 49900

export const BIRTH_TIMES = [
  { value: '자시', label: '자시 (23:00 ~ 01:00)' },
  { value: '축시', label: '축시 (01:00 ~ 03:00)' },
  { value: '인시', label: '인시 (03:00 ~ 05:00)' },
  { value: '묘시', label: '묘시 (05:00 ~ 07:00)' },
  { value: '진시', label: '진시 (07:00 ~ 09:00)' },
  { value: '사시', label: '사시 (09:00 ~ 11:00)' },
  { value: '오시', label: '오시 (11:00 ~ 13:00)' },
  { value: '미시', label: '미시 (13:00 ~ 15:00)' },
  { value: '신시', label: '신시 (15:00 ~ 17:00)' },
  { value: '유시', label: '유시 (17:00 ~ 19:00)' },
  { value: '술시', label: '술시 (19:00 ~ 21:00)' },
  { value: '해시', label: '해시 (21:00 ~ 23:00)' },
  { value: '모름', label: '모름' },
] as const
