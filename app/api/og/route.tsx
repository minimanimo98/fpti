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
  let expression = 'peek'
  if (score < 15)                              { typeName = '순수악'; expression = 'smirk' }
  else if (humorAvg >= 1.5 && score < 65)     { typeName = '허당 귀요미'; expression = 'smile' }
  else if (humorAvg >= 1.0 && selfRaw >= 1.0) { typeName = '관종 빌런'; expression = 'shock' }
  else if (score >= 90) { typeName = '성인군자'; expression = 'smile' }
  else if (score >= 80) { typeName = '걸어다니는 힐링'; expression = 'smile' }
  else if (score >= 70) { typeName = '다정한 호구'; expression = 'sleepy' }
  else if (score >= 60) { typeName = '상식선 인간'; expression = 'peek' }
  else if (score >= 50) { typeName = '무난무취형'; expression = 'sleepy' }
  else if (score >= 40) { typeName = '은근한 빌런'; expression = 'smirk' }
  else if (score >= 30) { typeName = '뒷담화 챔피언'; expression = 'smirk' }
  else if (score >= 20) { typeName = '기분파 폭군'; expression = 'shock' }
  else                  { typeName = '감정 흡혈귀'; expression = 'shock' }
  return { score, typeName, expression }
}

// 큰 사이즈 마스코트 SVG (OG용 360px)
function mascotDataUrl(expression: string): string {
  const eyes = expression === 'peek'
    ? '<path d="M 45 60 Q 53 56 61 60" stroke="#2C1810" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="92" cy="60" r="6" fill="#2C1810"/><circle cx="94" cy="58" r="2" fill="#fff"/><path d="M 60 85 Q 70 92 82 85" stroke="#2C1810" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    : expression === 'smile'
    ? '<path d="M 42 58 Q 50 50 58 58" stroke="#2C1810" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M 82 58 Q 90 50 98 58" stroke="#2C1810" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M 55 82 Q 70 95 85 82" stroke="#2C1810" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    : expression === 'shock'
    ? '<circle cx="50" cy="58" r="5" fill="#2C1810"/><circle cx="90" cy="58" r="5" fill="#2C1810"/><ellipse cx="70" cy="88" rx="8" ry="10" fill="#2C1810"/>'
    : expression === 'smirk'
    ? '<path d="M 45 60 L 60 60" stroke="#2C1810" stroke-width="3.5" stroke-linecap="round"/><path d="M 80 60 L 95 60" stroke="#2C1810" stroke-width="3.5" stroke-linecap="round"/><path d="M 58 88 Q 75 82 85 90" stroke="#2C1810" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    : '<path d="M 45 62 Q 53 66 61 62" stroke="#2C1810" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M 82 62 Q 90 66 98 62" stroke="#2C1810" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="70" cy="88" rx="6" ry="3" fill="#2C1810"/>'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" width="360" height="360"><circle cx="70" cy="65" r="55" fill="#FFD96B" stroke="#2C1810" stroke-width="3.5"/><circle cx="42" cy="78" r="4" fill="#E89B7A" opacity="0.7"/><circle cx="98" cy="78" r="4" fill="#E89B7A" opacity="0.7"/>${eyes}</svg>`
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
    let expression = 'peek'

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
        if (responses && responses.length >= 1) {
          const result = calc(responses.map(r => r.answers))
          typeName = result.typeName
          score = result.score
          expression = result.expression
        } else {
          isPending = true
        }
      }
    }

    const showEvaluate = mode === 'test'
    
    // 모드별 표정
    let displayExpression = expression
    if (showEvaluate) displayExpression = 'peek'  // 테스트 페이지: 흘끔
    if (isPending) displayExpression = 'sleepy'   // 대기중: 졸림

    const mascotUrl = mascotDataUrl(displayExpression)

    return new ImageResponse(
      (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex',
          background: '#F5E6D8',
          position: 'relative',
        }}>
          {/* 배경 장식 - 큰 노란 원 */}
          <div style={{
            display: 'flex',
            position: 'absolute',
            top: -100, right: -100,
            width: 400, height: 400,
            background: '#FFD96B',
            borderRadius: '50%',
            opacity: 0.3,
          }} />
          
          {/* 배경 장식 - 산호 점들 */}
          <div style={{
            display: 'flex',
            position: 'absolute',
            bottom: 60, left: 80,
            width: 12, height: 12,
            background: '#C97D5A',
            borderRadius: '50%',
          }} />
          <div style={{
            display: 'flex',
            position: 'absolute',
            top: 80, left: 60,
            width: 8, height: 8,
            background: '#C97D5A',
            borderRadius: '50%',
            opacity: 0.5,
          }} />

          {/* 메인 컨텐츠 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '50px 60px',
            position: 'relative',
            zIndex: 1,
          }}>
            {/* 상단 로고 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{
                display: 'flex',
                width: 60, height: 60,
                background: '#2C1810',
                borderRadius: 16,
                alignItems: 'center', justifyContent: 'center',
                fontSize: 32, fontWeight: 900, color: '#fff',
              }}>F</div>
              <div style={{
                display: 'flex',
                fontSize: 32, fontWeight: 900,
                color: '#2C1810',
                letterSpacing: 2,
              }}>FPTI</div>
            </div>

            {/* 본문 영역 */}
            <div style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 30,
            }}>
              {/* 좌측 텍스트 */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                {showEvaluate ? (
                  <>
                    <div style={{ display: 'flex', fontSize: 30, color: '#6B5544', marginBottom: 12 }}>
                      {nickname || '친구'}의 인성을
                    </div>
                    <div style={{
                      display: 'flex',
                      fontSize: 76, fontWeight: 900, color: '#2C1810',
                      lineHeight: 1.1,
                    }}>
                      <div style={{
                        display: 'flex',
                        background: '#FFD96B',
                        padding: '4px 20px',
                        borderRadius: 16,
                        border: '4px solid #2C1810',
                        boxShadow: '0 6px 0 #C97D5A',
                      }}>
                        평가해주세요
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      fontSize: 24, color: '#6B5544', marginTop: 28,
                      gap: 12,
                    }}>
                      <div style={{ display: 'flex' }}>📝 28문항</div>
                      <div style={{ display: 'flex' }}>·</div>
                      <div style={{ display: 'flex' }}>⏱️ 2분</div>
                    </div>
                  </>
                ) : isPending ? (
                  <>
                    <div style={{ display: 'flex', fontSize: 30, color: '#6B5544', marginBottom: 12 }}>
                      {nickname}님의
                    </div>
                    <div style={{
                      display: 'flex',
                      fontSize: 76, fontWeight: 900, color: '#2C1810',
                      lineHeight: 1.1,
                    }}>
                      <div style={{
                        display: 'flex',
                        background: '#FFD96B',
                        padding: '4px 20px',
                        borderRadius: 16,
                        border: '4px solid #2C1810',
                        boxShadow: '0 6px 0 #C97D5A',
                      }}>
                        결과 대기중
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      fontSize: 22, color: '#6B5544', marginTop: 24,
                    }}>
                      친구가 답하면 결과가 공개돼요
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', fontSize: 28, color: '#6B5544', marginBottom: 12 }}>
                      {nickname}님의 결과는
                    </div>
                    <div style={{
                      display: 'flex',
                      fontSize: 64, fontWeight: 900, color: '#2C1810',
                      lineHeight: 1.1,
                    }}>
                      <div style={{
                        display: 'flex',
                        background: '#FFD96B',
                        padding: '4px 20px',
                        borderRadius: 16,
                        border: '4px solid #2C1810',
                        boxShadow: '0 6px 0 #C97D5A',
                      }}>
                        {typeName}
                      </div>
                    </div>
                    {score !== null && (
                      <div style={{
                        display: 'flex',
                        fontSize: 44, color: '#2C1810', marginTop: 28,
                        fontWeight: 900,
                      }}>
                        {score}<span style={{ display: 'flex', fontSize: 28, color: '#9B8268', marginLeft: 6 }}>/ 100</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 우측 마스코트 */}
              <div style={{
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* 햇살 배경 */}
                <div style={{
                  display: 'flex',
                  position: 'absolute',
                  width: 320, height: 320,
                  background: '#FFD96B',
                  borderRadius: '50%',
                  opacity: 0.4,
                }} />
                <img src={mascotUrl} width="360" height="360" alt="" style={{ position: 'relative' }} />
              </div>
            </div>

            {/* 하단 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '2px dashed #C97D5A',
            }}>
              <div style={{ display: 'flex', fontSize: 22, color: '#9B8268' }}>
                친구가 답하는 인성 테스트
              </div>
              <div style={{ display: 'flex', fontSize: 24, fontWeight: 900, color: '#2C1810' }}>
                fpti.kr
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch (e) {
    return new Response(`OG Error: ${(e as Error).message}`, { status: 500 })
  }
}
