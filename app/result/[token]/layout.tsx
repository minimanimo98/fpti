import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { token } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: user } = await supabase
    .from('users').select('nickname').eq('share_token', token).single()

  const nickname = user?.nickname || ''
  const ogUrl = `https://fpti.kr/api/og?token=${token}&mode=result`

  return {
    title: `${nickname}의 FPTI 결과 - 친구가 본 나의 인성`,
    description: '친구들이 답한 나의 진짜 인성. 결과를 확인해보세요.',
    openGraph: {
      title: `${nickname}의 FPTI 결과`,
      description: '친구들이 답한 나의 진짜 인성',
      images: [ogUrl],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
