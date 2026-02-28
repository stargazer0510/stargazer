# CLAUDE.md — 사주 유료 서비스 프로젝트 가이드

> **이 파일은 매 세션마다 반드시 읽어야 하는 프로젝트 헌법입니다.**
> 여기 적힌 규칙을 절대 무시하거나 임의로 변경하지 마세요.

---

## 프로젝트 한줄 요약

생년월일/성별/태어난시간을 입력하면 **무료 맛보기 사주**(DB 기반)를 보여주고, **유료 결제** 후 **AI(Claude API)가 실시간 생성**하는 프리미엄 사주 분석 서비스.

---

## 절대 규칙 (위반 시 즉시 되돌리기)

### 디자인
- **밝은 화이트/크림 베이스** 디자인. 검은 배경 절대 금지.
- **가독성 최우선**: WCAG AA 명도대비 4.5:1 이상, 본문 line-height 1.6~1.8, 모바일 폰트 최소 14px(본문 16px 이상).
- **텍스트 이모지(Emoji) 사용 절대 금지**. 모든 아이콘은 SVG로 구현 (Lucide React 또는 커스텀 SVG).
- 컬러 포인트: 소프트 퍼플/라벤더 계열 그라데이션.
- 폰트: Pretendard (한글 웹폰트).

### 코드 & 구조
- **기존에 잘 동작하는 코드를 건드리지 마.** 새 기능 추가 시 기존 기능이 깨지지 않는지 반드시 확인.
- **파일을 임의로 삭제하지 마.** 필요 없어 보여도 확인 먼저.
- **폴더 구조를 임의로 변경하지 마.** 아래 정해진 구조를 따를 것.
- TypeScript strict 모드. any 타입 사용 최소화.
- 컴포넌트는 재사용 가능하게 설계.

