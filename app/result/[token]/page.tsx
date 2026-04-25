'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

const QUESTIONS: Record<number, string> = {
  1:"친구가 우울해 보일 때 먼저 말을 건다",
  2:"남의 얘기를 자기 얘기처럼 들어준다",
  3:"힘들 때 조언보다 위로가 먼저다",
  4:"상대방 말이 끝나기 전에 자기 할 말을 한다",
  5:"친구의 기분 변화를 잘 알아챈다",
  6:"약속 시간에 늦지 않는다",
  7:"한다고 한 일은 반드시 한다",
  8:"잘못했을 때 깔끔하게 사과한다",
  9:"일이 꼬이면 남 탓부터 찾는다",
  10:"비밀을 말해도 새어나가지 않을 것 같다",
  11:"허세나 과장이 심하다",
  12:"앞에서 하는 말과 뒤에서 하는 말이 다르다",
  13:"돈 관련된 일에 깔끔하다",
  14:"밥 먹을 때 다른 사람 속도에 맞춰 먹는다",
  15:"친구의 생일이나 기념일을 잘 챙긴다",
  16:"자기보다 친구가 편한 걸 먼저 생각한다",
  17:"약속 장소를 늘 자기 집 근처로 잡는다",
  18:"같이 있으면 웃음이 끊이지 않는다",
  19:"어색한 분위기를 잘 풀어준다",
  20:"드립 타율이 좋다",
  21:"같이 놀고 나면 또 부르고 싶다",
  22:"대화의 8할이 자기 얘기다",
  23:"기분 나쁘면 주변이 다 눈치 본다",
  24:"필요할 때만 연락이 온다",
  25:"손해 보는 일은 절대 하지 않는다",
}

interface TypeDetail {
  identity: string
  strength: string
  caution: string
  relationship: string
  tags: string[]
  expression: string
}

