'use client'

import { useParams } from 'next/navigation'

export default function DonePage() {
  const { token } = useParams()
  const INK = "#0a0a0a"
  const HIGHLIGHT = "#FFEE00"

  return (
    <main className="min-h-screen px-6 py-12 flex flex-col justify-center" style={{ background: '#fff' }}>
      <div
        className="text-xs mb-8 pl-2.5 leading-snug"
        style={{ fontFamily: "var(--font-mono)", borderLeft: `3px solid ${HIGHLIGHT}`, color: '#888' }}
      >
        답변 완료
      </div>

      <h1
        className="leading-none tracking-tight mb-6"
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 10vw, 72px)" }}
      >
        답변이<br />
        <span className="px-2.5 inline-block" style={{ background: HIGHLIGHT, transform: "rotate(-1deg)" }}>
          전달됐어요.
        </span>
      </h1>

      <p className="text-base leading-relaxed mb-12" style={{ color: '#333', fontWeight: 500 }}>
        솔직하게 답해줘서 고마워요.<br />
        친구의 인성 결과에 반영됩니다.
      </p>

      <div
        className="p-5 mb-8 text-sm leading-relaxed"
        style={{ border: `2px solid ${INK}`, fontFamily: "var(--font-mono)", color: '#555' }}
      >
        💡 나도 친구들한테 평가받고 싶다면?<br />
        <span
          className="underline cursor-pointer font-bold"
          style={{ color: INK }}
          onClick={() => window.location.href = '/'}
        >
          fpti.kr에서 시작하기 →
        </span>
      </div>
    </main>
  )
}
