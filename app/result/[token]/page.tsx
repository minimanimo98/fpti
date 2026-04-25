'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

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
  '성인군자': '이 점수를 받았다면, 친구들은 당신을 진심으로 좋은 사람이라고 생각합니다. 장난이 아닙니다. 다만 너무 무결하다는 게 함정입니다. 완벽함은 때로 거리감을 만듭니다.',
  '걸어다니는 힐링': '당신은 말수가 많지 않을 수 있습니다. 그런데 이상하게 같이 있으면 마음이 놓입니다. 다만 그 다정함이 당신을 소진시킬 수 있습니다. 치유는 당신의 의무가 아닙니다.',
  '다정한 호구': '기본적으로 착합니다. 부탁을 잘 못 거절하고, 싫은 내색을 잘 안 합니다. 문제는 친구들이 그걸 안다는 겁니다. 그리고 일부는 이용하고 있습니다.',
  '상식선 인간': '놀랍게도 이 점수가 제일 받기 힘듭니다. 요즘 세상에 상식선을 지키는 사람이 드물어졌기 때문입니다. 당신은 평균의 수호자입니다.',
  '무난무취형': '나쁘지 않습니다. 좋지도 않습니다. 해를 끼치지 않지만 기억에도 남지 않습니다. 이건 관계에 있어서 생각보다 치명적입니다.',
  '은근한 빌런': '표면적으로 당신은 문제없는 사람입니다. 그런데 친구들이 답하면서 미세한 불편함을 느꼈습니다. 뭔가 계산적이라는 감각.',
  '뒷담화 챔피언': '친구들은 당신 앞에서 웃습니다. 뒤돌아서면 조금 긴장합니다. 당신은 남 얘기를 재밌게 합니다. 문제는 너무 재밌게 합니다.',
  '기분파 폭군': '기분 좋을 땐 당신만한 친구가 없습니다. 문제는 기분이 나쁠 때입니다. 친구들은 당신의 표정을 살피며 하루를 시작합니다.',
  '감정 흡혈귀': '당신과 얘기하고 나면 친구들은 피곤해합니다. 대화는 늘 당신의 문제로 끝납니다. 친구는 치료사가 아닙니다.',
  '허당 귀요미': '점수가 낮은데 왠지 용서됩니다. 왜냐하면 당신은 귀엽기 때문입니다. 다만 허당력은 나이와 반비례합니다.',
  '관종 빌런': '당신은 관심을 위해서라면 뭐든 합니다. 재밌는 사람이라는 평가와 피곤한 사람이라는 평가가 공존합니다.',
  '순수악': '친구들은 당신에 대해 일관되게 부정적인 평가를 내렸습니다. 이건 관계를 다시 생각해볼 신호입니다.',
}

