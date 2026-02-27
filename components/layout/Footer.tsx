import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* 상단 */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
          {/* 브랜드 */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-1.5 font-bold text-base text-violet-700 tracking-tight mb-2"
            >
              <Sparkles className="w-4 h-4 text-violet-500" strokeWidth={1.8} />
              사주비서
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              생년월일로 알아보는 나의 운명.<br />
              AI 기반 정밀 사주 분석 서비스.
            </p>
          </div>

          {/* 링크 그룹 */}
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">카테고리</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/category/doha-sal" className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
                    도화살 알아보기
                  </Link>
                </li>
                <li>
                  <Link href="/category/name-score" className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
                    나의 이름 점수
                  </Link>
                </li>
                <li>
                  <Link href="/category/reunion" className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
                    재회 가능성
                  </Link>
                </li>
                <li>
                  <Link href="/category/compatibility" className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
                    궁합 분석
                  </Link>
                </li>
                <li>
                  <Link href="/category/yearly-fortune" className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
                    올해 종합 운세
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">서비스</p>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link href="/subscribe" className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
                    1년 무제한 구독
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
                    로그인
                  </Link>
                </li>
                <li>
                  <Link href="/mypage" className="text-sm text-gray-600 hover:text-violet-700 transition-colors">
                    마이페이지
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} 사주비서. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              개인정보처리방침
            </Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              이용약관
            </Link>
          </div>
        </div>

        {/* 법적 고지 */}
        <p className="mt-4 text-xs text-gray-400 leading-relaxed">
          본 서비스는 전통 사주명리학을 AI로 해석한 참고용 콘텐츠이며, 건강·법률·금융에 관한 전문적 조언을 대체하지 않습니다.
        </p>
      </div>
    </footer>
  )
}