const TYPE_INFO: Record<string, TypeDetail> = {
  '성인군자': {
    identity: '성인군자는 친구들 사이에서 진심으로 좋은 사람으로 통합니다. 거짓말을 잘 못하고, 화를 잘 안 내며, 누군가의 험담에도 잘 끼지 않아요. 친구들은 종종 당신을 보며 "저 사람은 어떻게 저렇게 살까"라고 생각합니다.',
    strength: '한결같은 신뢰감. 당신 앞에서는 친구들이 위선을 떨 필요가 없습니다. 진심을 보여도 받아주는 사람이라는 걸 알기 때문이에요.',
    caution: '가끔은 너무 무결해서 거리감이 생깁니다. 친구들은 당신한테 본인의 어두운 면을 털어놓기 망설여요. 완벽함이 때로는 벽이 됩니다.',
    relationship: '친구들은 당신을 존경하고, 동시에 약간 어려워합니다. 친구로서 가까이 있고 싶지만, 본인의 흠을 의식하게 되거든요. 가끔은 당신이 약한 모습을 보여줘야 친구들도 마음을 엽니다.',
    tags: ['성인급', '무결점', '멸종위기'],
    expression: 'smile',
  },
  '걸어다니는 힐링': {
    identity: '걸어다니는 힐링은 말수가 많지 않을 수 있습니다. 그런데 같이 있으면 이상하게 마음이 놓여요. 친구들은 힘들 때 자기도 모르게 당신을 찾아옵니다. 조언이 필요해서가 아니라, 그냥 옆에 있고 싶어서요.',
    strength: '타인의 감정을 알아채는 능력이 뛰어납니다. 말하지 않아도 분위기를 읽고, 무리하지 않는 선에서 위로를 건네요. 친구들에게는 그게 정말 큰 힘이 됩니다.',
    caution: '다정함이 무한 자원은 아닙니다. 친구들의 감정을 받아주다 보면 정작 본인은 비어가는데, 당신은 그걸 잘 표현 못 해요. 그래서 어느 순간 조용히 지쳐버립니다.',
    relationship: '친구들은 당신을 정신적 안식처처럼 여깁니다. 그게 좋으면서도 무거울 때가 있어요. 받기만 하는 친구들 사이에서, 당신도 누군가에게 기댈 수 있는 관계를 찾아야 합니다.',
    tags: ['정신적안정제', '말없는위로', '소진주의'],
    expression: 'smile',
  },
  '다정한 호구': {
    identity: '다정한 호구는 기본적으로 착한 사람입니다. 부탁을 잘 거절하지 못하고, 거절했더라도 결국엔 들어주게 돼요. 친구들은 이걸 알고 있습니다. 일부는 매우 잘 활용하고 있고요.',
    strength: '일관된 친절. 한결같은 다정함. 당신 옆에 있으면 마음이 편해진다는 친구가 많아요. 누군가 힘들어할 때 가장 먼저 달려가는 사람이 바로 당신입니다.',
    caution: '"괜찮아"를 너무 자주 말합니다. 사실은 안 괜찮을 때도요. 부탁이 쌓이고, 본인은 점점 소진되고, 어느 날 갑자기 폭발하거나 조용히 사라지는 패턴이 반복돼요.',
    relationship: '친구들은 당신을 진심으로 좋아합니다. 그런데 일부는 당신이 거절 못 한다는 걸 편하게 이용해요. 거절은 관계를 망가뜨리는 게 아니라, 오히려 진짜 친구가 누구인지 보여주는 신호입니다.',
    tags: ['No못함', '친절무한리필', '호구졸업반'],
    expression: 'sleepy',
  },
  '상식선 인간': {
    identity: '상식선 인간은 놀랍게도 가장 받기 힘든 유형입니다. 약속 시간 지키고, 빌린 돈 돌려주고, 상대방 말이 끝날 때까지 기다리는 것. 이 평범한 일들을 모두가 하지는 않아요. 당신은 그냥 합니다.',
    strength: '예측 가능성. 친구들은 당신과 약속하면 "오겠지"라고 자연스럽게 믿어요. 이게 별거 아닌 것 같지만, 관계에서 가장 중요한 자산입니다.',
    caution: '가끔은 당신의 평범한 기준이 누군가에게는 부담일 수 있어요. 본인은 당연한 건데, 못 지키는 사람한테는 압박이 되거든요. 너무 모범생 같은 거리감이 생기지 않게 가끔 빈틈도 보여주세요.',
    relationship: '친구들은 당신을 신뢰합니다. 큰 문제가 생기면 당신부터 떠올려요. 다만 너무 정석적이라 가벼운 농담 자리에 자꾸 빠지게 될 수 있어요. 평균의 수호자도 가끔은 헛소리를 해야 합니다.',
    tags: ['정상인', '기본기만렙', '평균수호자'],
    expression: 'peek',
  },
  '무난무취형': {
    identity: '무난무취형은 갈등을 만들지 않는 사람입니다. 강하게 주장하지도, 강하게 반대하지도 않아요. 친구들은 당신과 있으면 편하다고 느낍니다. 다만 "어떤 사람이야?"라고 물으면 친구들도 한참 고민해요.',
    strength: '중립적인 위치. 친구들 사이에 갈등이 생겨도 당신은 어느 편에도 치우치지 않아요. 그래서 모든 그룹에 자연스럽게 어울릴 수 있습니다. 평화의 매개자 역할을 자주 맡게 돼요.',
    caution: '존재감이 옅어서 기억에 잘 안 남습니다. 친구들 모임에서 당신이 빠져도 분위기가 크게 달라지지 않을 수 있어요. 무난함이 편안함이 아니라 무관심으로 흘러갈 수 있다는 게 함정입니다.',
    relationship: '친구들은 당신을 좋아하지만, 깊게 알지는 못합니다. 본인이 마음을 먼저 열지 않으면 관계는 늘 표면에서만 돌아요. 가끔은 본인 의견을 강하게 말해도 괜찮습니다. 친구들은 당신의 진짜 모습을 더 알고 싶어해요.',
    tags: ['존재감논란', '특색없음', '무색무취'],
    expression: 'sleepy',
  },
  '은근한 빌런': {
    identity: '은근한 빌런은 표면적으로는 별다른 문제가 없는 사람입니다. 그런데 친구들이 함께 있을 때 미세한 불편함을 느껴요. 직접적으로 뭐가 문제라고 말하기는 어려운데, 어딘가 계산적이라는 느낌이 들거든요.',
    strength: '영리합니다. 상황을 빠르게 파악하고, 본인에게 유리한 방향을 잘 찾아요. 사회적인 감각이 좋아서 어느 그룹에서도 적응을 잘 합니다.',
    caution: '친구들은 당신의 진심이 어디 있는지 가끔 헷갈려요. 친절한 말 뒤에 어떤 의도가 있나 의심하게 될 때가 있습니다. 본인은 그냥 효율적으로 행동한 것뿐인데, 받아들이는 사람은 차갑게 느낄 수 있어요.',
    relationship: '친구들은 당신과 거리감을 두기 시작합니다. 가까이 다가오기보다는 적당한 선을 유지하려고 해요. 가끔은 손해 보는 행동, 계산 없는 다정함을 보여주는 게 관계를 깊게 만들어줍니다.',
    tags: ['겉속다름', '계산적', '속내따로'],
    expression: 'smirk',
  },
  '뒷담화 챔피언': {
    identity: '뒷담화 챔피언은 이야기 능력이 뛰어난 사람입니다. 남의 일을 재미있게 풀어내는 재주가 있어요. 친구들은 당신과 있으면 시간 가는 줄 모릅니다. 다만 그 자리에 없는 친구의 얘기가 자주 등장한다는 게 함정이에요.',
    strength: '관찰력과 화술. 사람 관계의 미묘한 부분을 잘 포착하고, 그걸 흥미롭게 풀어낼 수 있어요. 이 능력 자체는 정말 훌륭한 자질입니다.',
    caution: '친구들은 당신과 있을 때 즐겁지만, 자리를 떠난 뒤에는 살짝 긴장하기도 합니다. "내 얘기도 다른 데서 저렇게 하지 않을까?" 하는 생각이 드는 거죠. 재미있는 화제를 찾는 거랑, 친구를 화제로 만드는 건 조금 달라요.',
    relationship: '친구들은 당신과 즐거운 시간을 보내지만, 진짜 비밀은 잘 털어놓지 않게 돼요. 신뢰는 작은 비밀을 지키는 데서 시작됩니다. 화제 거리를 찾는 건 자제하면 친구들이 더 마음을 열어요.',
    tags: ['입방정', '가십연구원', '뒤에선검사'],
    expression: 'smirk',
  },
  '기분파 폭군': {
    identity: '기분파 폭군은 감정 표현이 솔직한 사람입니다. 좋을 때는 누구보다 따뜻하고 재미있어요. 다만 기분이 안 좋을 때는 그 분위기가 주변 전체에 퍼집니다. 친구들은 당신의 표정을 살피며 하루를 시작하기도 해요.',
    strength: '감정에 솔직함. 가식이 없고, 좋아하는 마음을 숨기지 않아요. 당신이 즐거울 때 함께 있으면 정말 즐거운 시간이 됩니다.',
    caution: '본인의 기분이 주변에 너무 강하게 영향을 미칩니다. 친구들은 당신이 안 좋아 보이면 자기 일처럼 신경을 쓰게 돼요. 그게 매번 반복되면 친구들도 점점 지칩니다.',
    relationship: '친구들은 당신을 좋아하지만, 가끔 눈치를 봐야 한다는 부담이 있어요. 기분 좋은 날만 만나고 싶어지는 친구가 생길 수도 있습니다. 본인의 기분과 친구를 대하는 태도를 조금 분리해보면 관계가 훨씬 편해져요.',
    tags: ['기분존중', '감정날씨', '눈치제공자'],
    expression: 'shock',
  },
  '감정 흡혈귀': {
    identity: '감정 흡혈귀는 감정의 깊이가 큰 사람입니다. 본인 감정을 강하게 느끼고, 그걸 친구들과 나누고 싶어해요. 친구들은 당신을 진심으로 걱정합니다. 다만 대화가 늘 당신 얘기로 흘러간다는 걸 살짝 느끼고 있어요.',
    strength: '자기 감정을 솔직하게 표현하는 용기. 많은 사람들이 못 하는 일이에요. 당신 덕분에 친구들도 자기 감정을 더 들여다보게 됩니다.',
    caution: '친구들과 만나고 나면 친구들이 조금 지쳐 보일 수 있어요. 본인이 의도한 건 아니지만, 감정의 무게를 친구들이 받아주는 패턴이 반복되거든요. 친구는 위로를 주고받는 관계지, 일방적으로 받아주는 사람은 아닙니다.',
    relationship: '친구들은 당신과 거리를 두려는 게 아니라, 잠시 숨을 고르는 거예요. 친구한테만 의지하지 말고, 전문가의 도움이나 다른 출구도 함께 찾아보세요. 감정의 무게는 분산될수록 가벼워집니다.',
    tags: ['영혼고갈', '배터리방전', '일방통행'],
    expression: 'shock',
  },
  '허당 귀요미': {
    identity: '허당 귀요미는 점수와 무관하게 사랑받는 캐릭터입니다. 실수를 자주 하는데 그게 미운 게 아니라 귀엽게 느껴져요. 친구들은 당신을 보며 "쟤는 뭘 해도 용서가 된다"고 말합니다.',
    strength: '친밀감 자석. 친구들이 가까이 다가오게 만드는 분위기를 가지고 있어요. 어색한 자리에서도 당신이 있으면 분위기가 풀립니다. 이건 정말 흔치 않은 재능이에요.',
    caution: '허당력은 나이와 함께 점점 약해지는 자원입니다. 20대까지는 귀여움으로 통하지만, 점점 더 책임감이나 신뢰감을 보여줘야 하는 순간이 늘어요. 매력은 유지하되, 진지한 면도 함께 키워가면 좋아요.',
    relationship: '친구들은 당신을 사랑합니다. 다만 중요한 일을 맡길 때는 살짝 망설일 수 있어요. 본인이 진지하게 임해야 할 때를 구분할 수 있다면, 사랑받으면서도 신뢰까지 얻을 수 있습니다.',
    tags: ['귀여움무기', '허당력만렙', '유효기간있음'],
    expression: 'smile',
  },
  '관종 빌런': {
    identity: '관종 빌런은 분위기 메이커입니다. 모임의 중심에 있고 싶어하고, 그 자리에 가장 잘 어울리는 캐릭터예요. 친구들은 당신과 있으면 절대 지루하지 않다고 말합니다. 다만 가끔은 너무 본인 중심이라는 평가도 있어요.',
    strength: '존재감과 에너지. 무리에 활기를 불어넣는 능력이 있고, 사람들이 자연스럽게 당신을 따라옵니다. 분위기를 만드는 건 아무나 할 수 있는 일이 아니에요.',
    caution: '가끔은 다른 친구들의 자리도 비워둬야 합니다. 본인이 늘 주연인 자리에서, 다른 친구들은 점점 조연이 되는 게 부담스러울 수 있어요. 한 번씩 다른 친구가 빛날 수 있게 자리를 양보해주는 것도 매력입니다.',
    relationship: '친구들은 당신을 좋아하지만, 가끔은 조용한 자리도 필요해요. 화려한 사람과 깊은 대화를 나누는 건 또 다른 영역이거든요. 조용히 친구의 이야기를 들어주는 시간도 만들어보세요.',
    tags: ['관심없으면불안', '모임의태양', '조연싫음'],
    expression: 'shock',
  },
  '순수악': {
    identity: '순수악은 친구들이 일관되게 부정적인 평가를 한 매우 드문 케이스입니다. 이건 결과 그대로 받아들이기보다는, 한번쯤 멈춰서 돌아볼 신호로 보면 좋아요. 본인의 행동이 친구들에게 어떻게 닿는지 솔직하게 점검해볼 시점입니다.',
    strength: '이런 결과를 받아도 끝까지 보고 있다는 것 자체가 자기성찰의 시작이에요. 자기를 객관적으로 보려는 용기는 쉽게 가질 수 있는 게 아닙니다.',
    caution: '친구들이 어디서 불편함을 느꼈는지 천천히 돌아보면 좋아요. 한두 가지 행동 패턴이 반복되고 있을 가능성이 높습니다. 본인은 의도하지 않았더라도, 친구들에게는 누적된 인상이 남아있어요.',
    relationship: '관계는 한 번에 좋아지지 않지만, 한 번에 망가지지도 않아요. 작은 변화부터 시작해보세요. 솔직한 사과, 진심 어린 관심, 일관된 행동. 이것만 꾸준히 해도 친구들의 평가는 천천히 바뀝니다.',
    tags: ['극희귀', '관계점검', '적신호'],
    expression: 'smirk',
  },
}

