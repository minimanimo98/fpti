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

function svgDataUrl(expression: 'peek' | 'smirk' | 'sleepy'): string {
  const eyes = expression === 'peek'
    ? '<path d="M 45 60 Q 53 56 61 60" stroke="#0a0a0a" stroke-width="3.5" fill="none" stroke-linecap="round" /><circle cx="92" cy="60" r="6" fill="#0a0a0a" /><circle cx="94" cy="58" r="2" fill="#fff" /><path d="M 60 85 Q 70 92 82 85" stroke="#0a0a0a" stroke-width="3.5" fill="none" stroke-linecap="round" />'
    : expression === 'smirk'
    ? '<path d="M 45 60 L 60 60" stroke="#0a0a0a" stroke-width="3.5" stroke-linecap="round" /><path d="M 80 60 L 95 60" stroke="#0a0a0a" stroke-width="3.5" stroke-linecap="round" /><path d="M 58 88 Q 75 82 85 90" stroke="#0a0a0a" stroke-width="3.5" fill="none" stroke-linecap="round" />'
    : '<path d="M 45 62 Q 53 66 61 62" stroke="#0a0a0a" stroke-width="3.5" fill="none" stroke-linecap="round" /><path d="M 82 62 Q 90 66 98 62" stroke="#0a0a0a" stroke-width="3.5" fill="none" stroke-linecap="round" /><ellipse cx="70" cy="88" rx="6" ry="3" fill="#0a0a0a" />'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="280" height="280"><ellipse cx="72" cy="128" rx="50" ry="6" fill="rgba(0,0,0,0.08)" /><circle cx="70" cy="65" r="55" fill="#FFEE00" stroke="#0a0a0a" stroke-width="3.5" /><circle cx="42" cy="78" r="4" fill="#FF9999" opacity="0.5" /><circle cx="98" cy="78" r="4" fill="#FF9999" opacity="0.5" />${eyes}</svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
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
    const expression: 'peek' | 'smirk' | 'sleepy' =
      showEvaluate ? 'peek' : isPending ? 'sleepy' : 'smirk'

    const mascotUrl = svgDataUrl(expression)

    return new ImageResponse(
      (
        <div style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          background: '#FAFAFA', padding: '60px 70px',
        }}>
          {/* 로고 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
            <div style={{
              display: 'flex',
              width: 56, height: 56, background: '#FFEE00',
              borderRadius: 14,
              alignItems: 'center', justifyContent: 'center',
              fontSize: 30, fontWeight: 900, color: '#0a0a0a',
              boxShadow: '0 4px 0 #0a0a0a',
            }}>F</div>
            <div style={{ display: 'flex', fontSize: 32, fontWeight: 900, color: '#0a0a0a' }}>FPTI</div>
          </div>

          {/* 본문 */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between', gap: 40 }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              {showEvaluate ? (
                <>
                  <div style={{ display: 'flex', fontSize: 36, color: '#666', marginBottom: 16 }}>
                    {nickname || '친구'}의
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', fontSize: 90, fontWeight: 900, color: '#0a0a0a', lineHeight: 1.1 }}>
                    <div style={{ display: 'flex', background: '#FFEE00', padding: '0 20px', borderRadius: 14 }}>인성</div>
                    <div style={{ display: 'flex', marginLeft: 20 }}>평가하기</div>
                  </div>
                  <div style={{ display: 'flex', fontSize: 28, color: '#666', marginTop: 24 }}>
                    28문항 · 2분 소요
                  </div>
                </>
              ) : isPending ? (
                <>
                  <div style={{ display: 'flex', fontSize: 36, color: '#666', marginBottom: 16 }}>
                    {nickname}님의
                  </div>
                  <div style={{ display: 'flex', fontSize: 80, fontWeight: 900, color: '#0a0a0a', lineHeight: 1.1 }}>
                    <div style={{ display: 'flex', background: '#FFEE00', padding: '0 20px', borderRadius: 14 }}>결과 대기 중</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', fontSize: 36, color: '#666', marginBottom: 14 }}>
                    {nickname}님은
                  </div>
                  <div style={{ display: 'flex', fontSize: 88, fontWeight: 900, color: '#0a0a0a', lineHeight: 1.1 }}>
                    <div style={{ display: 'flex', background: '#FFEE00', padding: '0 20px', borderRadius: 14 }}>{typeName}</div>
                  </div>
                  {score !== null && (
                    <div style={{ display: 'flex', fontSize: 48, color: '#0a0a0a', marginTop: 28 }}>
                      점수 {score}/100
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 마스코트 (이미지로) */}
            <img src={mascotUrl} width="280" height="280" alt="" />
          </div>

          {/* 하단 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#888', marginTop: 20 }}>
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
