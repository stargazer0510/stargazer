import { Solar } from 'lunar-javascript'

// ─── 한자 → 한국어 매핑 ──────────────────────────────────────

const GAN_MAP: Record<string, string> = {
  甲: '갑', 乙: '을', 丙: '병', 丁: '정', 戊: '무',
  己: '기', 庚: '경', 辛: '신', 壬: '임', 癸: '계',
}

const ZHI_MAP: Record<string, string> = {
  子: '자', 丑: '축', 寅: '인', 卯: '묘', 辰: '진', 巳: '사',
  午: '오', 未: '미', 申: '신', 酉: '유', 戌: '술', 亥: '해',
}

/** "甲子" 형식 → { gan: '갑', zhi: '자' } */
function parseGanZhi(ganZhi: string): SajuPillar {
  return {
    gan: GAN_MAP[ganZhi[0]] ?? ganZhi[0],
    zhi: ZHI_MAP[ganZhi[1]] ?? ganZhi[1],
  }
}

// ─── 태어난 시간 → 대표 시각(hour) 매핑 ─────────────────────
// KST 기준(+30분 보정 반영한 표시 시각의 중간값 사용)
const BIRTH_TIME_TO_HOUR: Record<string, number> = {
  자시: 0,   // 23:30~01:30 → 0시 사용
  축시: 2,
  인시: 4,
  묘시: 6,
  진시: 8,
  사시: 10,
  오시: 12,
  미시: 14,
  신시: 16,
  유시: 18,
  술시: 20,
  해시: 22,
}

// ─── 타입 ──────────────────────────────────────────────────

export interface SajuPillar {
  gan: string  // 천간 한국어 (갑~계)
  zhi: string  // 지지 한국어 (자~해)
}

export interface SajuPillars {
  year: SajuPillar    // 연주 (年柱) — 立春 기준
  month: SajuPillar   // 월주 (月柱) — 節氣 기준
  day: SajuPillar     // 일주 (日柱)
  hour: SajuPillar | null  // 시주 (時柱) — '모름'이면 null
}

// ─── 메인 계산 함수 ──────────────────────────────────────────

/**
 * 양력 생년월일 + 태어난 시간 → 사주팔자 4柱
 *
 * - 연주: 立春(입춘, ~2/4) 기준으로 전년/당해 결정
 * - 월주: 節氣 기준
 * - 일주·시주: lunar-javascript EightChar 사용
 * - birthTime이 '모름'이면 hour는 null
 */
export function calculateSaju(
  year: number,
  month: number,
  day: number,
  birthTime: string,
): SajuPillars {
  const hour = BIRTH_TIME_TO_HOUR[birthTime] ?? null

  const solar =
    hour !== null
      ? Solar.fromYmdHms(year, month, day, hour, 0, 0)
      : Solar.fromYmd(year, month, day)

  const ec = solar.getLunar().getEightChar()

  return {
    year: parseGanZhi(ec.getYear()),
    month: parseGanZhi(ec.getMonth()),
    day: parseGanZhi(ec.getDay()),
    hour: hour !== null ? parseGanZhi(ec.getTime()) : null,
  }
}

/** free_readings 조회용 연주 천간/지지만 추출 */
export function getYearPillar(
  year: number,
  month: number,
  day: number,
): SajuPillar {
  const solar = Solar.fromYmd(year, month, day)
  const ec = solar.getLunar().getEightChar()
  return parseGanZhi(ec.getYear())
}
