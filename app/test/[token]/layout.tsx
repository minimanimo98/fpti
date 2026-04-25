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

  const nickname = user?.nickname || '친구'
  const ogUrl = `https://fpti.kr/api/og?token=${token}&mode=test`

  return {
    title: `${nickname}의 인성을 평가해주세요 - FPTI`,
    description: `친구 ${nickname}의 인성을 평가해주세요. 28문항 · 2분 소요. 솔직하게 답해주세요.`,
    openGraph: {
      title: `${nickname}의 인성을 평가해주세요`,
      description: '솔직하게 답해주세요. 친구의 인성 결과에 반영됩니다.',
      images: [ogUrl],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
