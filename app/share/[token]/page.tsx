'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SharePage() {
  const { token } = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(0)
  const shareUrl = `https://fpti.kr/test/${token}`

  const INK = "#0a0a0a"
  const HIGHLIGHT = "#FFEE00"
  const GRAY = "#888888"

  // 5초마다 응답 수 폴링
  useEffect(() => {
    const fetchCount = async () => {
      const res = await fetch(`/api/get-result?token=${token}`)
      const data = await res.json()
      setCount(data.count || 0)
      // 3명 이상이면 자동으로 결과 페이지로 이동
      if (data.count >= 3) {
        setTimeout(() => router.push(`/result/${token}`), 1500)
      }
    }
    fetchCount()
    const interval = setInterval(fetchCount, 5000)
    return () => clearInterval(interval)
  }, [token, router])

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKakao = () => {
    if (navigator.share) {
      navigator.share({
        title: '내 인성 평가해줘',
        text: '내 인성 평가해줘 👉',
        url: shareUrl,
      }).catch(() => handleCopy())
    } else {
      handleCopy()
    }
  }

  return (
    <main className="min-h-screen px-6 py-12" style={{ background: '#fff' }}>
      <div
        className="flex justify-between mb-12 pb-5 text-[11px] uppercase tracking-wider"
        style={{ fontFamily: "var(--font-mono)", borderBottom: `2px solid ${INK}` }}
      >
        <div className="font-bold">FPTI.KR</div>
        <div style={{ color: GRAY }}>STEP 1/3</div>
      </div>

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

      <p className="text-base leading-relaxed mb-8" style={{ color: '#333', fontWeight: 500 }}>
        친구가 링크를 클릭해서 답변하면<br />
        당신의 인성 점수가 집계됩니다.
      </p>

      {/* 실시간 카운터 */}
      <div
        className="px-5 py-4 mb-6 flex items-center justify-between"
        style={{
          background: count >= 3 ? HIGHLIGHT : '#f5f5f5',
          border: `2px solid ${INK}`,
          fontFamily: 'var(--font-mono)',
        }}
      >
        <div className="text-xs" style={{ color: count >= 3 ? INK : GRAY }}>
          {count >= 3 ? '✓ 결과 공개 가능!' : '응답 대기 중'}
        </div>
        <div className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          {count} / 3
        </div>
      </div>

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

      <button
        onClick={handleKakao}
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

      <button
        onClick={() => router.push(`/result/${token}`)}
        className="w-full py-4 text-base"
        style={{
          background: 'transparent',
          color: GRAY,
          fontFamily: "var(--font-mono)",
          border: `1px dashed ${GRAY}`,
          cursor: 'pointer',
        }}
      >
        결과 페이지 바로가기 →
      </button>
    </main>
  )
}
