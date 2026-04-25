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
  '성인군자':       { desc: '친구들이 진심으로 좋은 사람이라고 생각합니다. 다만 너무 무결하다는 게 함정. 완벽함은 거리감을 만듭니다.',          tags: ['성인급', '무결점', '멸종위기'],     expression: 'smile' },
  '걸어다니는 힐링': { desc: '같이 있으면 마음이 놓입니다. 다만 그 다정함이 당신을 소진시킬 수 있어요.',                                         tags: ['정신적안정제', '말없는위로', '소진주의'], expression: 'smile' },
  '다정한 호구':     { desc: '기본적으로 착합니다. 부탁을 잘 못 거절합니다. 친구들이 그걸 알고 있어요. 일부는 이용 중일지도.',               tags: ['No못함', '친절무한리필', '호구졸업반'], expression: 'sleepy' },
  '상식선 인간':     { desc: '놀랍게도 이 점수가 제일 받기 힘듭니다. 요즘 상식선 지키는 사람이 드물어졌어요. 평균의 수호자.',                tags: ['정상인', '기본기만렙', '평균수호자'], expression: 'peek' },
  '무난무취형':      { desc: '나쁘지 않습니다. 좋지도 않습니다. 해를 끼치지 않지만 기억에도 남지 않아요. 관계에서 의외로 치명적.',           tags: ['존재감논란', '특색없음', '무색무취'], expression: 'sleepy' },
  '은근한 빌런':     { desc: '표면적으론 문제없는 사람. 그런데 친구들이 미세한 불편함을 느꼈어요. 뭔가 계산적이라는 감각.',                  tags: ['겉속다름', '계산적', '속내따로'], expression: 'smirk' },
  '뒷담화 챔피언':   { desc: '친구들은 당신 앞에서 웃습니다. 뒤돌아서면 조금 긴장합니다. 남 얘기를 너무 재밌게 합니다.',                     tags: ['입방정', '가십연구원', '뒤에선검사'], expression: 'smirk' },
  '기분파 폭군':     { desc: '기분 좋을 땐 당신만한 친구가 없습니다. 문제는 기분이 나쁠 때. 친구들은 표정을 살피며 하루를 시작해요.',         tags: ['기분존중', '감정날씨', '눈치제공자'], expression: 'shock' },
  '감정 흡혈귀':     { desc: '당신과 얘기하면 친구들은 피곤해합니다. 대화는 늘 당신 문제로 끝나요. 친구는 치료사가 아니에요.',               tags: ['영혼고갈', '배터리방전', '일방통행'], expression: 'shock' },
  '허당 귀요미':     { desc: '점수가 낮은데 왠지 용서됩니다. 왜냐하면 귀엽기 때문이에요. 다만 허당력은 나이와 반비례합니다.',               tags: ['귀여움무기', '허당력만렙', '유효기간있음'], expression: 'smile' },
  '관종 빌런':       { desc: '관심을 위해서라면 뭐든 합니다. 재밌는 사람이라는 평가와 피곤한 사람이라는 평가가 공존해요.',                  tags: ['관심없으면불안', '모임의태양', '조연싫음'], expression: 'shock' },
  '순수악':         { desc: '친구들은 당신에 대해 일관되게 부정적인 평가를 내렸습니다. 관계를 다시 생각해볼 신호.',                          tags: ['극희귀', '관계점검', '적신호'], expression: 'smirk' },
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
  const [saving, setSaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchResult = () => {
      fetch(`/api/get-result?token=${token}`)
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false) })
    }
    fetchResult()
    const interval = setInterval(fetchResult, 10000)
    return () => clearInterval(interval)
  }, [token])

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

  const handleSaveImage = async () => {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#F5E6D8',
        scale: 2,
        useCORS: true,
      })
      canvas.toBlob((blob) => {
        if (!blob) { setSaving(false); return }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `FPTI_${data?.nickname || 'result'}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        setSaving(false)
      }, 'image/png')
    } catch (e) {
      alert('저장 실패. 스크린샷을 이용해주세요.')
      setSaving(false)
    }
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#F5E6D8' }}>
      <p style={{ color: '#9B8268', fontSize: 13 }}>집계 중...</p>
    </main>
  )

  // 빈 상태
  if (data?.empty || !data?.typeName || !data?.score) return (
    <main className="min-h-screen" style={{ background: '#F5E6D8' }}>
      <div className="max-w-[480px] mx-auto px-6 py-12">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#2C1810', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 14 }}>
              F
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#2C1810' }}>FPTI</span>
          </div>
          <button onClick={() => router.push('/')} className="text-xs px-3 py-2 rounded-full"
            style={{ color: '#6B5544', background: '#fff', border: '1.5px solid #E5D4C0' }}>
            처음으로
          </button>
        </header>

        <div className="text-center py-12">
          <div className="text-6xl mb-6">🫥</div>
          <h1 className="leading-tight mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#2C1810' }}>
            아직 답변이 없어요
          </h1>
          <p className="text-sm mb-10" style={{ color: '#6B5544' }}>
            친구가 답해야 결과가 나와요.
          </p>
          <button onClick={handleShareMore}
            className="w-full py-4 text-base rounded-2xl"
            style={{
              background: '#2C1810', color: '#fff', fontFamily: 'var(--font-display)',
              border: 'none', boxShadow: '0 4px 0 #C97D5A', cursor: 'pointer',
            }}>
            친구에게 평가 부탁하기
          </button>
        </div>
      </div>
    </main>
  )

  const typeInfo = TYPE_INFO[data.typeName] || TYPE_INFO['무난무취형']

  return (
    <main className="min-h-screen pb-12" style={{ background: '#F5E6D8', color: '#2C1810' }}>
      <div className="max-w-[480px] mx-auto px-5">

        {/* 헤더 */}
        <header className="py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#2C1810', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 14 }}>
              F
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#2C1810' }}>FPTI</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
              {data.count}명 응답
            </span>
            <button onClick={() => router.push('/')} className="text-xs px-3 py-1.5 rounded-full"
              style={{ color: '#6B5544', background: '#fff', border: '1.5px solid #E5D4C0' }}>
              처음으로
            </button>
          </div>
        </header>

        {/* 정확도 라벨 */}
        <div className="flex items-center gap-2 mb-5 px-1">
          <span className="text-xs" style={{ color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
            {data.accuracyLabel || '결과'}
          </span>
          <div style={{ flex: 1, height: 4, background: '#E5D4C0', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${data.accuracyPercent || 33}%`,
              background: '#C97D5A',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <span className="text-xs" style={{ color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
            {data.accuracyPercent || 33}%
          </span>
        </div>

        {/* === 메인 결과 카드 (이미지 저장 대상) === */}
        <div ref={cardRef} style={{ background: '#F5E6D8', padding: '4px 0' }}>
          <div
            className="relative"
            style={{
              background: '#FFF8EE',
              borderRadius: 20,
              padding: '24px 20px 28px',
              border: '2.5px solid #2C1810',
              boxShadow: '0 6px 0 #C97D5A',
            }}
          >
            {/* 모서리 점 */}
            <div className="absolute" style={{ top: 10, left: 10, width: 8, height: 8, background: '#C97D5A', borderRadius: '50%' }} />
            <div className="absolute" style={{ top: 10, right: 10, width: 8, height: 8, background: '#C97D5A', borderRadius: '50%' }} />
            <div className="absolute" style={{ bottom: 10, left: 10, width: 8, height: 8, background: '#C97D5A', borderRadius: '50%' }} />
            <div className="absolute" style={{ bottom: 10, right: 10, width: 8, height: 8, background: '#C97D5A', borderRadius: '50%' }} />

            {/* 카드 라벨 */}
            <div className="text-center mb-3">
              <div className="text-xs tracking-widest" style={{ color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
                — FPTI No.{(token as string).slice(0, 4).toUpperCase()} —
              </div>
            </div>

            {/* 캐릭터 */}
            <div className="relative flex items-center justify-center my-3" style={{ height: 180 }}>
              <div className="absolute" style={{
                width: 160, height: 160,
                background: '#FFD96B',
                borderRadius: '50%',
                opacity: 0.35,
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <MascotSvg expression={typeInfo.expression} size={160} />
              </div>
            </div>

            {/* 점수 */}
            <div className="text-center mb-3">
              <div className="text-xs mb-1" style={{ color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
                인성 점수
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, lineHeight: 1, color: '#2C1810' }}>
                {data.score}
                <span style={{ fontSize: 22, color: '#9B8268', marginLeft: 4 }}>/ 100</span>
              </div>
            </div>

            {/* 유형명 */}
            <div className="text-center mb-4">
              <h1 className="leading-tight" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 8vw, 36px)', color: '#2C1810' }}>
                {data.typeName}
              </h1>
            </div>

            {/* 해시태그 */}
            <div className="flex justify-center gap-1.5 mb-4 flex-wrap px-2">
              {typeInfo.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                  style={{
                    background: '#FFF',
                    color: '#6B5544',
                    border: '1px solid #E5D4C0',
                    fontFamily: 'var(--font-mono)',
                  }}>
                  #{tag}
                </span>
              ))}
            </div>

            {/* 한 줄 설명 */}
            <p className="text-sm text-center leading-relaxed px-2" style={{ color: '#5A4030' }}>
              {typeInfo.desc}
            </p>

            {/* 워터마크 */}
            <div className="text-center mt-5 pt-3" style={{ borderTop: '1px dashed #E5D4C0' }}>
              <div className="text-xs" style={{ color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
                {data.nickname}'s FPTI · fpti.kr
              </div>
            </div>
          </div>
        </div>

        {/* 친구들 동의 항목 */}
        {data.topItems && data.topItems.length > 0 && (
          <div className="rounded-2xl p-5 mt-5"
            style={{ background: '#fff', border: '2px solid #E5D4C0' }}>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C97D5A' }} />
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#2C1810' }}>
                친구들이 동의한 항목
              </strong>
            </div>
            {data.topItems.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
                <div className="flex-shrink-0 mt-1" style={{ color: '#C97D5A', fontSize: 11 }}>●</div>
                <p className="text-sm leading-relaxed" style={{ color: '#2C1810' }}>{QUESTIONS[item.id]}</p>
              </div>
            ))}
          </div>
        )}

        {/* 동의 못한 항목 */}
        {data.bottomItems && data.bottomItems.length > 0 && (
          <div className="rounded-2xl p-5 mt-3"
            style={{ background: '#fff', border: '2px solid #E5D4C0' }}>
            <div className="flex items-center gap-2 mb-4">
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#2C1810' }} />
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#2C1810' }}>
                친구들이 동의 못한 항목
              </strong>
            </div>
            {data.bottomItems.map((item: any, i: number) => (
              <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
                <div className="flex-shrink-0 mt-1" style={{ color: '#2C1810', fontSize: 11 }}>●</div>
                <p className="text-sm leading-relaxed" style={{ color: '#2C1810' }}>{QUESTIONS[item.id]}</p>
              </div>
            ))}
          </div>
        )}

        {/* 더 정확한 결과 안내 */}
        {data.count < 5 && (
          <div className="rounded-2xl p-4 mt-5"
            style={{ background: '#fff', border: '2px solid #C97D5A' }}>
            <div className="flex items-start gap-3">
              <div style={{ fontSize: 20 }}>📊</div>
              <div style={{ minWidth: 0 }}>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#2C1810' }}>
                  더 정확한 결과 받기
                </strong>
                <p className="text-xs mt-1" style={{ color: '#5A4030', lineHeight: 1.5 }}>
                  지금 <strong style={{ color: '#2C1810' }}>{data.count}명</strong>이 답했어요.{' '}
                  {data.count < 3 ? `${3 - data.count}명만 더 답하면 정확도가 올라가요.` : `${5 - data.count}명만 더 답하면 100%가 돼요.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="mt-6 space-y-2.5">
          <button onClick={handleShareMore}
            className="w-full py-4 text-base rounded-2xl"
            style={{
              background: '#2C1810', color: '#fff', fontFamily: 'var(--font-display)',
              border: 'none', cursor: 'pointer', boxShadow: '0 4px 0 #C97D5A', fontSize: 15,
            }}>
            친구에게 평가 더 받기
          </button>

          <button onClick={handleSaveImage} disabled={saving}
            className="w-full py-3.5 text-sm rounded-2xl"
            style={{
              background: '#fff', color: '#2C1810',
              fontFamily: 'var(--font-display)',
              border: '2px solid #2C1810',
              cursor: saving ? 'wait' : 'pointer',
            }}>
            {saving ? '저장 중...' : '📸 결과 이미지 저장'}
          </button>

          <button onClick={() => {
            navigator.clipboard.writeText(`https://fpti.kr/result/${token}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }} className="w-full py-3 text-sm rounded-2xl"
            style={{
              background: 'transparent', color: copied ? '#2C1810' : '#6B5544',
              border: `1.5px solid ${copied ? '#2C1810' : '#E5D4C0'}`,
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}>
            {copied ? '✓ 결과 링크 복사됨' : '🔗 결과 링크 복사'}
          </button>

          <button onClick={() => router.push('/')} className="w-full py-3 text-sm rounded-2xl"
            style={{
              background: 'transparent', color: '#9B8268',
              border: '1px solid #E5D4C0',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
            }}>
            나도 평가받기
          </button>
        </div>
      </div>
    </main>
  )
}
