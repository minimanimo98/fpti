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

const TYPE_INFO: Record<string, { desc: string; tags: string[]; emoji: string; expression: string }> = {
  '성인군자':       { desc: '친구들이 진심으로 좋은 사람이라고 생각합니다. 다만 너무 무결하다는 게 함정. 완벽함은 거리감을 만듭니다.',          tags: ['#성인급', '#무결점', '#멸종위기'],     emoji: '😇', expression: 'smile' },
  '걸어다니는 힐링': { desc: '같이 있으면 마음이 놓입니다. 다만 그 다정함이 당신을 소진시킬 수 있어요.',                                         tags: ['#정신적안정제', '#말없는위로', '#소진주의'], emoji: '🌿', expression: 'smile' },
  '다정한 호구':     { desc: '기본적으로 착합니다. 부탁을 잘 못 거절합니다. 친구들이 그걸 알고 있어요. 일부는 이용 중일지도.',               tags: ['#No못함', '#친절무한리필', '#호구졸업반'], emoji: '🥺', expression: 'sleepy' },
  '상식선 인간':     { desc: '놀랍게도 이 점수가 제일 받기 힘듭니다. 요즘 상식선 지키는 사람이 드물어졌어요. 평균의 수호자.',                tags: ['#정상인', '#기본기만렙', '#평균수호자'], emoji: '😌', expression: 'peek' },
  '무난무취형':      { desc: '나쁘지 않습니다. 좋지도 않습니다. 해를 끼치지 않지만 기억에도 남지 않아요. 관계에서 의외로 치명적.',           tags: ['#존재감논란', '#특색없음', '#무색무취'], emoji: '😐', expression: 'sleepy' },
  '은근한 빌런':     { desc: '표면적으론 문제없는 사람. 그런데 친구들이 미세한 불편함을 느꼈어요. 뭔가 계산적이라는 감각.',                  tags: ['#겉속다름', '#계산적', '#속내따로'], emoji: '😏', expression: 'smirk' },
  '뒷담화 챔피언':   { desc: '친구들은 당신 앞에서 웃습니다. 뒤돌아서면 조금 긴장합니다. 남 얘기를 너무 재밌게 합니다.',                     tags: ['#입방정', '#가십연구원', '#뒤에선검사'], emoji: '🗣️', expression: 'smirk' },
  '기분파 폭군':     { desc: '기분 좋을 땐 당신만한 친구가 없습니다. 문제는 기분이 나쁠 때. 친구들은 표정을 살피며 하루를 시작해요.',         tags: ['#기분존중', '#감정날씨', '#눈치제공자'], emoji: '⛈️', expression: 'shock' },
  '감정 흡혈귀':     { desc: '당신과 얘기하면 친구들은 피곤해합니다. 대화는 늘 당신 문제로 끝나요. 친구는 치료사가 아니에요.',               tags: ['#영혼고갈', '#배터리방전', '#일방통행'], emoji: '🧛', expression: 'shock' },
  '허당 귀요미':     { desc: '점수가 낮은데 왠지 용서됩니다. 왜냐하면 귀엽기 때문이에요. 다만 허당력은 나이와 반비례합니다.',               tags: ['#귀여움무기', '#허당력만렙', '#유효기간있음'], emoji: '🤭', expression: 'smile' },
  '관종 빌런':       { desc: '관심을 위해서라면 뭐든 합니다. 재밌는 사람이라는 평가와 피곤한 사람이라는 평가가 공존해요.',                  tags: ['#관심없으면불안', '#모임의태양', '#조연싫음'], emoji: '🎭', expression: 'shock' },
  '순수악':         { desc: '친구들은 당신에 대해 일관되게 부정적인 평가를 내렸습니다. 관계를 다시 생각해볼 신호.',                          tags: ['#극희귀', '#관계점검', '#적신호'], emoji: '👹', expression: 'smirk' },
}

