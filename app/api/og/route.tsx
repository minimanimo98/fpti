import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const REVERSE = [4, 9, 11, 12, 17, 22, 23, 24, 25, 26, 28]

function calc(answers: Record<number, number>[]) {
  const avgPerQ: Record<number, number> = {}
  for (let i = 1; i <= 28; i++) {
    const vals = answers.map(a => a[i]).filter(v => v !== undefined)
    if (vals.length > 0) avgPerQ[i] = vals.reduce((a, b) => a + b, 0) / vals.length
  }
  let raw = 0
  for (let i = 1; i <= 25; i++) {
    const avg = avgPerQ[i] ?? 0
    raw += REVERSE.includes(i) ? -avg : avg
  }
  const score = Math.max(0, Math.min(100, Math.round(((raw + 50) / 100) * 100)))
  const humorAvg = [18,19,20,21].map(i => avgPerQ[i] ?? 0).reduce((a,b)=>a+b,0) / 4
  const selfRaw = [22,23,24,25].map(i => avgPerQ[i] ?? 0).reduce((a,b)=>a+b,0) / 4
  let typeName = ''
  if (score < 15)                              typeName = '순수악'
  else if (humorAvg >= 1.5 && score < 65)     typeName = '허당 귀요미'
  else if (humorAvg >= 1.0 && selfRaw >= 1.0) typeName = '관종 빌런'
  else if (score >= 90) typeName = '성인군자'
  else if (score >= 80) typeName = '걸어다니는 힐링'
  else if (score >= 70) typeName = '다정한 호구'
  else if (score >= 60) typeName = '상식선 인간'
  else if (score >= 50) typeName = '무난무취형'
  else if (score >= 40) typeName = '은근한 빌런'
  else if (score >= 30) typeName = '뒷담화 챔피언'
  else if (score >= 20) typeName = '기분파 폭군'
  else                  typeName = '감정 흡혈귀'
  return { score, typeName }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') || ''
    const mode = searchParams.get('mode') || 'result'

    let nickname = ''
    let typeName = ''
    let score: number | null = null
    let isPending = false

    if (token) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: user } = await supabase
        .from('users').select('id, nickname').eq('share_token', token).single()
      if (user) {
        nickname = user.nickname
        const { data: responses } = await supabase
          .from('responses').select('answers').eq('user_id', user.id)
        if (responses && responses.length >= 3) {
          const result = calc(responses.map(r => r.answers))
          typeName = result.typeName
          score = result.score
        } else {
          isPending = true
        }
      }
    }

    const showEvaluate = mode === 'test'

    return new ImageResponse(
      (
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: '#FAFAFA', padding: '70px',
        }}>
          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 60 }}>
            <div style={{
              display: 'flex',
              width: 60, height: 60, background: '#FFEE00',
              borderRadius: 16,
              alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 900, color: '#0a0a0a',
              boxShadow: '0 4px 0 #0a0a0a',
            }}>F</div>
            <div style={{ display: 'flex', fontSize: 36, fontWeight: 900, color: '#0a0a0a' }}>FPTI</div>
          </div>

          {/* 메인 컨텐츠 */}
          {showEvaluate ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 40, color: '#666', marginBottom: 20 }}>
                {nickname || '친구'}의
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', fontSize: 110, fontWeight: 900, color: '#0a0a0a', lineHeight: 1.1 }}>
                <div style={{ display: 'flex', background: '#FFEE00', padding: '0 24px', borderRadius: 16 }}>인성</div>
                <div style={{ display: 'flex', marginLeft: 24 }}>평가하기</div>
              </div>
              <div style={{ display: 'flex', fontSize: 32, color: '#666', marginTop: 36 }}>
                28문항 · 2분 소요
              </div>
            </div>
          ) : isPending ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 40, color: '#666', marginBottom: 20 }}>
                {nickname}님의
              </div>
              <div style={{ display: 'flex', fontSize: 100, fontWeight: 900, color: '#0a0a0a', lineHeight: 1.1 }}>
                <div style={{ display: 'flex', background: '#FFEE00', padding: '0 24px', borderRadius: 16 }}>결과 대기 중</div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 40, color: '#666', marginBottom: 16 }}>
                {nickname}님은
              </div>
              <div style={{ display: 'flex', fontSize: 110, fontWeight: 900, color: '#0a0a0a', lineHeight: 1.1 }}>
                <div style={{ display: 'flex', background: '#FFEE00', padding: '0 24px', borderRadius: 16 }}>{typeName}</div>
              </div>
              {score !== null && (
                <div style={{ display: 'flex', fontSize: 56, color: '#0a0a0a', marginTop: 36 }}>
                  점수 {score}/100
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flex: 1 }} />

          {/* 하단 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#888' }}>
            <div style={{ display: 'flex' }}>친구가 답하는 인성 테스트</div>
            <div style={{ display: 'flex', fontWeight: 900, color: '#0a0a0a' }}>fpti.kr</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch (e) {
    return new Response(`OG Error: ${(e as Error).message}`, { status: 500 })
  }
}
