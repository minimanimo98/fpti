'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SharePage() {
  const { token } = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(0)
  const [nickname, setNickname] = useState('친구')
  const shareUrl = `https://fpti.kr/test/${token}`

  const INK = "#0a0a0a"
  const HIGHLIGHT = "#FFEE00"
  const GRAY = "#888888"

  useEffect(() => {
    const fetchCount = async () => {
      const res = await fetch(`/api/get-result?token=${token}`)
      const data = await res.json()
      setCount(data.count || 0)
      if (data.nickname) setNickname(data.nickname)
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

  // 모바일 공유 (Web Share API)
  const handleShare = async () => {
    const shareText = `내 인성 평가해줘 🥺\n${nickname}이(가) 어떤 사람인지 솔직하게 답해줘.\n2분이면 끝!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FPTI - 내 인성 평가해줘',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        // 사용자가 취소한 경우는 무시
        if ((err as Error).name !== 'AbortError') {
          handleCopy()
        }
      }
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

      {/* 메인 공유 버튼 */}
      <button
        onClick={handleShare}
        className="w-full py-5 text-lg mb-3 flex items-center justify-center gap-2"
        style={{
          background: HIGHLIGHT,
          color: INK,
          fontFamily: "var(--font-display)",
          border: `2px solid ${INK}`,
          cursor: 'pointer',
        }}
      >
        💛 카톡/메시지로 공유
      </button>

      {/* 링크 복사 (보조) */}
      <button
        onClick={handleCopy}
        className="w-full py-4 text-base mb-8"
        style={{
          background: copied ? '#f5f5f5' : '#fff',
          color: INK,
          fontFamily: "var(--font-mono)",
          border: `1px solid ${INK}`,
          cursor: 'pointer',
        }}
      >
        {copied ? '✓ 복사됐어요!' : '🔗 링크 복사하기'}
      </button>

      {/* 링크 미리보기 */}
      <div
        className="px-4 py-3 mb-12 text-xs break-all"
        style={{
          border: `1px dashed ${GRAY}`,
          fontFamily: "var(--font-mono)",
          background: '#fafafa',
          color: GRAY,
        }}
      >
        {shareUrl}
      </div>

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
