import { ImageResponse } from 'next/og'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const REVERSE = [4, 9, 11, 12, 17, 22, 23, 24, 25, 26, 28]

interface TypeDetail {
  identity: string
  strength: string
  tags: string[]
  expression: string
}

const TYPE_INFO: Record<string, TypeDetail> = {
  '성인군자': {
    identity: '친구들이 진심으로 좋은 사람으로 통합니다. 거짓말을 잘 못하고, 화를 잘 안 내며, 험담에도 잘 끼지 않아요.',
    strength: '한결같은 신뢰감. 당신 앞에서는 친구들이 위선을 떨 필요가 없습니다.',
    tags: ['성인급', '무결점', '멸종위기'], expression: 'smile',
  },
  '걸어다니는 힐링': {
    identity: '말수가 많지 않을 수 있지만, 같이 있으면 이상하게 마음이 놓여요. 친구들은 힘들 때 자기도 모르게 당신을 찾아옵니다.',
    strength: '타인의 감정을 알아채는 능력이 뛰어나요. 말하지 않아도 분위기를 읽고 위로를 건넵니다.',
    tags: ['정신적안정제', '말없는위로', '소진주의'], expression: 'smile',
  },
  '다정한 호구': {
    identity: '기본적으로 착한 사람입니다. 부탁을 잘 거절하지 못하고, 거절했더라도 결국엔 들어주게 돼요.',
    strength: '일관된 친절. 한결같은 다정함. 당신 옆에 있으면 마음이 편해진다는 친구가 많아요.',
    tags: ['No못함', '친절무한리필', '호구졸업반'], expression: 'sleepy',
  },
  '상식선 인간': {
    identity: '놀랍게도 가장 받기 힘든 유형입니다. 약속 시간 지키고, 빌린 돈 돌려주고, 상대방 말을 끝까지 듣는 일을 그냥 합니다.',
    strength: '예측 가능성. 친구들은 당신과 약속하면 자연스럽게 믿어요. 관계에서 가장 중요한 자산입니다.',
    tags: ['정상인', '기본기만렙', '평균수호자'], expression: 'peek',
  },
  '무난무취형': {
    identity: '갈등을 만들지 않는 사람입니다. 강하게 주장하지도, 강하게 반대하지도 않아요. 친구들은 편안함을 느낍니다.',
    strength: '중립적인 위치. 친구들 사이에 갈등이 생겨도 어느 편에도 치우치지 않아 평화의 매개자가 됩니다.',
    tags: ['존재감논란', '특색없음', '무색무취'], expression: 'sleepy',
  },
  '은근한 빌런': {
    identity: '표면적으로는 별다른 문제가 없는 사람입니다. 그런데 친구들이 함께 있을 때 미세한 불편함을 느껴요.',
    strength: '영리합니다. 상황을 빠르게 파악하고 본인에게 유리한 방향을 잘 찾아요. 사회적 감각이 좋습니다.',
    tags: ['겉속다름', '계산적', '속내따로'], expression: 'smirk',
  },
  '뒷담화 챔피언': {
    identity: '이야기 능력이 뛰어난 사람입니다. 남의 일을 재미있게 풀어내는 재주가 있어요. 친구들은 당신과 있으면 시간 가는 줄 모릅니다.',
    strength: '관찰력과 화술. 사람 관계의 미묘한 부분을 잘 포착하고 흥미롭게 풀어내는 능력이 있어요.',
    tags: ['입방정', '가십연구원', '뒤에선검사'], expression: 'smirk',
  },
  '기분파 폭군': {
    identity: '감정 표현이 솔직한 사람입니다. 좋을 때는 누구보다 따뜻하고 재미있어요. 다만 기분이 안 좋을 때는 분위기가 주변에 퍼집니다.',
    strength: '감정에 솔직함. 가식이 없고, 좋아하는 마음을 숨기지 않아요. 즐거울 때 함께 있으면 정말 즐겁습니다.',
    tags: ['기분존중', '감정날씨', '눈치제공자'], expression: 'shock',
  },
  '감정 흡혈귀': {
    identity: '감정의 깊이가 큰 사람입니다. 본인 감정을 강하게 느끼고, 그걸 친구들과 나누고 싶어해요.',
    strength: '자기 감정을 솔직하게 표현하는 용기. 많은 사람들이 못 하는 일이에요. 친구들도 자기 감정을 더 들여다보게 됩니다.',
    tags: ['영혼고갈', '배터리방전', '일방통행'], expression: 'shock',
  },
  '허당 귀요미': {
    identity: '점수와 무관하게 사랑받는 캐릭터입니다. 실수를 자주 하는데 그게 미운 게 아니라 귀엽게 느껴져요.',
    strength: '친밀감 자석. 친구들이 가까이 다가오게 만드는 분위기를 가지고 있어요. 어색한 자리도 풀어줍니다.',
    tags: ['귀여움무기', '허당력만렙', '유효기간있음'], expression: 'smile',
  },
  '관종 빌런': {
    identity: '분위기 메이커입니다. 모임의 중심에 있고 싶어하고, 그 자리에 가장 잘 어울리는 캐릭터예요.',
    strength: '존재감과 에너지. 무리에 활기를 불어넣는 능력이 있고, 사람들이 자연스럽게 따라옵니다.',
    tags: ['관심없으면불안', '모임의태양', '조연싫음'], expression: 'shock',
  },
  '순수악': {
    identity: '친구들이 일관되게 부정적인 평가를 한 매우 드문 케이스입니다. 한번쯤 멈춰서 돌아볼 신호로 보면 좋아요.',
    strength: '이런 결과를 받아도 끝까지 보고 있다는 것 자체가 자기성찰의 시작이에요. 자기를 객관적으로 보려는 용기는 흔치 않습니다.',
    tags: ['극희귀', '관계점검', '적신호'], expression: 'smirk',
  },
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

    if (!token) return new Response('Token required', { status: 400 })

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
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          background: '#F5E6D8', padding: 50,
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', flex: 1,
            background: '#FFF8EE', borderRadius: 40,
            border: '6px solid #2C1810',
            padding: '40px 50px', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', fontSize: 24, color: '#9B8268', marginBottom: 20 }}>
              FPTI No.{cardId}
            </div>

            <div style={{
              display: 'flex', width: 320, height: 320,
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 20,
            }}>
              <img src={mascotUrl} width={320} height={320} alt="" />
            </div>

            <div style={{ display: 'flex', fontSize: 26, color: '#9B8268', marginBottom: 6 }}>
              인성 점수
            </div>

            <div style={{
              display: 'flex', fontSize: 110, fontWeight: 900,
              color: '#2C1810', marginBottom: 24,
              alignItems: 'baseline',
            }}>
              {result.score}
              <span style={{ display: 'flex', fontSize: 44, color: '#9B8268', marginLeft: 10 }}>
                / 100
              </span>
            </div>

            <div style={{
              display: 'flex', fontSize: 64, fontWeight: 900,
              color: '#2C1810', padding: '10px 28px',
              background: '#FFD96B', borderRadius: 24,
              border: '4px solid #2C1810', marginBottom: 24,
            }}>
              {result.typeName}
            </div>

            <div style={{ display: 'flex', marginBottom: 30 }}>
              {typeInfo.tags.map((tag, i) => (
                <div key={i} style={{
                  display: 'flex', fontSize: 22,
                  padding: '6px 16px', borderRadius: 999,
                  background: '#fff', color: '#6B5544',
                  border: '2px solid #E5D4C0',
                  marginRight: i < typeInfo.tags.length - 1 ? 10 : 0,
                }}>
                  #{tag}
                </div>
              ))}
            </div>

            {/* 나는 이런 사람 */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              width: '100%', marginBottom: 20,
              padding: '20px 24px',
              background: '#fff', borderRadius: 16,
              border: '2px solid #E5D4C0',
            }}>
              <div style={{
                display: 'flex', fontSize: 22,
                color: '#C97D5A', fontWeight: 900,
                marginBottom: 10,
              }}>
                나는 이런 사람
              </div>
              <div style={{
                display: 'flex', fontSize: 24,
                color: '#2C1810', lineHeight: 1.5,
              }}>
                {typeInfo.identity}
              </div>
            </div>

            {/* 강점 */}
            <div style={{
              display: 'flex', flexDirection: 'column',
              width: '100%', marginBottom: 20,
              padding: '20px 24px',
              background: '#fff', borderRadius: 16,
              border: '2px solid #E5D4C0',
            }}>
              <div style={{
                display: 'flex', fontSize: 22,
                color: '#C97D5A', fontWeight: 900,
                marginBottom: 10,
              }}>
                강점
              </div>
              <div style={{
                display: 'flex', fontSize: 24,
                color: '#2C1810', lineHeight: 1.5,
              }}>
                {typeInfo.strength}
              </div>
            </div>

            <div style={{
              display: 'flex', fontSize: 22,
              color: '#9B8268', marginTop: 'auto',
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
