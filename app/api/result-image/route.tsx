import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const REVERSE = [4, 9, 11, 12, 17, 22, 23, 24, 25, 26, 28]

const TYPE_INFO: Record<string, { desc: string; tags: string[]; expression: string }> = {
  '성인군자':       { desc: '친구들이 진심으로 좋은 사람이라고 생각합니다.', tags: ['성인급', '무결점', '멸종위기'], expression: 'smile' },
  '걸어다니는 힐링': { desc: '같이 있으면 마음이 놓입니다.', tags: ['정신적안정제', '말없는위로', '소진주의'], expression: 'smile' },
  '다정한 호구':     { desc: '기본적으로 착합니다. 부탁을 잘 못 거절합니다.', tags: ['No못함', '친절무한리필', '호구졸업반'], expression: 'sleepy' },
  '상식선 인간':     { desc: '요즘 상식선 지키는 사람이 드물어요.', tags: ['정상인', '기본기만렙', '평균수호자'], expression: 'peek' },
  '무난무취형':      { desc: '나쁘지 않습니다. 좋지도 않습니다.', tags: ['존재감논란', '특색없음', '무색무취'], expression: 'sleepy' },
  '은근한 빌런':     { desc: '표면적으론 문제없는 사람.', tags: ['겉속다름', '계산적', '속내따로'], expression: 'smirk' },
  '뒷담화 챔피언':   { desc: '남 얘기를 너무 재밌게 합니다.', tags: ['입방정', '가십연구원', '뒤에선검사'], expression: 'smirk' },
  '기분파 폭군':     { desc: '기분 좋을 땐 당신만한 친구가 없습니다.', tags: ['기분존중', '감정날씨', '눈치제공자'], expression: 'shock' },
  '감정 흡혈귀':     { desc: '대화는 늘 당신 문제로 끝나요.', tags: ['영혼고갈', '배터리방전', '일방통행'], expression: 'shock' },
  '허당 귀요미':     { desc: '점수가 낮은데 왠지 용서됩니다.', tags: ['귀여움무기', '허당력만렙', '유효기간있음'], expression: 'smile' },
  '관종 빌런':       { desc: '관심을 위해서라면 뭐든 합니다.', tags: ['관심없으면불안', '모임의태양', '조연싫음'], expression: 'shock' },
  '순수악':         { desc: '관계를 다시 생각해볼 신호.', tags: ['극희귀', '관계점검', '적신호'], expression: 'smirk' },
}

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

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140"><circle cx="70" cy="65" r="55" fill="#FFD96B" stroke="#2C1810" stroke-width="3.5"/><circle cx="42" cy="78" r="4" fill="#E89B7A" opacity="0.7"/><circle cx="98" cy="78" r="4" fill="#E89B7A" opacity="0.7"/>${eyes}</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') || ''

    if (!token) {
      return new Response('Token required', { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: user } = await supabase
      .from('users').select('id, nickname').eq('share_token', token).single()

    if (!user) return new Response('Not found', { status: 404 })

    const { data: responses } = await supabase
      .from('responses').select('answers').eq('user_id', user.id)

    if (!responses || responses.length < 2) {
      return new Response('Not enough responses', { status: 400 })
    }

    const result = calc(responses.map(r => r.answers))
    const typeInfo = TYPE_INFO[result.typeName] || TYPE_INFO['무난무취형']
    const mascotUrl = mascotDataUrl(typeInfo.expression)
    const cardId = token.slice(0, 4).toUpperCase()

    return new ImageResponse(
      (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#F5E6D8',
          padding: 60,
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            background: '#FFF8EE',
            borderRadius: 40,
            border: '6px solid #2C1810',
            padding: '50px 40px',
            alignItems: 'center',
          }}>
            <div style={{
              display: 'flex',
              fontSize: 26,
              color: '#9B8268',
              marginBottom: 30,
            }}>
              FPTI No.{cardId}
            </div>

            <div style={{
              display: 'flex',
              width: 380,
              height: 380,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
              <img src={mascotUrl} width={380} height={380} alt="" />
            </div>

            <div style={{
              display: 'flex',
              fontSize: 28,
              color: '#9B8268',
              marginBottom: 8,
            }}>
              인성 점수
            </div>

            <div style={{
              display: 'flex',
              fontSize: 130,
              fontWeight: 900,
              color: '#2C1810',
              marginBottom: 30,
              alignItems: 'baseline',
            }}>
              {result.score}
              <span style={{
                display: 'flex',
                fontSize: 50,
                color: '#9B8268',
                marginLeft: 10,
              }}>
                / 100
              </span>
            </div>

            <div style={{
              display: 'flex',
              fontSize: 70,
              fontWeight: 900,
              color: '#2C1810',
              padding: '12px 32px',
              background: '#FFD96B',
              borderRadius: 24,
              border: '4px solid #2C1810',
              marginBottom: 30,
            }}>
              {result.typeName}
            </div>

            <div style={{
              display: 'flex',
              marginBottom: 30,
            }}>
              {typeInfo.tags.map((tag, i) => (
                <div key={i} style={{
                  display: 'flex',
                  fontSize: 26,
                  padding: '8px 20px',
                  borderRadius: 999,
                  background: '#fff',
                  color: '#6B5544',
                  border: '2px solid #E5D4C0',
                  marginRight: i < typeInfo.tags.length - 1 ? 12 : 0,
                }}>
                  #{tag}
                </div>
              ))}
            </div>

            <div style={{
              display: 'flex',
              fontSize: 28,
              color: '#5A4030',
              textAlign: 'center',
              padding: '0 40px',
            }}>
              {typeInfo.desc}
            </div>

            <div style={{
              display: 'flex',
              fontSize: 24,
              color: '#9B8268',
              marginTop: 'auto',
              paddingTop: 30,
            }}>
              {user.nickname}'s FPTI · fpti.kr
            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1920 }
    )
  } catch (e) {
    return new Response(`Error: ${(e as Error).message}`, { status: 500 })
  }
}
