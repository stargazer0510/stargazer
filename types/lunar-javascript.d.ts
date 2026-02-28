// lunar-javascript 공식 타입 없음 — 사용하는 API만 최소 선언
declare module 'lunar-javascript' {
  class Solar {
    /** 날짜 + 시분초로 Solar 객체 생성 */
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number,
    ): Solar
    /** 날짜만으로 Solar 객체 생성 */
    static fromYmd(year: number, month: number, day: number): Solar
    getLunar(): Lunar
  }

  class Lunar {
    /** 八字 (사주팔자) 객체 반환. 年柱는 立春 기준 */
    getEightChar(): EightChar
  }

  class EightChar {
    /** 연주 干支 e.g. "甲子" */
    getYear(): string
    /** 월주 干支 e.g. "丙寅" */
    getMonth(): string
    /** 일주 干支 e.g. "壬午" */
    getDay(): string
    /** 시주 干支 e.g. "庚子" — Solar 생성 시 시각 포함해야 유효 */
    getTime(): string
  }

  export { Solar, Lunar, EightChar }
}
