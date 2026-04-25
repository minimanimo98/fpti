'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ users: 0, responses: 0 })
  const router = useRouter()

  const INK = "#0a0a0a"
  const PAPER = "#ffffff"
  const HIGHLIGHT = "#FFEE00"
  const GRAY = "#888888"

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const handleStart = async () => {
    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요')
      return
    }
    setLoading(true)
    setError('')

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname }),
    })

    const data = await res.json()

    if (data.error) {
      setError(data.error)
      setLoading(false)
      return
    }

    router.push(`/share/${data.token}`)
  }

  return (
    <main>
      <div
        className="flex justify-between px-6 py-5 text-[11px] uppercase tracking-wider"
        style={{ fontFamily: "var(--font-mono)", borderBottom: `2px solid ${INK}` }}
      >
        <div className="font-bold">FPTI.KR</div>
        <div style={{ color: GRAY }}>VOL.01 · 2026</div>
      </div>

      <section className="px-6 pt-10 pb-16">
        <div
          className="text-xs mb-8 pl-2.5 leading-snug"
          style={{ fontFamily: "var(--font-mono)", borderLeft: `3px solid ${HIGHLIGHT}` }}
        >
          FRIEND PERSONALITY TYPE INDICATOR<br />
          NO.001 · SEOUL
        </div>

        <h1
          className="leading-none tracking-tight mb-7"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 11vw, 88px)" }}
        >
          친구들한테<br />
          물어봤습니다.<br />
          <span
            className="px-2.5 inline-block"
            style={{ background: HIGHLIGHT, transform: "rotate(-1.5deg)" }}
          >
            당신 인성
          </span>
          <br />
          몇 점인지.
        </h1>

        <p className="text-base leading-relaxed mb-9 max-w-[480px] font-medium" style={{ color: "#333" }}>
          MBTI는 당신이 보는 당신.<br />
          FPTI는 친구가 보는 당신.<br />
          친구 3명의 답으로 당신의 진짜 인성이 드러납니다.
        </p>

        <div className="mb-3 max-w-[400px]">
          <input
            type="text"
            placeholder="닉네임 입력 (예: 김지훈)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            maxLength={20}
            className="w-full px-5 py-4 text-base outline-none"
            style={{
              border: `2px solid ${INK}`,
              fontFamily: "var(--font-body)",
              background: PAPER,
              color: INK,
            }}
          />
          {error && (
            <p className="text-sm mt-2" style={{ color: '#e00' }}>{error}</p>
          )}
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleStart}
            disabled={loading}
            className="px-8 py-[18px] text-lg inline-flex items-center gap-2.5"
            style={{
              background: loading ? GRAY : INK,
              color: PAPER,
              fontFamily: "var(--font-display)",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? '생성 중...' : '평가받기 시작 →'}
          </button>
          <span
            className="text-[11px] tracking-wider"
            style={{ color: GRAY, fontFamily: "var(--font-mono)" }}
          >
            2분 · 28문항 · 오락 전용
          </span>
        </div>
      </section>

      <div
        className="leading-[0.85] tracking-[-0.04em] py-6 overflow-hidden text-center"
        style={{
          fontFamily: "var(--font-archivo)",
          fontSize: "clamp(120px, 38vw, 320px)",
          color: INK,
          borderTop: `2px solid ${INK}`,
          borderBottom: `2px solid ${INK}`,
        }}
      >
        FPTI
      </div>

      {/* 실시간 통계 */}
      <section className="px-6 py-9" style={{ borderBottom: `2px solid ${INK}` }}>
        <div
          className="text-[11px] uppercase tracking-wider mb-6"
          style={{ color: GRAY, fontFamily: "var(--font-mono)" }}
        >
          — Live Stats
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div
              className="leading-none mb-1.5"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 9vw, 56px)" }}
            >
              {stats.users.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: GRAY }}>명이 평가받았어요</div>
          </div>
          <div>
            <div
              className="leading-none mb-1.5"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 9vw, 56px)" }}
            >
              {stats.responses.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: GRAY }}>건의 솔직한 답변</div>
          </div>
        </div>
      </section>

      <section className="px-6 py-9" style={{ borderBottom: `2px solid ${INK}` }}>
        <div
          className="text-[11px] uppercase tracking-wider mb-6"
          style={{ color: GRAY, fontFamily: "var(--font-mono)" }}
        >
          — By the Numbers
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: "12", desc: "성격 유형" },
            { num: "28", desc: "평가 문항" },
            { num: "2분", desc: "완료 시간" },
          ].map((s, i) => (
            <div key={i}>
              <div
                className="leading-none mb-1.5"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 9vw, 56px)" }}
              >
                {s.num}
              </div>
              <div className="text-xs" style={{ color: GRAY }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6" style={{ background: INK, color: PAPER, paddingTop: "60px", paddingBottom: "28px" }}>
        <h2
          className="leading-tight mb-7"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 7vw, 42px)", color: PAPER }}
        >
          친구들이 뭐라고<br />답할지, 안 궁금해요?
        </h2>
        <button
          onClick={handleStart}
          className="px-8 py-[18px] text-lg mb-9"
          style={{
            background: HIGHLIGHT,
            color: INK,
            fontFamily: "var(--font-display)",
            border: "none",
            cursor: "pointer",
          }}
        >
          FPTI 시작하기 →
        </button>
        <div
          className="text-[10px] tracking-wider uppercase pt-5 leading-loose"
          style={{ fontFamily: "var(--font-mono)", color: "#888", borderTop: "1px solid #333" }}
        >
          © 2026 FPTI · 오락 전용<br />
          심리학적 진단이 아닙니다
        </div>
      </section>
    </main>
  )
}
