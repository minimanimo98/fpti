'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SharePage() {
  const { token } = useParams()
  const [copied, setCopied] = useState(false)
  const shareUrl = `https://fpti.kr/test/${token}`

  const INK = "#0a0a0a"
  const HIGHLIGHT = "#FFEE00"
  const GRAY = "#888888"

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKakao = () => {
    const kakaoUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`내 인성 평가해줘 👉 ${shareUrl}`)}`
    window.open(`sms:?body=${encodeURIComponent(`내 인성 평가해줘 👉 ${shareUrl}`)}`)
  }

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: '#fff' }}>
      {/* 상단 바 */}
      <div
        className="flex justify-between mb-12 pb-5 text-[11px] uppercase tracking-wider"
        style={{ fontFamily: "var(--font-mono)", borderBottom: `2px solid ${INK}` }}
      >
        <div className="font-bold">FPTI.KR</div>
        <div style={{ color: GRAY }}>STEP 1/3</div>
      </div>

      {/* 안내 */}
      <div
        className="text-xs mb-8 pl-2.5 leading-snug"
        style={{ fontFamily: "var(--font-mono)", borderLeft: `3px solid ${HIGHLIGHT}` }}
      >
        링크 생성 완료<br />
        이제 친구에게 보내세요
      </div>

      <h1
        className="leading-none tracking-tight mb-4"
        style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 9vw, 64px)" }}
      >
        링크를<br />
        <span className="px-2.5 inline-block" style={{ background: HIGHLIGHT, transform: "rotate(-1deg)" }}>
          친구에게
        </span>
        <br />
        보내세요.
      </h1>

      <p className="text-base leading-relaxed mb-10" style={{ color: '#333', fontWeight: 500 }}>
        친구가 링크를 클릭해서 답변하면<br />
        당신의 인성 점수가 집계됩니다.<br />
        <span style={{ color: GRAY, fontSize: '14px' }}>3명 이상 답변해야 결과 공개</span>
      </p>

      {/* 링크 박스 */}
      <div
        className="px-4 py-4 mb-4 text-sm break-all"
        style={{
          border: `2px solid ${INK}`,
          fontFamily: "var(--font-mono)",
          background: '#f9f9f9',
        }}
      >
        {shareUrl}
      </div>

      {/* 복사 버튼 */}
      <button
        onClick={handleCopy}
        className="w-full py-5 text-lg mb-4"
        style={{
          background: copied ? HIGHLIGHT : INK,
          color: copied ? INK : '#fff',
          fontFamily: "var(--font-display)",
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        {copied ? '✓ 복사됐어요!' : '🔗 링크 복사하기'}
      </button>

      {/* 카톡/문자 공유 */}
      <button
        onClick={handleCopy}
        className="w-full py-5 text-lg mb-12"
        style={{
          background: '#fff',
          color: INK,
          fontFamily: "var(--font-display)",
          border: `2px solid ${INK}`,
          cursor: 'pointer',
        }}
      >
        💬 카톡/문자로 보내기
      </button>

      {/* 결과 확인 안내 */}
      <div
        className="text-sm leading-relaxed p-5"
        style={{
          border: `1px solid #ddd`,
          color: GRAY,
          fontFamily: "var(--font-mono)",
        }}
      >
        친구들이 답변하면 자동으로 집계됩니다.<br />
        결과는 아래 링크에서 확인하세요:<br />
        <span
          className="underline cursor-pointer"
          style={{ color: INK }}
          onClick={() => window.location.href = `/result/${token}`}
        >
          fpti.kr/result/{token}
        </span>
      </div>
    </main>
  )
}
