// ==========================================
// 공통 타입 정의
// ==========================================

export type Gender = '남' | '여'

export type BirthTime =
  | '자시' | '축시' | '인시' | '묘시' | '진시' | '사시'
  | '오시' | '미시' | '신시' | '유시' | '술시' | '해시'
  | '모름'

export type PaymentMethod = 'toss' | 'naverpay' | 'card'

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled'

// ==========================================
// 카테고리
// ==========================================

export interface Category {
  id: string
  slug: CategorySlug
  name: string
  description: string
  price: number
  iconUrl?: string
  avgRating: number
  reviewCount: number
  isActive: boolean
  sortOrder: number
}

export type CategorySlug =
  | 'doha-sal'
  | 'name-score'
  | 'reunion'
  | 'compatibility'
  | 'yearly-fortune'

// ==========================================
// 사용자 프로필
// ==========================================

export interface Profile {
  id: string
  nickname: string
  birthDate: string        // YYYY-MM-DD
  gender: Gender
  birthTime: BirthTime
  sajuKey?: string
  lastEditedAt?: string
  isComplete: boolean
  createdAt: string
}

// ==========================================
// 주문
// ==========================================

export interface Order {
  id: string
  orderNumber: string
  categoryId: string
  email?: string
  phone?: string
  birthDate: string
  gender: Gender
  birthTime: BirthTime
  amount: number
  paymentMethod?: PaymentMethod
  paymentKey?: string
  status: OrderStatus
  hasReview: boolean
  createdAt: string
  paidAt?: string
}

// ==========================================
// 구독
// ==========================================

export interface Subscription {
  id: string
  userId: string
  planType: 'yearly'
  amount: number
  paymentMethod?: PaymentMethod
  paymentKey?: string
  status: SubscriptionStatus
  startsAt: string
  expiresAt: string
  createdAt: string
}

// ==========================================
// 무료 리딩 (DB)
// ==========================================

export interface FreeReading {
  id: string
  categoryId: string
  heavenlyStem: string
  earthlyBranch: string
  gender: Gender
  content: ReadingContent
  createdAt: string
  updatedAt: string
}

// ==========================================
// AI 생성 리딩
// ==========================================

export interface GeneratedReading {
  id: string
  orderId: string
  categoryId: string
  sajuKey: string
  content: ReadingContent
  promptVersion: string
  modelVersion: string
  tokensUsed?: number
  createdAt: string
}

// ==========================================
// 리딩 콘텐츠 구조
// ==========================================

export interface ReadingSection {
  title: string
  body: string
}

export interface ReadingContent {
  summary: string
  sections: ReadingSection[]
}

// ==========================================
// 리뷰
// ==========================================

export interface Review {
  id: string
  orderId: string
  categoryId: string
  nickname: string
  rating: 1 | 2 | 3 | 4 | 5
  content: string
  imageUrls: string[]
  isAdmin: boolean
  isDeleted: boolean
  createdAt: string
}

// ==========================================
// 사주 입력 폼
// ==========================================

export interface SajuFormInput {
  birthDate: string     // YYYY-MM-DD
  gender: Gender
  birthTime: BirthTime
  name?: string         // name-score 카테고리용
}

export interface CompatibilityFormInput {
  person1: SajuFormInput
  person2: SajuFormInput
}
