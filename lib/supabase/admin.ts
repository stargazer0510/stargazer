import { createClient } from '@supabase/supabase-js'

/**
 * Supabase 어드민 클라이언트 (서버 사이드 전용)
 * - Service Role Key 사용 → RLS 우회
 * - 쿠키/세션 불필요한 서버 작업에 사용
 * - 절대 클라이언트 번들에 포함되어선 안 됨
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
    },
  )
}
