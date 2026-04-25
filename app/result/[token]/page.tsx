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

const TYPE_DESC: Record<string, string> = {
  '성인군자': '친구들은 당신을 진심으로 좋은 사람이라고 생각합니다. 다만 너무 무결하다는 게 함정. 완벽함은 때로 거리감을 만듭니다.',
  '걸어다니는 힐링': '말수가 많지 않을 수 있습니다. 그런데 이상하게 같이 있으면 마음이 놓입니다. 다만 그 다정함이 당신을 소진시킬 수 있어요.',
  '다정한 호구': '기본적으로 착합니다. 부탁을 잘 못 거절합니다. 친구들이 그걸 알고 있어요. 일부는 이용하고 있을지도 몰라요.',
  '상식선 인간': '놀랍게도 이 점수가 제일 받기 힘듭니다. 요즘 세상에 상식선 지키는 사람이 드물어졌어요. 평균의 수호자.',
  '무난무취형': '나쁘지 않습니다. 좋지도 않습니다. 해를 끼치지 않지만 기억에도 남지 않습니다. 이건 관계에서 생각보다 치명적이에요.',
  '은근한 빌런': '표면적으로 문제없는 사람입니다. 그런데 친구들이 미세한 불편함을 느꼈어요. 뭔가 계산적이라는 감각.',
  '뒷담화 챔피언': '친구들은 당신 앞에서 웃습니다. 뒤돌아서면 조금 긴장합니다. 남 얘기를 너무 재밌게 합니다.',
  '기분파 폭군': '기분 좋을 땐 당신만한 친구가 없습니다. 문제는 기분이 나쁠 때. 친구들은 당신 표정을 살피며 하루를 시작해요.',
  '감정 흡혈귀': '당신과 얘기하면 친구들은 피곤해합니다. 대화는 늘 당신 문제로 끝나요. 친구는 치료사가 아닙니다.',
  '허당 귀요미': '점수가 낮은데 왠지 용서됩니다. 왜냐하면 귀엽기 때문이에요. 다만 허당력은 나이와 반비례합니다.',
  '관종 빌런': '관심을 위해서라면 뭐든 합니다. 재밌는 사람이라는 평가와 피곤한 사람이라는 평가가 공존해요.',
  '순수악': '친구들은 당신에 대해 일관되게 부정적인 평가를 내렸습니다. 관계를 다시 생각해볼 신호.',
}