### 비즈니스 로직
- **무료 콘텐츠는 DB에서 조회** (free_readings 테이블). AI 호출하지 않음.
- **유료 콘텐츠만 Claude API 호출**. 결제 확인 후에만 호출.
- API 키는 **서버 사이드(API Route)에서만** 사용. 클라이언트에 절대 노출 금지.
- 구독자는 **프로필에 등록된 본인 사주 정보로만** AI 생성 가능.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 14+ (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS |
| DB & Auth | Supabase (PostgreSQL + Auth + Storage) |
| AI | Anthropic Claude API |
| 결제 | 토스페이먼츠 + 네이버페이 |
| 배포 | Vercel |
| 도메인 | 가비아 |

---

## 폴더 구조

```
saju-service/
├── app/
│   ├── layout.tsx              # 공통 레이아웃
│   ├── page.tsx                # 메인 페이지
│   ├── category/
│   │   └── [slug]/
│   │       ├── page.tsx        # 카테고리 상세 + 입력 폼
│   │       └── reviews/
│   │           └── page.tsx    # 카테고리별 리뷰 목록
│   ├── result/
│   │   ├── free/[id]/page.tsx  # 무료 결과
│   │   └── premium/[id]/page.tsx # 유료 결과
│   ├── payment/
│   │   ├── page.tsx            # 결제 페이지
│   │   └── success/page.tsx    # 결제 완료
│   ├── auth/
│   │   ├── login/page.tsx      # 로그인
│   │   ├── signup/page.tsx     # 회원가입
│   │   └── profile/page.tsx    # 프로필 생성/수정
│   ├── mypage/
│   │   └── page.tsx            # 마이페이지
│   ├── subscribe/
│   │   └── page.tsx            # 구독 상품 페이지
│   ├── admin/
│   │   └── page.tsx            # 어드민 대시보드
│   └── api/
│       ├── saju/
│       │   ├── free/route.ts   # 무료 사주 조회
│       │   └── premium/route.ts # AI 유료 사주 생성
│       ├── payment/
│       │   ├── confirm/route.ts # 결제 승인
│       │   └── webhook/route.ts # 결제 웹훅
│       ├── review/route.ts      # 리뷰 CRUD
│       └── admin/route.ts       # 어드민 API
├── components/
│   ├── ui/                     # 공통 UI (버튼, 카드, 모달 등)
│   ├── layout/                 # 헤더, 푸터, 네비게이션
│   ├── category/               # 카테고리 관련 컴포넌트
│   ├── saju/                   # 사주 입력 폼, 결과 표시
│   ├── review/                 # 리뷰 작성, 리뷰 목록
│   └── payment/                # 결제 관련 컴포넌트
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Supabase 클라이언트
│   │   └── server.ts           # Supabase 서버 클라이언트
│   ├── saju/
│   │   └── calculator.ts       # 만세력 변환 로직
│   ├── payment/
│   │   ├── toss.ts             # 토스페이먼츠 헬퍼
│   │   └── naverpay.ts         # 네이버페이 헬퍼
│   └── utils.ts                # 공통 유틸
├── types/
│   └── index.ts                # TypeScript 타입 정의
├── constants/
│   ├── categories.ts           # 카테고리 데이터
│   └── prompts/                # AI 프롬프트 (카테고리별)
│       ├── doha-sal.ts
│       ├── name-score.ts
│       ├── reunion.ts
│       ├── compatibility.ts
│       └── yearly-fortune.ts
├── data/
│   └── free-readings/          # 무료 사주 시드 데이터 (JSON)
├── public/
│   └── icons/                  # SVG 아이콘 파일
└── CLAUDE.md                   # ← 이 파일
```

---

## 데이터베이스 테이블 (Supabase)

### profiles
사용자 프로필. 회원가입 시 필수 생성. 월 1회 수정 가능.
- id (uuid, PK, = auth user_id)
- nickname (text)
- birth_date (date, 필수)
- gender (text, 필수, 남/여)
- birth_time (text, 12지 기반 또는 '모름')
- saju_key (text, 사주 팔자 캐싱)
- last_edited_at (timestamptz, 수정 제한용)
- is_complete (boolean)
- created_at (timestamptz)

### categories
카테고리 마스터 데이터.
- id, slug, name, description, price, icon_url
- avg_rating (numeric, 트리거로 자동 갱신)
- review_count (integer, 트리거로 자동 갱신)
- is_active, sort_order, created_at

### free_readings
무료 맛보기 콘텐츠. 생년월일 조합별 미리 작성된 텍스트.
- id, category_id (FK), heavenly_stem, earthly_branch, gender
- content (jsonb, 섹션별 구조)
- created_at, updated_at

### orders
건당 결제 주문.
- id, order_number (UQ), category_id (FK)
- email, phone (비회원용)
- birth_date, gender, birth_time (입력 정보)
- amount, payment_method, payment_key, status
- has_review (boolean, 리뷰 중복 방지)
- created_at, paid_at

### subscriptions
1년 무제한 구독.
- id, user_id (FK → profiles)
- plan_type, amount, payment_method, payment_key, status
- starts_at, expires_at (starts_at + 365일)
- created_at

### generated_readings
AI 생성 결과 캐싱.
- id, order_id (FK), category_id (FK)
- saju_key (캐싱 키), content (jsonb)
- prompt_version, model_version, tokens_used
- created_at

### reviews
사용자/어드민 리뷰.
- id, order_id (FK, UQ), category_id (FK)
- nickname, rating (1~5), content (text)
- image_urls (text[]), 최대 3장
- is_admin (boolean), is_deleted (boolean, 소프트 삭제)
- created_at

---

## 카테고리 목록

| slug | 이름 | 가격(건당) | 비고 |
|------|------|-----------|------|
| doha-sal | 도화살 알아보기 | 3,900원 | 연애운/매력 분석 |
| name-score | 나의 이름 점수 | 2,900원 | 성명학 기반 |
| reunion | 재회 가능성 | 4,900원 | 인연 분석 |
| compatibility | 궁합 분석 | 5,900원 | 2인 입력 필요 |
| yearly-fortune | 올해 종합 운세 | 5,900원 | 가장 큰 볼륨 |

1년 무제한 구독: 49,900원

---

## 결제 모델

- **건당 결제**: 비회원/회원 모두 가능. 카테고리별 개별 가격.
- **1년 무제한 구독**: 회원 전용. 프로필 기반. 전 카테고리 무제한.
- 구독자는 프로필 saju_key로만 AI 생성 (계정 공유 방지).
- 프로필 수정은 월 1회 (last_edited_at 기준 30일).

---

## 개발 진행 상황

> **현재 Phase: 0 (시작 전)**
> 
> Phase를 완료할 때마다 아래 체크박스를 업데이트해주세요.

- [x] Phase 0: 개발 환경 세팅
- [x] Phase 1: 회원가입 & 프로필 시스템
- [x] Phase 2: 메인 페이지 & 카테고리 구조
- [x] Phase 3: 무료 맛보기 시스템 (DB 기반)
- [ ] Phase 4: 결제 시스템 (건당 + 구독)
- [ ] Phase 5: AI 유료 사주 생성 (Claude API)
- [ ] Phase 6: 리뷰 시스템 & 어드민 관리
- [ ] Phase 7: 디자인 & UX 완성
- [ ] Phase 8: 배포 & 런칭
- [ ] Phase 9: 운영 & 확장

---

## AI 프롬프트 규칙

- 시스템 프롬프트는 constants/prompts/ 에서 관리.
- 톤: 신비롭되 구체적, 긍정적이되 현실적, 위로와 조언 겸비.
- 건강/법률/금융 관련 단정적 조언 금지.
- 출력: 반드시 JSON 구조 (섹션별 title + body).
- 프롬프트 버전을 generated_readings.prompt_version에 기록.

---

## 작업 시 주의사항

1. **새 기능 추가 전**: 기존 기능이 정상 동작하는지 먼저 확인.
2. **에러 수정 시**: 해당 파일만 수정. 관련 없는 파일을 건드리지 마.
3. **디자인 변경 시**: 밝은 톤 + 가독성 규칙 재확인.
4. **API Route 추가 시**: 인증/권한 체크 포함 여부 확인.
5. **Phase 완료 후**: 반드시 git commit + 위 체크리스트 업데이트.

---

## 환경 변수 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=
NAVERPAY_CLIENT_ID=
NAVERPAY_CLIENT_SECRET=
ADMIN_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=
```

---

*이 파일은 프로젝트의 "헌법"입니다. 수정은 가영(프로젝트 오너)의 명시적 지시가 있을 때만 합니다.*
