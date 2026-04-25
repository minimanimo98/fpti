'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ users: 0, responses: 0 })
  const [face, setFace] = useState(0)
  const [myToken, setMyToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => {})
    const saved = localStorage.getItem('fpti_my_token')
    if (saved) setMyToken(saved)
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

  const faces = [
    <g key="peek">
      <path d="M 45 60 Q 53 56 61 60" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="60" r="6" fill="#2C1810" />
      <circle cx="94" cy="58" r="2" fill="#fff" />
      <path d="M 60 85 Q 70 92 82 85" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    <g key="smile">
      <path d="M 42 58 Q 50 50 58 58" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 82 58 Q 90 50 98 58" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 55 82 Q 70 95 85 82" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    <g key="shock">
      <circle cx="50" cy="58" r="5" fill="#2C1810" />
      <circle cx="90" cy="58" r="5" fill="#2C1810" />
      <ellipse cx="70" cy="88" rx="8" ry="10" fill="#2C1810" />
    </g>,
    <g key="smirk">
      <path d="M 45 60 L 60 60" stroke="#2C1810" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 80 60 L 95 60" stroke="#2C1810" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 58 88 Q 75 82 85 90" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    <g key="sleepy">
      <path d="M 45 62 Q 53 66 61 62" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 82 62 Q 90 66 98 62" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="88" rx="6" ry="3" fill="#2C1810" />
    </g>,
  ]

  return (
    <main className="min-h-screen" style={{ background: '#F5E6D8', color: '#2C1810' }}>
      <div className="mx-auto px-5" style={{ maxWidth: 480 }}>

        {/* 헤더 */}
        <header className="py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: '#2C1810', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 14 }}
            >
              F
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#2C1810' }}>FPTI</span>
          </div>
        </header>

        {/* 이어서 보기 (있을 때만) */}
        {myToken && (
          <div
            className="mb-5 p-4 rounded-2xl flex items-center justify-between gap-3"
            style={{
              background: '#fff',
              border: '1.5px solid #E5D4C0',
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="text-xs mb-0.5" style={{ color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
                이어서 보기
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#2C1810' }}>
                내 결과 페이지로 이동
              </div>
            </div>
            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => router.push(`/result/${myToken}`)}
                className="px-3 py-2 text-xs rounded-lg whitespace-nowrap"
                style={{
                  background: '#2C1810',
                  color: '#fff',
                  fontFamily: 'var(--font-display)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                결과 보기
              </button>
              <button
                onClick={() => {
                  if (confirm('저장된 결과를 잊을까요?')) {
                    localStorage.removeItem('fpti_my_token')
                    setMyToken(null)
                  }
                }}
                aria-label="닫기"
                className="w-8 h-8 flex items-center justify-center text-sm rounded-lg"
                style={{
                  background: 'transparent',
                  color: '#9B8268',
                  border: '1px solid #E5D4C0',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 캐릭터 카드 */}
        <div className="flex flex-col items-center pt-4 pb-2">
          <button
            onClick={cycleFace}
            aria-label="표정 바꾸기"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 14 }}
          >
            <div
              style={{
                position: 'relative',
                width: 200,
                height: 200,
                borderRadius: 24,
                background: '#FFF8EE',
                border: '2.5px solid #2C1810',
                boxShadow: '0 6px 0 #C97D5A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.15s',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(2px)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              onTouchStart={(e) => (e.currentTarget.style.transform = 'translateY(2px)')}
              onTouchEnd={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{ position: 'absolute', top: 10, left: 10, width: 7, height: 7, borderRadius: '50%', background: '#C97D5A' }} />
              <div style={{ position: 'absolute', top: 10, right: 10, width: 7, height: 7, borderRadius: '50%', background: '#C97D5A' }} />
              <div style={{ position: 'absolute', bottom: 10, left: 10, width: 7, height: 7, borderRadius: '50%', background: '#C97D5A' }} />
              <div style={{ position: 'absolute', bottom: 10, right: 10, width: 7, height: 7, borderRadius: '50%', background: '#C97D5A' }} />
              <div style={{
                position: 'absolute',
                width: 130, height: 130,
                background: '#FFD96B',
                borderRadius: '50%',
                opacity: 0.35,
              }} />
              <svg
                width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"
                style={{ position: 'relative', zIndex: 1 }}
              >
                <ellipse cx="72" cy="128" rx="50" ry="6" fill="rgba(0,0,0,0.08)" />
                <circle cx="70" cy="65" r="55" fill="#FFD96B" stroke="#2C1810" strokeWidth="3.5" />
                <circle cx="42" cy="78" r="4" fill="#E89B7A" opacity="0.7" />
                <circle cx="98" cy="78" r="4" fill="#E89B7A" opacity="0.7" />
                {faces[face]}
              </svg>
            </div>
          </button>
          <p className="text-xs" style={{ color: '#9B8268', fontFamily: 'var(--font-mono)' }}>
            탭해서 표정 바꾸기
          </p>
        </div>

        {/* 메인 카피 */}
        <section className="pt-8 pb-6 text-center">
          <h1
            className="leading-[1.2] mb-5 tracking-tight"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 8.5vw, 46px)', color: '#2C1810' }}
          >
            내 인성,<br />
            <span
              style={{
                display: 'inline-block',
                background: 'linear-gradient(180deg, transparent 65%, #FFD96B 65%)',
                padding: '0 4px',
              }}
            >
              친구가 답한다.
            </span>
          </h1>

          <p className="text-base mb-7" style={{ color: '#5A4030', lineHeight: 1.6 }}>
            친구 3명이 답하면<br />
            진짜 내 인성이 드러납니다.
          </p>

          {/* 입력 */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              maxLength={20}
              className="w-full px-5 py-4 text-base outline-none rounded-2xl text-center"
              style={{
                background: '#fff',
                border: '2px solid #2C1810',
                fontFamily: 'var(--font-body)',
                color: '#2C1810',
                fontWeight: 500,
              }}
            />
          </div>
          {error && (
            <p className="text-sm mb-3" style={{ color: '#D32F2F' }}>{error}</p>
          )}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-5 text-lg rounded-2xl"
            style={{
              background: loading ? '#9B8268' : '#2C1810',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 5px 0 #C97D5A',
            }}
          >
            {loading ? '생성 중...' : '시작하기'}
          </button>

          <p className="text-xs mt-5" style={{ color: '#9B8268' }}>
            소요시간 2분 · 28문항
          </p>

          {stats.users > 0 && (
            <p className="text-xs mt-1" style={{ color: '#9B8268' }}>
              지금까지 <strong style={{ color: '#2C1810' }}>{stats.users.toLocaleString()}명</strong>이 평가받았어요
            </p>
          )}
        </section>

        {/* 설명 */}
        <section className="pb-8">
          <div
            className="rounded-2xl p-5 text-center"
            style={{
              background: '#fff',
              border: '1.5px solid #E5D4C0',
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#5A4030' }}>
              MBTI는 <strong style={{ color: '#2C1810' }}>내가 보는 나</strong>.<br />
              FPTI는 <strong style={{ color: '#2C1810' }}>친구가 보는 나</strong>.<br /><br />
              본인이 답하는 테스트는 그만.<br />
              이번엔 다른 사람의 눈으로 보는 차례.
            </p>
          </div>
        </section>

        <footer className="py-8 text-center">
          <div className="text-xs" style={{ color: '#9B8268', lineHeight: 1.8 }}>
            © 2026 FPTI
          </div>
        </footer>
      </div>
    </main>
  )
}