function MascotSvg({ expression, size = 120 }: { expression: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="72" cy="128" rx="50" ry="6" fill="rgba(0,0,0,0.08)" />
      <circle cx="70" cy="65" r="55" fill="#FFEE00" stroke="#3D2817" strokeWidth="3.5" />
      <circle cx="42" cy="78" r="4" fill="#FF8A65" opacity="0.6" />
      <circle cx="98" cy="78" r="4" fill="#FF8A65" opacity="0.6" />
      {expression === 'peek' && (<>
        <path d="M 45 60 Q 53 56 61 60" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <circle cx="92" cy="60" r="6" fill="#3D2817" />
        <circle cx="94" cy="58" r="2" fill="#fff" />
        <path d="M 60 85 Q 70 92 82 85" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>)}
      {expression === 'smile' && (<>
        <path d="M 42 58 Q 50 50 58 58" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 82 58 Q 90 50 98 58" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 55 82 Q 70 95 85 82" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>)}
      {expression === 'shock' && (<>
        <circle cx="50" cy="58" r="5" fill="#3D2817" />
        <circle cx="90" cy="58" r="5" fill="#3D2817" />
        <ellipse cx="70" cy="88" rx="8" ry="10" fill="#3D2817" />
      </>)}
      {expression === 'smirk' && (<>
        <path d="M 45 60 L 60 60" stroke="#3D2817" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 80 60 L 95 60" stroke="#3D2817" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 58 88 Q 75 82 85 90" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </>)}
      {expression === 'sleepy' && (<>
        <path d="M 45 62 Q 53 66 61 62" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M 82 62 Q 90 66 98 62" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <ellipse cx="70" cy="88" rx="6" ry="3" fill="#3D2817" />
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
      fetch(`/api/get-result?token=${token}`).then(r => r.json()).then(d => { setData(d); setLoading(false) })
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

  // 이미지 저장
  const handleSaveImage = async () => {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#FFE4D9',
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
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#FFE4D9' }}>
      <p style={{ color: '#A8826A', fontSize: 13 }}>집계 중...</p>
    </main>
  )

  if (data?.empty) return (
    <main className="min-h-screen px-6 py-12" style={{ background: '#FFE4D9' }}>
      <div className="max-w-[480px] mx-auto text-center">
        <div className="text-6xl mb-6">🫥</div>
        <h1 className="leading-none mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#3D2817' }}>
          <span className="px-2 rounded-xl" style={{ background: '#FFEE00' }}>아직 답변이 없어요</span>
        </h1>
        <p className="text-sm mb-8" style={{ color: '#7A5A47' }}>친구가 답해야 결과가 나와요.</p>
        <button onClick={handleShareMore} className="w-full py-4 text-base rounded-2xl"
          style={{ background: '#3D2817', color: '#fff', fontFamily: 'var(--font-display)', border: 'none', boxShadow: '0 4px 0 #FF8A65' }}>
          💛 친구에게 평가 부탁하기
        </button>
      </div>
    </main>
  )

  const typeInfo = TYPE_INFO[data.typeName] || TYPE_INFO['무난무취형']

  return (
    <main className="min-h-screen pb-20" style={{ background: '#FFE4D9', color: '#3D2817' }}>
      {/* 헤더 */}
      <header className="px-6 py-5 max-w-[480px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FFEE00', boxShadow: '0 2px 0 #3D2817' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>FPTI</span>
        </div>
        <button onClick={() => router.push('/')} className="text-xs px-3 py-1.5 rounded-full"
          style={{ color: '#7A5A47', background: '#fff', border: '1px solid #FFCFBA' }}>
          처음으로
        </button>
      </header>

      <div className="max-w-[480px] mx-auto px-6">
        {/* 정확도 + 응답 수 */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
            style={{
              background: data.accuracy === 'high' ? '#FFEE00' : data.accuracy === 'normal' ? '#fff' : '#FFF1E6',
              border: `1px solid ${data.accuracy === 'temp' ? '#FFC078' : '#3D2817'}`,
              fontFamily: 'var(--font-display)', color: '#3D2817',
            }}>
            <span>{data.accuracy === 'temp' ? '🔍' : data.accuracy === 'low' ? '⏳' : data.accuracy === 'normal' ? '✓' : '⭐'}</span>
            {data.accuracyLabel}
          </div>
          <div className="text-xs" style={{ color: '#7A5A47', fontFamily: 'var(--font-mono)' }}>
            {data.count}명 응답 중
          </div>
        </div>

        {/* === 타로카드 스타일 메인 결과 카드 (이미지 저장 대상) === */}
        <div ref={cardRef} style={{ background: '#FFE4D9', padding: '20px 0' }}>
          <div
            className="relative mx-auto"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7F0 100%)',
              borderRadius: 24,
              padding: '28px 24px 32px',
              boxShadow: '0 8px 24px rgba(255, 138, 101, 0.25), 0 0 0 1px rgba(61, 40, 23, 0.08)',
              border: '3px solid #3D2817',
            }}
          >
            {/* 모서리 장식 */}
            <div className="absolute top-3 left-3" style={{ width: 12, height: 12, background: '#FF8A65', borderRadius: '50%' }} />
            <div className="absolute top-3 right-3" style={{ width: 12, height: 12, background: '#FF8A65', borderRadius: '50%' }} />
            <div className="absolute bottom-3 left-3" style={{ width: 12, height: 12, background: '#FF8A65', borderRadius: '50%' }} />
            <div className="absolute bottom-3 right-3" style={{ width: 12, height: 12, background: '#FF8A65', borderRadius: '50%' }} />

            {/* 카드 상단 라벨 */}
            <div className="text-center mb-2">
              <div className="text-xs tracking-widest" style={{ color: '#A8826A', fontFamily: 'var(--font-mono)' }}>
                — FPTI No.{(token as string).slice(0, 4).toUpperCase()} —
              </div>
            </div>

            {/* 캐릭터 + 배경 일러스트 */}
            <div className="relative flex items-center justify-center my-4" style={{ height: 200 }}>
              {/* 배경 원 */}
              <div className="absolute" style={{
                width: 180, height: 180,
                background: 'radial-gradient(circle, #FFEE00 0%, #FFD700 100%)',
                borderRadius: '50%',
                opacity: 0.4,
              }} />
              {/* 캐릭터 */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <MascotSvg expression={typeInfo.expression} size={170} />
              </div>
              {/* 떠다니는 이모지 */}
              <div className="absolute" style={{ top: 10, left: 30, fontSize: 24 }}>{typeInfo.emoji}</div>
              <div className="absolute" style={{ bottom: 20, right: 25, fontSize: 20, opacity: 0.6 }}>✨</div>
            </div>

            {/* 점수 */}
            <div className="text-center mb-3">
              <div className="text-xs mb-1" style={{ color: '#A8826A', fontFamily: 'var(--font-mono)' }}>
                인성 점수
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, lineHeight: 1, color: '#3D2817' }}>
                {data.score}<span style={{ fontSize: 24, color: '#A8826A' }}>/100</span>
              </div>
            </div>

            {/* 유형명 */}
            <div className="text-center mb-3">
              <h1 className="leading-tight" style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#3D2817' }}>
                <span className="inline-block px-3 rounded-2xl"
                  style={{ background: '#FFEE00', boxShadow: '0 3px 0 #3D2817' }}>
                  {data.typeName}
                </span>
              </h1>
            </div>

            {/* 해시태그 */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {typeInfo.tags.map((tag, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: '#FFF1E6', color: '#FF8A65', border: '1px solid #FFCFBA', fontFamily: 'var(--font-display)' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* 한 줄 설명 */}
            <p className="text-sm text-center leading-relaxed px-2" style={{ color: '#5A4030' }}>
              {typeInfo.desc}
            </p>

            {/* 카드 하단 워터마크 */}
            <div className="text-center mt-5 pt-3" style={{ borderTop: '1px dashed #FFCFBA' }}>
              <div className="text-xs" style={{ color: '#A8826A', fontFamily: 'var(--font-mono)' }}>
                {data.nickname}'s FPTI · fpti.kr
              </div>
            </div>
          </div>
        </div>

        {/* 친구들 동의한 항목 */}
        <div className="rounded-2xl p-5 mt-5 mb-4"
          style={{ background: '#fff', border: '2px solid #FFCFBA', boxShadow: '0 4px 0 #FFCFBA' }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF8A65' }} />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#3D2817' }}>
              친구들이 동의한 항목
            </strong>
          </div>
          {data.topItems?.map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#FFEE00', fontSize: 11, fontWeight: 700, color: '#3D2817' }}>✓</div>
              <p className="text-sm leading-relaxed" style={{ color: '#3D2817' }}>{QUESTIONS[item.id]}</p>
            </div>
          ))}
        </div>

        {/* 동의 못한 항목 */}
        <div className="rounded-2xl p-5 mb-4"
          style={{ background: '#fff', border: '2px solid #FFCFBA', boxShadow: '0 4px 0 #FFCFBA' }}>
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3D2817' }} />
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#3D2817' }}>
              친구들이 동의 못한 항목
            </strong>
          </div>
          {data.bottomItems?.map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-3 mb-2.5 last:mb-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#3D2817', color: '#fff', fontSize: 11, fontWeight: 700 }}>✕</div>
              <p className="text-sm leading-relaxed" style={{ color: '#3D2817' }}>{QUESTIONS[item.id]}</p>
            </div>
          ))}
        </div>

        {/* 더 정확한 결과 안내 */}
        {data.count < 5 && (
          <div className="rounded-2xl p-5 mb-5"
            style={{ background: '#FFF1E6', border: '2px solid #FF8A65', boxShadow: '0 4px 0 #FF8A65' }}>
            <div className="flex items-start gap-3">
              <div style={{ fontSize: 24 }}>📊</div>
              <div>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#3D2817' }}>
                  더 정확한 결과 받기
                </strong>
                <p className="text-sm mt-1" style={{ color: '#5A4030', lineHeight: 1.5 }}>
                  지금 <strong>{data.count}명</strong>이 답했어요.<br />
                  {data.count < 3 ? `${3 - data.count}명만 더 답하면 정확도가 올라가요.` : `${5 - data.count}명만 더 답하면 정확도 100%가 돼요.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <button onClick={handleSaveImage} disabled={saving}
          className="w-full py-4 text-base rounded-2xl mb-3 transition-all"
          style={{
            background: '#FFEE00', color: '#3D2817',
            fontFamily: 'var(--font-display)', border: 'none',
            cursor: saving ? 'wait' : 'pointer',
            boxShadow: '0 4px 0 #3D2817',
          }}>
          {saving ? '저장 중...' : '📸 결과 이미지 저장'}
        </button>

        <button onClick={handleShareMore}
          className="w-full py-4 text-base rounded-2xl mb-3"
          style={{ background: '#3D2817', color: '#fff', fontFamily: 'var(--font-display)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 0 #FF8A65' }}>
          💛 친구에게 평가 더 받기
        </button>

        <button onClick={() => {
          navigator.clipboard.writeText(`https://fpti.kr/result/${token}`)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }} className="w-full py-3 text-sm rounded-2xl mb-3"
          style={{ background: copied ? '#FFEE00' : '#fff', color: '#3D2817', border: '1.5px solid #FFCFBA', fontFamily: 'var(--font-mono)' }}>
          {copied ? '✓ 결과 링크 복사됨!' : '🔗 결과 링크 복사'}
        </button>

        <button onClick={() => router.push('/')} className="w-full py-3 text-sm rounded-2xl"
          style={{ background: 'transparent', color: '#7A5A47', border: '1px solid #FFCFBA', fontFamily: 'var(--font-mono)' }}>
          나도 평가받기 →
        </button>
      </div>
    </main>
  )
}
