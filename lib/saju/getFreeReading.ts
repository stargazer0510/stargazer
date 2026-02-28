import { createAdminClient } from '@/lib/supabase/admin'
import { CATEGORY_MAP } from '@/constants/categories'
import { calculateSaju, getYearPillar } from './calculator'
import type { CategorySlug, ReadingContent } from '@/types'
import type { SajuPillars } from './calculator'

export interface FreeReadingResult {
  sajuPillars: SajuPillars
  yearGan: string         // 연주 천간 (DB 조회 키)
  yearZhi: string         // 연주 지지 (DB 조회 키)
  reading: { content: ReadingContent } | null
  categoryName: string
  categoryPrice: number
  categorySlug: string
}

/**
 * 양력 생년월일 → 사주팔자 계산 + free_readings DB 조회
 * - 서버 사이드 전용 (Service Role 사용)
 */
export async function getFreeReading(
  slug: string,
  birthDate: string,   // YYYY-MM-DD
  gender: string,
  birthTime: string,
): Promise<FreeReadingResult | null> {
  const category = CATEGORY_MAP[slug as CategorySlug]
  if (!category || !category.isActive) return null

  const parts = birthDate.split('-')
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null

  // 사주팔자 계산
  const sajuPillars = calculateSaju(year, month, day, birthTime)
  const yearPillar = getYearPillar(year, month, day)

  const base: FreeReadingResult = {
    sajuPillars,
    yearGan: yearPillar.gan,
    yearZhi: yearPillar.zhi,
    reading: null,
    categoryName: category.name,
    categoryPrice: category.price,
    categorySlug: slug,
  }

  try {
    const supabase = createAdminClient()

    // categories 테이블에서 UUID 조회
    const { data: catRow } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!catRow) return base

    // 연주 천간·지지·성별로 무료 리딩 조회
    const { data: reading } = await supabase
      .from('free_readings')
      .select('content')
      .eq('category_id', catRow.id)
      .eq('heavenly_stem', yearPillar.gan)
      .eq('earthly_branch', yearPillar.zhi)
      .eq('gender', gender)
      .single()

    return { ...base, reading: reading ?? null }
  } catch {
    // DB 연결 실패 시 계산 결과만 반환
    return base
  }
}