export default function ResultPage() {
  const { token } = useParams()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const INK = "#0a0a0a"
  const HIGHLIGHT = "#FFEE00"
  const GRAY = "#888888"

  useEffect(() => {
    fetch(`/api/get-result?token=${token}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
  }, [token])

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://fpti.kr/result/${token}`)
    alert('결과 링크가 복사됐어요!')
  }

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#fff' }}>
      <p style={{ fontFamily: 'var(--font-mono)', color: GRAY, fontSize: '13px' }}>
        집계 중...
      </p>
    </main>
  )

  if (data?.locked) return (
    <main className="min-h-screen px-6 py-12" style={{ background: '#fff' }}>
      <div className="flex justify-between mb-10 pb-5 text-[11px] uppercase tracking-wider"
        style={{ fontFamily: "var(--font-mono)", borderBottom: `2px solid ${INK}` }}>
        <div className="font-bold">FPTI.KR</div>
        <div style={{ color: GRAY }}>결과 대기 중</div>
      </div>

      <h1 className="leading-none tracking-tight mb-6"
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 9vw, 64px)" }}>
        아직<br />
        <span className="px-2.5 inline-block" style={{ background: HIGHLIGHT, transform: 'rotate(-1deg)' }}>
          잠겨있어요.
        </span>
      </h1>

      <p className="text-base leading-relaxed mb-10" style={{ color: '#333', fontWeight: 500 }}>
        현재 <strong>{data.count}명</strong>이 답변했어요.<br />
        <strong>3명 이상</strong> 답변해야 결과가 공개됩니다.<br />
        <span style={{ color: GRAY, fontSize: '14px' }}>친구에게 링크를 더 보내보세요.</span>
      </p>

      <button onClick={() => window.location.href = `/share/${token}`}
        className="w-full py-5 text-lg mb-4"
        style={{ background: INK, color: '#fff', fontFamily: "var(--font-display)", border: 'none', cursor: 'pointer' }}>
        🔗 링크 다시 공유하기
      </button>
    </main>
  )

  return (
    <main className="min-h-screen" style={{ background: '#fff' }}>
      {/* 상단 바 */}
      <div className="flex justify-between px-6 py-5 text-[11px] uppercase tracking-wider"
        style={{ fontFamily: "var(--font-mono)", borderBottom: `2px solid ${INK}` }}>
        <div className="font-bold">FPTI.KR</div>
        <div style={{ color: GRAY }}>{data.count}명 응답</div>
      </div>

      {/* 유형 발표 */}
      <section className="px-6 pt-10 pb-8" style={{ borderBottom: `2px solid ${INK}` }}>
        <div className="text-xs mb-6 pl-2.5 leading-snug"
          style={{ fontFamily: "var(--font-mono)", borderLeft: `3px solid ${HIGHLIGHT}`, color: GRAY }}>
          {data.nickname}님의 인성 유형
        </div>

        <p className="text-base mb-3" style={{ color: GRAY, fontFamily: 'var(--font-mono)' }}>
          당신은
        </p>

        <h1 className="leading-none tracking-tight mb-2"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 12vw, 96px)" }}>
          <span className="px-3 inline-block" style={{ background: HIGHLIGHT, transform: 'rotate(-1deg)' }}>
            {data.typeName}
          </span>
        </h1>

        <p className="text-base mt-4 mb-2" style={{ color: GRAY, fontFamily: 'var(--font-mono)' }}>
          입니다.
        </p>
      </section>

      {/* 점수 */}
      <section className="px-6 py-8" style={{ borderBottom: `1px solid #eee` }}>
        <div className="text-[11px] uppercase tracking-wider mb-4"
          style={{ color: GRAY, fontFamily: "var(--font-mono)" }}>
          — 인성 점수
        </div>

        <div className="flex items-end gap-4 mb-4">
          <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(56px, 15vw, 96px)", lineHeight: 1 }}>
            {data.score}
          </span>
          <span className="pb-2 text-lg" style={{ color: GRAY, fontFamily: 'var(--font-mono)' }}>/ 100</span>
        </div>

        <div style={{ height: '12px', background: '#eee', borderRadius: 0 }}>
          <div style={{
            height: '100%',
            width: `${data.score}%`,
            background: data.score >= 60 ? HIGHLIGHT : INK,
            transition: 'width 1s ease',
          }} />
        </div>
      </section>

      {/* 유형 설명 */}
      <section className="px-6 py-8" style={{ borderBottom: `1px solid #eee` }}>
        <div className="text-[11px] uppercase tracking-wider mb-4"
          style={{ color: GRAY, fontFamily: "var(--font-mono)" }}>
          — 유형 분석
        </div>
        <p className="text-base leading-relaxed" style={{ color: '#222' }}>
          {TYPE_DESC[data.typeName]}
        </p>
      </section>

      {/* 친구들이 가장 동의한 항목 */}
      <section className="px-6 py-8" style={{ borderBottom: `1px solid #eee` }}>
        <div className="text-[11px] uppercase tracking-wider mb-5"
          style={{ color: GRAY, fontFamily: "var(--font-mono)" }}>
          — 친구들이 가장 동의한 항목
        </div>
        {data.topItems?.map((item: any, i: number) => (
          <div key={i} className="flex items-start gap-3 mb-4">
            <div className="w-4 h-4 mt-1 flex-shrink-0" style={{ background: HIGHLIGHT }} />
            <p className="text-sm leading-relaxed" style={{ color: INK }}>
              {QUESTIONS[item.id]}
            </p>
          </div>
        ))}
      </section>

      {/* 친구들이 동의 못한 항목 */}
      <section className="px-6 py-8" style={{ borderBottom: `2px solid ${INK}` }}>
        <div className="text-[11px] uppercase tracking-wider mb-5"
          style={{ color: GRAY, fontFamily: "var(--font-mono)" }}>
          — 친구들이 동의 못한 항목
        </div>
        {data.bottomItems?.map((item: any, i: number) => (
          <div key={i} className="flex items-start gap-3 mb-4">
            <div className="w-4 h-4 mt-1 flex-shrink-0" style={{ background: INK }} />
            <p className="text-sm leading-relaxed" style={{ color: INK }}>
              {QUESTIONS[item.id]}
            </p>
          </div>
        ))}
      </section>

      {/* 공유 CTA */}
      <section className="px-6" style={{ background: INK, paddingTop: '60px', paddingBottom: '40px' }}>
        <h2 className="leading-tight mb-7"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 7vw, 42px)", color: '#fff' }}>
          친구들도<br />
          <span style={{ background: HIGHLIGHT, color: INK, padding: '0 8px' }}>받아볼까요?</span>
        </h2>

        <button onClick={handleCopy}
          className="w-full py-5 text-lg mb-4"
          style={{ background: HIGHLIGHT, color: INK, fontFamily: "var(--font-display)", border: 'none', cursor: 'pointer' }}>
          📸 결과 링크 복사하기
        </button>

        <button onClick={() => window.location.href = '/'}
          className="w-full py-5 text-lg mb-8"
          style={{ background: 'transparent', color: '#fff', fontFamily: "var(--font-display)", border: '2px solid #fff', cursor: 'pointer' }}>
          나도 평가받기 →
        </button>

        <div className="text-[10px] tracking-wider uppercase pt-5 leading-loose"
          style={{ fontFamily: "var(--font-mono)", color: '#888', borderTop: '1px solid #333' }}>
          © 2026 FPTI · 오락 전용<br />
          심리학적 진단이 아닙니다
        </div>
      </section>
    </main>
  )
}
