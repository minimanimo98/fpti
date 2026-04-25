'use client'

import { useEffect, useState, useRef } from 'react'
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

const TYPE_INFO: Record<string, { desc: string; tags: string[]; expression: string }> = {
  '성인군자':       { desc: '친구들이 진심으로 좋은 사람이라고 생각합니다. 다만 너무 무결하다는 게 함정. 완벽함은 거리감을 만듭니다.', tags: ['성인급', '무결점', '멸종위기'], expression: 'smile' },
  '걸어다니는 힐링': { desc: '같이 있으면 마음이 놓입니다. 다만 그 다정함이 당신을 소진시킬 수 있어요.', tags: ['정신적안정제', '말없는위로', '소진주의'], expression: 'smile' },
  '다정한 호구':     { desc: '기본적으로 착합니다. 부탁을 잘 못 거절합니다. 친구들이 그걸 알고 있어요. 일부는 이용 중일지도.', tags: ['No못함', '친절무한리필', '호구졸업반'], expression: 'sleepy' },
  '상식선 인간':     { desc: '놀랍게도 이 점수가 제일 받기 힘듭니다. 요즘 상식선 지키는 사람이 드물어졌어요. 평균의 수호자.', tags: ['정상인', '기본기만렙', '평균수호자'], expression: 'peek' },
  '무난무취형':      { desc: '나쁘지 않습니다. 좋지도 않습니다. 해를 끼치지 않지만 기억에도 남지 않아요. 관계에서 의외로 치명적.', tags: ['존재감논란', '특색없음', '무색무취'], expression: 'sleepy' },
  '은근한 빌런':     { desc: '표면적으론 문제없는 사람. 그런데 친구들이 미세한 불편함을 느꼈어요. 뭔가 계산적이라는 감각.', tags: ['겉속다름', '계산적', '속내따로'], expression: 'smirk' },
  '뒷담화 챔피언':   { desc: '친구들은 당신 앞에서 웃습니다. 뒤돌아서면 조금 긴장합니다. 남 얘기를 너무 재밌게 합니다.', tags: ['입방정', '가십연구원', '뒤에선검사'], expression: 'smirk' },
  '기분파 폭군':     { desc: '기분 좋을 땐 당신만한 친구가 없습니다. 문제는 기분이 나쁠 때. 친구들은 표정을 살피며 하루를 시작해요.', tags: ['기분존중', '감정날씨', '눈치제공자'], expression: 'shock' },
  '감정 흡혈귀':     { desc: '당신과 얘기하면 친구들은 피곤해합니다. 대화는 늘 당신 문제로 끝나요. 친구는 치료사가 아니에요.', tags: ['영혼고갈', '배터리방전', '일방통행'], expression: 'shock' },
  '허당 귀요미':     { desc: '점수가 낮은데 왠지 용서됩니다. 왜냐하면 귀엽기 때문이에요. 다만 허당력은 나이와 반비례합니다.', tags: ['귀여움무기', '허당력만렙', '유효기간있음'], expression: 'smile' },
  '관종 빌런':       { desc: '관심을 위해서라면 뭐든 합니다. 재밌는 사람이라는 평가와 피곤한 사람이라는 평가가 공존해요.', tags: ['관심없으면불안', '모임의태양', '조연싫음'], expression: 'shock' },
  '순수악':         { desc: '친구들은 당신에 대해 일관되게 부정적인 평가를 내렸습니다. 관계를 다시 생각해볼 신호.', tags: ['극희귀', '관계점검', '적신호'], expression: 'smirk' },
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

export default function ResultPage() {
  const { token } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [generating, setGenerating] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchResult = () => {
      fetch(`/api/get-result?token=${token}`).then(r => r.json()).then(d => { setData(d); setLoading(false) })
    }
    fetchResult()
    const interval = setInterval(fetchResult, 10000)
    return () => clearInterval(interval)
  }, [token])

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  const generateImageBlob = async (): Promise<Blob | null> => {
    try {
      const response = await fetch(`/api/result-image?token=${token}`)
      if (!response.ok) return null
      return await response.blob()
    } catch (e) {
      return null
    }
    }

  const handleSaveImage = async () => {
    setGenerating(true)
    try {
      const blob = await generateImageBlob()
      if (!blob) { setGenerating(false); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `FPTI_${data?.nickname || 'result'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      alert('저장 실패. 다시 시도해주세요.')
    }
    setGenerating(false)
    setShowShareModal(false)
  }

  const handleSystemShare = async () => {
    setGenerating(true)
    try {
      const blob = await generateImageBlob()
      if (!blob) { setGenerating(false); return }
      const file = new File([blob], `FPTI_${data?.nickname}.png`, { type: 'image/png' })
      const shareData: any = {
        title: 'FPTI 결과',
        text: `나 ${data.typeName}래 ㅋㅋ\n${data.score}/100점\n\nfpti.kr`,
      }
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        shareData.files = [file]
      } else {
        shareData.url = `https://fpti.kr/result/${token}`
      }
      await navigator.share(shareData)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        alert('공유 실패. 이미지 저장 후 직접 올려주세요.')
      }
    }
    setGenerating(false)
    setShowShareModal(false)
  }

  const handleInstagramStory = async () => {
    setGenerating(true)
    try {
      const blob = await generateImageBlob()
      if (!blob) { setGenerating(false); return }
      navigator.clipboard.writeText(`https://fpti.kr`)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `FPTI_${data?.nickname || 'result'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setTimeout(() => {
        window.location.href = 'instagram://story-camera'
        setTimeout(() => {
          alert('이미지를 저장했어요!\n\n인스타 앱이 없으면\n갤러리에서 직접 스토리에 올려주세요 📸')
        }, 1500)
      }, 800)
    } catch (e) {
      alert('실패했어요. 이미지 저장 후 직접 올려주세요.')
    }
    setGenerating(false)
    setShowShareModal(false)
  }

  const handleShareMore = () => {
    const url = `https://fpti.kr/test/${token}`
    const text = `내 인성 평가해줘 🥺\n\n👉 ${url}`
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

  // 빈 상태 - 답변자 0명
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

  // 잠금 상태 - 1명만 답함
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

        {/* 잠금 카드 */}
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
          {/* 캐릭터 (졸린 표정) */}
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
            marginBottom: 8,
          }}>
            💡 한 명의 답변만으로 결과가 나오면<br />
            정확하지 않을 수 있어서 잠시 기다려요.
          </div>
        </div>

        {/* 액션 */}
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

  // 정상 결과 표시 (2명 이상)
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
              width: `${data.accuracyPercent || 50}%`,
              background: '#C97D5A',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <span style={{ fontSize: 11, color: '#9B8268', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
            {data.accuracyPercent || 50}%
          </span>
        </div>

        <div ref={cardRef} style={{
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
              — FPTI No.{(token as string).slice(0, 4).toUpperCase()} —
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
            marginBottom: 16, flexWrap: 'wrap',
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

          <p style={{ fontSize: 12, textAlign: 'center', lineHeight: 1.6, paddingLeft: 8, paddingRight: 8, color: '#5A4030' }}>
            {typeInfo.desc}
          </p>

          <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 12, borderTop: '1px dashed #E5D4C0' }}>
            <div style={{ fontSize: 11, color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
              {data.nickname}'s FPTI · fpti.kr
            </div>
          </div>
        </div>

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
                  {data.count < 3 ? `${3 - data.count}명만 더 답하면 정확도가 올라가요.` : `${5 - data.count}명만 더 답하면 100%가 돼요.`}
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
            navigator.clipboard.writeText(`https://fpti.kr/result/${token}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }} style={{
            width: '100%', padding: 12, fontSize: 12, borderRadius: 16,
            background: 'transparent', color: copied ? '#2C1810' : '#6B5544',
            border: `1.5px solid ${copied ? '#2C1810' : '#E5D4C0'}`,
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
