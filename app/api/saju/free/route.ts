import { NextRequest, NextResponse } from 'next/server'
import { getFreeReading } from '@/lib/saju/getFreeReading'

/**
 * GET /api/saju/free?slug=yearly-fortune&birthDate=1984-01-15&gender=남&birthTime=자시
 *
 * 서버 사이드 전용 — API 키 노출 없음
 * 사주 계산 + free_readings 테이블 조회 후 결과 반환
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const slug = searchParams.get('slug')
  const birthDate = searchParams.get('birthDate')
  const gender = searchParams.get('gender')
  const birthTime = searchParams.get('birthTime')

  if (!slug || !birthDate || !gender || !birthTime) {
    return NextResponse.json(
      { error: '필수 파라미터가 누락되었습니다.' },
      { status: 400 },
    )
  }

  const result = await getFreeReading(slug, birthDate, gender, birthTime)

  if (!result) {
    return NextResponse.json(
      { error: '유효하지 않은 카테고리 또는 입력값입니다.' },
      { status: 404 },
    )
  }

  return NextResponse.json(result)
}