function MascotSvg({ expression, size = 120 }: { expression: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="72" cy="128" rx="50" ry="6" fill="rgba(0,0,0,0.08)" />
      <circle cx="70" cy="65" r="55" fill="#FFD96B" stroke="#2C1810" strokeWidth="3.5" />
      <circle cx="42" cy="78" r="4" fill="#E89B7A" opacity="0.7" />
      <circle cx="98" cy="78" r="4" fill="#E89B7A" opacity="0.7" />
      {expression === 'peek' && (<>
        <path d="M 45 60 Q 53 56 61 60" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="92" cy="60" r="6" fill="#2C1810" />
        <circle cx="94" cy="58" r="2" fill="#fff" />
        <path d="M 60 85 Q 70 92 82 85" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>)}
      {expression === 'smile' && (<>
        <path d="M 42 58 Q 50 50 58 58" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 82 58 Q 90 50 98 58" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 55 82 Q 70 95 85 82" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>)}
      {expression === 'shock' && (<>
        <circle cx="50" cy="58" r="5" fill="#2C1810" />
        <circle cx="90" cy="58" r="5" fill="#2C1810" />
        <ellipse cx="70" cy="88" rx="8" ry="10" fill="#2C1810" />
      </>)}
      {expression === 'smirk' && (<>
        <path d="M 45 60 L 60 60" stroke="#2C1810" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 80 60 L 95 60" stroke="#2C1810" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 58 88 Q 75 82 85 90" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>)}
      {expression === 'sleepy' && (<>
        <path d="M 45 62 Q 53 66 61 62" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 82 62 Q 90 66 98 62" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <ellipse cx="70" cy="88" rx="6" ry="3" fill="#2C1810" />
      </>)}
    </svg>
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function DescBox({ title, content, dotColor }: { title: string; content: string; dotColor: string }) {
  return (
    <div style={{
      borderRadius: 16, padding: 18, marginTop: 12,
      background: '#fff', border: '1.5px solid #E5D4C0',
      boxSizing: 'border-box', width: '100%',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }} />
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#2C1810' }}>
          {title}
        </strong>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#2C1810', margin: 0 }}>
        {content}
      </p>
    </div>
  )
}

export default function ResultPage() {
  const { token } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const fetchResult = () => {
      fetch('/api/get-result?token=' + token).then(r => r.json()).then(d => { setData(d); setLoading(false) })
    }
    fetchResult()
    const interval = setInterval(fetchResult, 10000)
    return () => clearInterval(interval)
  }, [token])

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const fetchImageBlob = async (): Promise<Blob | null> => {
    try {
      const res = await fetch('/api/result-image?token=' + token)
      if (!res.ok) return null
      return await res.blob()
    } catch (e) {
      return null
    }
  }

  const handleSaveImage = async () => {
    setGenerating(true)
    const blob = await fetchImageBlob()
    if (!blob) {
      alert('이미지 생성에 실패했어요.')
      setGenerating(false)
      return
    }
    const filename = 'FPTI_' + (data?.nickname || 'result') + '.png'
    downloadBlob(blob, filename)
    setGenerating(false)
    setShowShareModal(false)
  }

  const handleSystemShare = async () => {
    setGenerating(true)
    const blob = await fetchImageBlob()
    if (!blob) {
      alert('이미지 생성에 실패했어요.')
      setGenerating(false)
      return
    }
    const filename = 'FPTI_' + (data?.nickname || 'result') + '.png'
    const file = new File([blob], filename, { type: 'image/png' })
    const shareData: any = {
      title: 'FPTI 결과',
      text: '나 ' + data.typeName + '래 ㅋㅋ\n' + data.score + '/100점\n\nfpti.kr',
    }
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        shareData.files = [file]
      } else {
        shareData.url = 'https://fpti.kr/result/' + token
      }
      await navigator.share(shareData)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        downloadBlob(blob, filename)
        alert('공유가 안 돼서 이미지를 저장했어요.')
      }
    }
    setGenerating(false)
    setShowShareModal(false)
  }

  const handleInstagramStory = async () => {
    setGenerating(true)
    const blob = await fetchImageBlob()
    if (!blob) {
      alert('이미지 생성에 실패했어요.')
      setGenerating(false)
      return
    }
    const filename = 'FPTI_' + (data?.nickname || 'result') + '.png'
    navigator.clipboard.writeText('https://fpti.kr')
    downloadBlob(blob, filename)
    setTimeout(() => {
      window.location.href = 'instagram://story-camera'
      setTimeout(() => {
        alert('이미지를 저장했어요!\n\n갤러리에서 스토리에 올려주세요 📸')
      }, 1500)
    }, 800)
    setGenerating(false)
    setShowShareModal(false)
  }

  const handleShareMore = () => {
    const url = 'https://fpti.kr/test/' + token
    const text = '내 인성 평가해줘 🥺\n\n👉 ' + url
    if (navigator.share) {
      navigator.share({ title: 'FPTI', text, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9B8268', fontSize: 13 }}>집계 중...</p>
    </main>
  )

  if (data?.empty) return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', paddingLeft: 16, paddingRight: 16 }}>
      <div style={{ maxWidth: 448, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box', paddingTop: 48, paddingBottom: 48 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#2C1810', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 14,
            }}>F</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>FPTI</span>
          </div>
          <button onClick={() => router.push('/')} style={{
            fontSize: 12, padding: '6px 12px', borderRadius: 999,
            color: '#6B5544', background: '#fff', border: '1.5px solid #E5D4C0', cursor: 'pointer',
          }}>처음으로</button>
        </header>
        <div style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 24 }}>🫥</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#2C1810', marginBottom: 16, lineHeight: 1.3 }}>
            아직 답변이 없어요
          </h1>
          <p style={{ fontSize: 13, marginBottom: 36, color: '#6B5544' }}>
            친구가 답해야 결과가 나와요.
          </p>
          <button onClick={handleShareMore} style={{
            width: '100%', padding: 16, fontSize: 15, borderRadius: 16,
            background: '#2C1810', color: '#fff',
            fontFamily: 'var(--font-display)', border: 'none',
            boxShadow: '0 4px 0 #C97D5A', cursor: 'pointer', boxSizing: 'border-box',
          }}>
            친구에게 평가 부탁하기
          </button>
        </div>
      </div>
    </main>
  )

  if (data?.locked) return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', paddingLeft: 16, paddingRight: 16 }}>
      <div style={{ maxWidth: 448, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box', paddingTop: 32, paddingBottom: 48 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#2C1810', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 14,
            }}>F</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>FPTI</span>
          </div>
          <button onClick={() => router.push('/')} style={{
            fontSize: 12, padding: '6px 12px', borderRadius: 999,
            color: '#6B5544', background: '#fff', border: '1.5px solid #E5D4C0', cursor: 'pointer',
          }}>처음으로</button>
        </header>

        <div style={{
          background: '#FFF8EE',
          borderRadius: 20,
          padding: '32px 20px',
          border: '2.5px solid #2C1810',
          boxShadow: '0 6px 0 #C97D5A',
          boxSizing: 'border-box',
          width: '100%',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute',
                width: 140, height: 140,
                background: '#FFD96B',
                borderRadius: '50%',
                opacity: 0.35,
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <MascotSvg expression="sleepy" size={150} />
              </div>
            </div>
          </div>

          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#2C1810', marginBottom: 12, lineHeight: 1.3 }}>
            결과 준비 중
          </h1>

          <div style={{ fontSize: 14, color: '#5A4030', lineHeight: 1.7, marginBottom: 20 }}>
            지금까지 <strong style={{ color: '#2C1810', fontSize: 18 }}>{data.count}명</strong>이 답변했어요.<br />
            <strong style={{ color: '#C97D5A' }}>{data.needMore}명</strong>이 더 답하면 결과가 공개돼요.
          </div>

          <div style={{
            background: '#fff', padding: 12, borderRadius: 12,
            border: '1.5px dashed #E5D4C0',
            fontSize: 11, color: '#6B5544', lineHeight: 1.6,
          }}>
            💡 한 명의 답변만으로 결과가 나오면<br />
            정확하지 않을 수 있어서 잠시 기다려요.
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={handleShareMore} style={{
            width: '100%', padding: 16, fontSize: 15, borderRadius: 16,
            background: '#2C1810', color: '#fff',
            fontFamily: 'var(--font-display)', border: 'none',
            cursor: 'pointer', boxShadow: '0 4px 0 #C97D5A', boxSizing: 'border-box',
          }}>
            친구에게 평가 부탁하기
          </button>

          <button onClick={() => router.push('/')} style={{
            width: '100%', padding: 12, fontSize: 12, borderRadius: 16,
            background: 'transparent', color: '#9B8268',
            border: '1px solid #E5D4C0',
            fontFamily: 'var(--font-mono)', cursor: 'pointer', boxSizing: 'border-box',
          }}>
            나도 평가받기
          </button>
        </div>
      </div>
    </main>
  )

  if (!data?.typeName) return null
  const typeInfo = TYPE_INFO[data.typeName] || TYPE_INFO['무난무취형']

  return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810', paddingLeft: 16, paddingRight: 16, paddingBottom: 48 }}>
      <div style={{ maxWidth: 448, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' }}>
        <header style={{ paddingTop: 20, paddingBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#2C1810', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 14,
            }}>F</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>FPTI</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
              {data.count}명 응답
            </span>
            <button onClick={() => router.push('/')} style={{
              fontSize: 11, padding: '6px 12px', borderRadius: 999,
              color: '#6B5544', background: '#fff', border: '1.5px solid #E5D4C0', cursor: 'pointer',
            }}>처음으로</button>
          </div>
        </header>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, paddingLeft: 4, paddingRight: 4 }}>
          <span style={{ fontSize: 11, color: '#9B8268', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            {data.accuracyLabel || '결과'}
          </span>
          <div style={{ flex: 1, height: 4, background: '#E5D4C0', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: (data.accuracyPercent || 50) + '%',
              background: '#C97D5A',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <span style={{ fontSize: 11, color: '#9B8268', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            {data.accuracyPercent || 50}%
          </span>
        </div>

        <div style={{
          background: '#FFF8EE',
          borderRadius: 20,
          padding: '24px 16px 28px',
          border: '2.5px solid #2C1810',
          boxShadow: '0 6px 0 #C97D5A',
          boxSizing: 'border-box',
          width: '100%',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 10, left: 10, width: 8, height: 8, background: '#C97D5A', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, background: '#C97D5A', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: 10, left: 10, width: 8, height: 8, background: '#C97D5A', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: 10, right: 10, width: 8, height: 8, background: '#C97D5A', borderRadius: '50%' }} />

          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
              FPTI No.{(token as string).slice(0, 4).toUpperCase()}
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 180, marginTop: 12, marginBottom: 12 }}>
            <div style={{
              position: 'absolute',
              width: 160, height: 160,
              background: '#FFD96B',
              borderRadius: '50%',
              opacity: 0.35,
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <MascotSvg expression={typeInfo.expression} size={160} />
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 11, marginBottom: 4, color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
              인성 점수
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, color: '#2C1810' }}>
              {data.score}
              <span style={{ fontSize: 22, color: '#9B8268', marginLeft: 4 }}>/ 100</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h1 style={{
              lineHeight: 1.2,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 7vw, 32px)',
              color: '#2C1810',
            }}>
              {data.typeName}
            </h1>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'center', gap: 6,
            marginBottom: 0, flexWrap: 'wrap',
            paddingLeft: 4, paddingRight: 4,
          }}>
            {typeInfo.tags.map((tag, i) => (
              <span key={i} style={{
                fontSize: 10, padding: '4px 8px', borderRadius: 999,
                background: '#fff', color: '#6B5544',
                border: '1px solid #E5D4C0',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap', flexShrink: 0,
              }}>
                #{tag}
              </span>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 12, borderTop: '1px dashed #E5D4C0' }}>
            <div style={{ fontSize: 11, color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
              {data.nickname}'s FPTI
            </div>
          </div>
        </div>

        <DescBox title="나는 이런 사람" content={typeInfo.identity} dotColor="#C97D5A" />
        <DescBox title="강점" content={typeInfo.strength} dotColor="#FFD96B" />
        <DescBox title="주의할 점" content={typeInfo.caution} dotColor="#9B8268" />
        <DescBox title="관계에서" content={typeInfo.relationship} dotColor="#2C1810" />

        {data.topItems && data.topItems.length > 0 && (
          <div style={{
            borderRadius: 16, padding: 18, marginTop: 20,
            background: '#fff', border: '1.5px solid #E5D4C0',
            boxSizing: 'border-box', width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C97D5A' }} />
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#2C1810' }}>
                친구들이 동의한 항목
              </strong>
            </div>
            {data.topItems.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <div style={{ flexShrink: 0, marginTop: 4, color: '#C97D5A', fontSize: 10 }}>●</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#2C1810' }}>{QUESTIONS[item.id]}</p>
              </div>
            ))}
          </div>
        )}

        {data.bottomItems && data.bottomItems.length > 0 && (
          <div style={{
            borderRadius: 16, padding: 18, marginTop: 12,
            background: '#fff', border: '1.5px solid #E5D4C0',
            boxSizing: 'border-box', width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2C1810' }} />
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#2C1810' }}>
                친구들이 동의 못한 항목
              </strong>
            </div>
            {data.bottomItems.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <div style={{ flexShrink: 0, marginTop: 4, color: '#2C1810', fontSize: 10 }}>●</div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: '#2C1810' }}>{QUESTIONS[item.id]}</p>
              </div>
            ))}
          </div>
        )}

        {data.count < 5 && (
          <div style={{
            borderRadius: 16, padding: 14, marginTop: 20,
            background: '#fff', border: '2px solid #C97D5A',
            boxSizing: 'border-box', width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ fontSize: 18, flexShrink: 0 }}>📊</div>
              <div style={{ minWidth: 0 }}>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 12, color: '#2C1810' }}>
                  더 정확한 결과 받기
                </strong>
                <p style={{ fontSize: 11, marginTop: 4, color: '#5A4030', lineHeight: 1.5 }}>
                  지금 <strong style={{ color: '#2C1810' }}>{data.count}명</strong>이 답했어요.{' '}
                  {data.count < 3 ? (3 - data.count) + '명만 더 답하면 정확도가 올라가요.' : (5 - data.count) + '명만 더 답하면 100%가 돼요.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => setShowShareModal(true)} style={{
            width: '100%', padding: 16, fontSize: 15, borderRadius: 16,
            background: '#2C1810', color: '#fff',
            fontFamily: 'var(--font-display)', border: 'none',
            cursor: 'pointer', boxShadow: '0 4px 0 #C97D5A', boxSizing: 'border-box',
          }}>
            📸 결과 자랑하기
          </button>

          <button onClick={handleShareMore} style={{
            width: '100%', padding: 14, fontSize: 13, borderRadius: 16,
            background: '#fff', color: '#2C1810',
            fontFamily: 'var(--font-display)',
            border: '2px solid #2C1810',
            cursor: 'pointer', boxSizing: 'border-box',
          }}>
            친구에게 평가 더 받기
          </button>

          <button onClick={() => {
            navigator.clipboard.writeText('https://fpti.kr/result/' + token)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }} style={{
            width: '100%', padding: 12, fontSize: 12, borderRadius: 16,
            background: 'transparent', color: copied ? '#2C1810' : '#6B5544',
            border: '1.5px solid ' + (copied ? '#2C1810' : '#E5D4C0'),
            fontFamily: 'var(--font-mono)', cursor: 'pointer', boxSizing: 'border-box',
          }}>
            {copied ? '✓ 결과 링크 복사됨' : '🔗 결과 링크 복사'}
          </button>

          <button onClick={() => router.push('/')} style={{
            width: '100%', padding: 12, fontSize: 12, borderRadius: 16,
            background: 'transparent', color: '#9B8268',
            border: '1px solid #E5D4C0',
            fontFamily: 'var(--font-mono)', cursor: 'pointer', boxSizing: 'border-box',
          }}>
            나도 평가받기
          </button>
        </div>
      </div>

      {showShareModal && (
        <div onClick={() => !generating && setShowShareModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#FFF8EE',
            borderRadius: '24px 24px 0 0',
            padding: 24, width: '100%', maxWidth: 480,
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: 40, height: 4, background: '#E5D4C0',
              borderRadius: 2, margin: '0 auto 20px',
            }} />

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, color: '#2C1810',
              textAlign: 'center', marginBottom: 4,
            }}>
              결과 공유하기
            </h3>
            <p style={{ fontSize: 12, color: '#9B8268', textAlign: 'center', marginBottom: 20 }}>
              결과를 친구들과 공유해보세요
            </p>

            {generating && (
              <div style={{ textAlign: 'center', padding: 20, color: '#6B5544', fontSize: 13 }}>
                이미지 생성 중...
              </div>
            )}

            {!generating && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {isMobile && (
                  <button onClick={handleInstagramStory} style={{
                    width: '100%', padding: 16, fontSize: 14,
                    borderRadius: 14,
                    background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxSizing: 'border-box',
                  }}>
                    <span style={{ fontSize: 18 }}>📷</span>
                    인스타 스토리에 공유
                  </button>
                )}

                {isMobile && typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button onClick={handleSystemShare} style={{
                    width: '100%', padding: 16, fontSize: 14,
                    borderRadius: 14,
                    background: '#2C1810', color: '#fff',
                    fontFamily: 'var(--font-display)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxSizing: 'border-box',
                  }}>
                    <span style={{ fontSize: 18 }}>📤</span>
                    카톡/다른 앱으로 공유
                  </button>
                )}

                <button onClick={handleSaveImage} style={{
                  width: '100%', padding: 16, fontSize: 14,
                  borderRadius: 14,
                  background: '#fff', color: '#2C1810',
                  fontFamily: 'var(--font-display)',
                  border: '2px solid #E5D4C0', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  boxSizing: 'border-box',
                }}>
                  <span style={{ fontSize: 18 }}>💾</span>
                  이미지 저장만 하기
                </button>

                <button onClick={() => setShowShareModal(false)} style={{
                  width: '100%', padding: 12, fontSize: 13,
                  borderRadius: 14, marginTop: 8,
                  background: 'transparent', color: '#9B8268',
                  fontFamily: 'var(--font-mono)',
                  border: 'none', cursor: 'pointer',
                  boxSizing: 'border-box',
                }}>
                  취소
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
