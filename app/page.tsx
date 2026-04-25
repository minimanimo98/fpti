'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ users: 0, responses: 0 })
  const [face, setFace] = useState(0)
  const router = useRouter()

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

  const cycleFace = () => setFace((f) => (f + 1) % 5)

  // 5가지 표정
  const faces = [
    // 0: PEEK (한쪽 눈 흘끔)
    <g key="peek">
      <path d="M 45 60 Q 53 56 61 60" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="60" r="6" fill="#0a0a0a" />
      <circle cx="94" cy="58" r="2" fill="#fff" />
      <path d="M 60 85 Q 70 92 82 85" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    // 1: SMILE (헤헤)
    <g key="smile">
      <path d="M 42 58 Q 50 50 58 58" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 82 58 Q 90 50 98 58" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 55 82 Q 70 95 85 82" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    // 2: SHOCK (놀람)
    <g key="shock">
      <circle cx="50" cy="58" r="5" fill="#0a0a0a" />
      <circle cx="90" cy="58" r="5" fill="#0a0a0a" />
      <ellipse cx="70" cy="88" rx="8" ry="10" fill="#0a0a0a" />
    </g>,
    // 3: SMIRK (능글)
    <g key="smirk">
      <path d="M 45 60 L 60 60" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 80 60 L 95 60" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 58 88 Q 75 82 85 90" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    // 4: SLEEPY (졸림)
    <g key="sleepy">
      <path d="M 45 62 Q 53 66 61 62" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 82 62 Q 90 66 98 62" stroke="#0a0a0a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="88" rx="6" ry="3" fill="#0a0a0a" />
    </g>,
  ]

  return (
    <main className="min-h-screen" style={{ background: '#FAFAFA', color: '#0a0a0a' }}>
      {/* Header */}
      <header className="px-6 py-5 max-w-[480px] mx-auto flex justify-center">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#FFEE00', boxShadow: '0 3px 0 #0a0a0a' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>FPTI</span>
        </div>
      </header>

      {/* 클릭하면 표정 바뀌는 마스코트 */}
      <div className="flex justify-center pt-6 pb-2">
        <button
          onClick={cycleFace}
          aria-label="표정 바꾸기"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            xmlns="http://www.w3.org/2000/svg"
            style={{ transition: 'transform 0.15s' }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <ellipse cx="72" cy="128" rx="50" ry="6" fill="rgba(0,0,0,0.08)" />
            <circle cx="70" cy="65" r="55" fill="#FFEE00" stroke="#0a0a0a" strokeWidth="3.5" />
            <circle cx="42" cy="78" r="4" fill="#FF9999" opacity="0.5" />
            <circle cx="98" cy="78" r="4" fill="#FF9999" opacity="0.5" />
            {faces[face]}
          </svg>
        </button>
      </div>

      {/* Hero */}
      <section className="px-6 pt-2 pb-12 max-w-[480px] mx-auto text-center">
        <h1
          className="leading-[1.1] mb-5 tracking-tight"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 9.5vw, 52px)' }}
        >
          내 인성,<br />
          <span
            className="inline-block px-2.5 rounded-xl"
            style={{ background: '#FFEE00' }}
          >
            친구가 답한다.
          </span>
        </h1>

        <p className="text-base mb-8" style={{ color: '#555', lineHeight: 1.6 }}>
          친구 3명이 답하면<br />
          진짜 내 인성이 드러납니다.
        </p>

        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleStart()}
          maxLength={20}
          className="w-full px-5 py-4 text-base outline-none rounded-2xl mb-3 text-center"
          style={{
            background: '#fff',
            border: '1.5px solid #e5e5e5',
            fontFamily: 'var(--font-body)',
          }}
        />
        {error && (
          <p className="text-sm mb-3" style={{ color: '#e00' }}>{error}</p>
        )}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-5 text-lg rounded-2xl transition-all"
          style={{
            background: loading ? '#888' : '#0a0a0a',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 5px 0 #FFEE00',
          }}
        >
          {loading ? '생성 중...' : '시작하기'}
        </button>

        <p className="text-xs mt-5" style={{ color: '#999' }}>
          소요시간 2분 · 28문항
        </p>

        {stats.users > 0 && (
          <p className="text-xs mt-2" style={{ color: '#999' }}>
            지금까지 <strong style={{ color: '#0a0a0a' }}>{stats.users.toLocaleString()}명</strong>이 평가받았어요
          </p>
        )}
      </section>

      {/* 짧은 설명 */}
      <section className="px-6 pb-16 max-w-[480px] mx-auto text-center">
        <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
          MBTI는 <strong style={{ color: '#0a0a0a' }}>내가 보는 나</strong>.<br />
          FPTI는 <strong style={{ color: '#0a0a0a' }}>친구가 보는 나</strong>.<br /><br />
          본인이 답하는 테스트는 그만.<br />
          이번엔 다른 사람의 눈으로 보는 차례.
        </p>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <div className="text-xs" style={{ color: '#aaa', lineHeight: 1.8 }}>
          © 2026 FPTI
        </div>
      </footer>
    </main>
  )
}