export default function ResultPage() {
  const { token } = useParams()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchResult = () => {
      fetch(`/api/get-result?token=${token}`)
        .then(r => r.json())
        .then(d => { setData(d); setLoading(false) })
    }
    fetchResult()
    // 10초마다 자동 새로고침 (새 응답 들어오면 점수 갱신)
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

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#FAFAFA' }}>
      <p style={{ fontFamily: 'var(--font-mono)', color: '#888', fontSize: 13 }}>집계 중...</p>
    </main>
  )

  if (data?.empty) return (
    <main className="min-h-screen px-6 py-12" style={{ background: '#FAFAFA' }}>
      <div className="max-w-[480px] mx-auto text-center">
        <div className="text-6xl mb-6">🫥</div>
        <h1 className="leading-none mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 36 }}>
          <span className="px-2 rounded-xl" style={{ background: '#FFEE00' }}>아직 답변이 없어요</span>
        </h1>
        <p className="text-sm mb-8" style={{ color: '#666' }}>
          친구가 답해야 결과가 나와요.
        </p>
        <button onClick={handleShareMore}
          className="w-full py-4 text-base rounded-2xl"
          style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'var(--font-display)', border: 'none', boxShadow: '0 4px 0 #FFEE00' }}>
          💛 친구에게 평가 부탁하기
        </button>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen pb-20" style={{ background: '#FAFAFA', color: '#0a0a0a' }}>
      {/* 헤더 */}
      <header className="px-6 py-5 max-w-[480px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#FFEE00', boxShadow: '0 2px 0 #0a0a0a' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>FPTI</span>
        </div>
        <button onClick={() => router.push('/')}
          className="text-xs px-3 py-1.5 rounded-full"
          style={{ color: '#666', background: '#fff', border: '1px solid #e5e5e5' }}>
          처음으로
        </button>
      </header>

      <div className="max-w-[480px] mx-auto px-6">
        {/* 정확도 뱃지 + 응답자 수 */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
            style={{
              background: data.accuracy === 'high' ? '#FFEE00' : data.accuracy === 'normal' ? '#fff' : '#fff5cc',
              border: `1px solid ${data.accuracy === 'temp' ? '#FFD700' : '#0a0a0a'}`,
              fontFamily: 'var(--font-display)',
            }}
          >
            <span>
              {data.accuracy === 'temp' ? '🔍' : data.accuracy === 'low' ? '⏳' : data.accuracy === 'normal' ? '✓' : '⭐'}
            </span>
            {data.accuracyLabel}
          </div>
          <div className="text-xs" style={{ color: '#666', fontFamily: 'var(--font-mono)' }}>
            {data.count}명 응답
          </div>
        </div>

        {/* 정확도 진행 바 */}
        <div className="mb-8" style={{ height: 6, background: '#eee', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${data.accuracyPercent}%`,
            background: data.accuracyPercent >= 80 ? '#FFEE00' : '#FFD700',
            transition: 'width 0.6s ease',
          }} />
        </div>

        {/* 유형 발표 */}
        <div className="mb-8">
          <p className="text-sm mb-2" style={{ color: '#666', fontFamily: 'var(--font-mono)' }}>
            {data.nickname}님은
          </p>
          <h1 className="leading-[1.05]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 11vw, 60px)' }}>
            <span className="inline-block px-3 rounded-2xl" style={{ background: '#FFEE00', boxShadow: '0 4px 0 #0a0a0a' }}>
              {data.typeName}
            </span>
          </h1>
          <p className="text-sm mt-3" style={{ color: '#666', fontFamily: 'var(--font-mono)' }}>
            입니다.
          </p>
        </div>

        {/* 점수 카드 */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{ background: '#fff', border: '1px solid #eee', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="text-xs mb-3" style={{ color: '#888' }}>인성 점수</div>
          <div className="flex items-end gap-3 mb-4">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 64, lineHeight: 1, color: '#0a0a0a' }}>
              {data.score}
            </span>
            <span className="pb-2" style={{ color: '#888', fontFamily: 'var(--font-mono)', fontSize: 16 }}>/ 100</span>
          </div>
          <div style={{ height: 10, background: '#f0f0f0', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${data.score}%`,
              background: data.score >= 60 ? '#FFEE00' : '#0a0a0a',
              transition: 'width 1s ease',
              borderRadius: 5,
            }} />
          </div>
        </div>

        {/* 유형 분석 */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{ background: '#fff', border: '1px solid #eee', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="text-xs mb-3" style={{ color: '#888' }}>유형 분석</div>
          <p className="text-sm leading-relaxed" style={{ color: '#222' }}>
            {TYPE_DESC[data.typeName]}
          </p>
        </div>

        {/* 친구들 동의 항목 */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{ background: '#fff', border: '1px solid #eee', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="text-xs mb-4" style={{ color: '#888' }}>친구들이 동의한 항목</div>
          {data.topItems?.map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#FFEE00', fontSize: 12, fontWeight: 700 }}>
                ✓
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#222' }}>
                {QUESTIONS[item.id]}
              </p>
            </div>
          ))}
        </div>

        {/* 동의 못한 항목 */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: '#fff', border: '1px solid #eee', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}
        >
          <div className="text-xs mb-4" style={{ color: '#888' }}>친구들이 동의 못한 항목</div>
          {data.bottomItems?.map((item: any, i: number) => (
            <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#0a0a0a', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                ✕
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#222' }}>
                {QUESTIONS[item.id]}
              </p>
            </div>
          ))}
        </div>

        {/* 더 정확한 결과 보기 안내 */}
        {data.count < 5 && (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{ background: '#FFFBE5', border: '2px solid #FFEE00' }}
          >
            <div className="flex items-start gap-3">
              <div style={{ fontSize: 24 }}>📊</div>
              <div>
                <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>
                  더 정확한 결과 받기
                </strong>
                <p className="text-sm mt-1" style={{ color: '#444', lineHeight: 1.5 }}>
                  지금 <strong>{data.count}명</strong>이 답했어요.<br />
                  {data.count < 3
                    ? `${3 - data.count}명만 더 답하면 정확도가 올라가요.`
                    : `${5 - data.count}명만 더 답하면 정확도 100%가 돼요.`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 공유 CTA */}
        <button onClick={handleShareMore}
          className="w-full py-4 text-base rounded-2xl mb-3"
          style={{ background: '#0a0a0a', color: '#fff', fontFamily: 'var(--font-display)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 0 #FFEE00' }}>
          💛 친구에게 평가 더 받기
        </button>

        <button onClick={() => {
          navigator.clipboard.writeText(`https://fpti.kr/result/${token}`)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }}
          className="w-full py-3 text-sm rounded-2xl mb-3"
          style={{ background: copied ? '#FFEE00' : '#fff', color: '#0a0a0a', border: '1.5px solid #e5e5e5', fontFamily: 'var(--font-mono)' }}>
          {copied ? '✓ 결과 링크 복사됨!' : '🔗 결과 링크 복사'}
        </button>

        <button onClick={() => router.push('/')}
          className="w-full py-3 text-sm rounded-2xl"
          style={{ background: 'transparent', color: '#888', border: '1px solid #e5e5e5', fontFamily: 'var(--font-mono)' }}>
          나도 평가받기 →
        </button>
      </div>
    </main>
  )
}
