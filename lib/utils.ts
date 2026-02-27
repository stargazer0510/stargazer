import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 가격 포맷 (예: 3900 -> "3,900원")
 */
export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

/**
 * 날짜 포맷 (예: "2024-01-15" -> "2024년 1월 15일")
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 날짜 + 시간 포맷
 */
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 생년월일 문자열 파싱 (YYYYMMDD -> YYYY-MM-DD)
 */
export function parseBirthDate(raw: string): string {
  if (raw.includes('-')) return raw
  const cleaned = raw.replace(/\D/g, '')
  if (cleaned.length !== 8) return raw
  return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`
}

/**
 * 주문번호 생성 (예: SAJ-20240115-A3K9)
 */
export function generateOrderNumber(): string {
  const date = new Date()
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '')
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `SAJ-${datePart}-${randomPart}`
}

/**
 * 마지막 수정일로부터 30일 경과 여부 확인
 */
export function canEditProfile(lastEditedAt: string | null | undefined): boolean {
  if (!lastEditedAt) return true
  const diff = Date.now() - new Date(lastEditedAt).getTime()
  return diff > 30 * 24 * 60 * 60 * 1000
}

/**
 * 구독 만료 여부 확인
 */
export function isSubscriptionActive(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) > new Date()
}

/**
 * 별점 배열 (1~5) -> 채워진 개수
 */
export function getRatingLabel(rating: number): string {
  const labels = { 1: '별로예요', 2: '그저그래요', 3: '보통이에요', 4: '좋아요', 5: '최고예요' }
  return labels[rating as keyof typeof labels] ?? ''
}
