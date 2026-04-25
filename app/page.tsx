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
      <path d="M 45 60 Q 53 56 61 60" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="92" cy="60" r="6" fill="#3D2817" />
      <circle cx="94" cy="58" r="2" fill="#fff" />
      <path d="M 60 85 Q 70 92 82 85" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    <g key="smile">
      <path d="M 42 58 Q 50 50 58 58" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 82 58 Q 90 50 98 58" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 55 82 Q 70 95 85 82" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    <g key="shock">
      <circle cx="50" cy="58" r="5" fill="#3D2817" />
      <circle cx="90" cy="58" r="5" fill="#3D2817" />
      <ellipse cx="70" cy="88" rx="8" ry="10" fill="#3D2817" />
    </g>,
    <g key="smirk">
      <path d="M 45 60 L 60 60" stroke="#3D2817" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 80 60 L 95 60" stroke="#3D2817" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 58 88 Q 75 82 85 90" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>,
    <g key="sleepy">
      <path d="M 45 62 Q 53 66 61 62" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 82 62 Q 90 66 98 62" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="70" cy="88" rx="6" ry="3" fill="#3D2817" />
    </g>,
  ]

  return (
    <main className="min-h-screen" style={{ background: '#FFE4D9', color: '#3D2817' }}>
      {myToken && (
        <div
          className="px-4 py-3 mt-4 mb-2 mx-6 rounded-2xl flex items-center justify-between max-w-[480px] mx-auto"
          style={{
            background: '#fff',
            border: '2px solid #FF8A65',
            boxShadow: '0 3px 0 #FF8A65',
          }}
        >
          <div>
            <div className="text-xs" style={{ color: '#A8826A' }}>이어서 보기</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#3D2817' }}>내 결과 페이지</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/result/${myToken}`)}
              className="px-3 py-2 text-xs rounded-lg"
              style={{
                background: '#3D2817',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                border: 'none',
              }}
            >
              결과 →
            </button>
            <button
              onClick={() => {
                if (confirm('저장된 결과를 잊을까요?')) {
                  localStorage.removeItem('fpti_my_token')
                  setMyToken(null)
                }
              }}
              className="px-2 py-2 text-xs rounded-lg"
              style={{
                background: '#fff',
                color: '#A8826A',
                border: '1px solid #FFCFBA',
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <header className="px-6 py-5 max-w-[480px] mx-auto flex justify-center">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#FFEE00', boxShadow: '0 3px 0 #3D2817' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>FPTI</span>
        </div>
      </header>

      {/* 캐릭터 카드 (타로카드 미니 버전) */}
      <div className="flex justify-center pt-4 pb-2">
        <button
          onClick={cycleFace}
          aria-label="표정 바꾸기"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div
            style={{
              position: 'relative',
              width: 200,
              height: 200,
              borderRadius: 24,
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7F0 100%)',
              border: '3px solid #3D2817',
              boxShadow: '0 8px 0 #FF8A65',
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
            <div style={{
              position: 'absolute', top: 8, left: 8,
              width: 8, height: 8, borderRadius: '50%', background: '#FF8A65'
            }} />
            <div style={{
              position: 'absolute', top: 8, right: 8,
              width: 8, height: 8, borderRadius: '50%', background: '#FF8A65'
            }} />
            <div style={{
              position: 'absolute', bottom: 8, left: 8,
              width: 8, height: 8, borderRadius: '50%', background: '#FF8A65'
            }} />
            <div style={{
              position: 'absolute', bottom: 8, right: 8,
              width: 8, height: 8, borderRadius: '50%', background: '#FF8A65'
            }} />
            <div style={{
              position: 'absolute',
              width: 130, height: 130,
              background: 'radial-gradient(circle, #FFEE00 0%, #FFD700 100%)',
              borderRadius: '50%',
              opacity: 0.4,
            }} />
            <svg
              width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <ellipse cx="72" cy="128" rx="50" ry="6" fill="rgba(0,0,0,0.08)" />
              <circle cx="70" cy="65" r="55" fill="#FFEE00" stroke="#3D2817" strokeWidth="3.5" />
              <circle cx="42" cy="78" r="4" fill="#FF8A65" opacity="0.6" />
              <circle cx="98" cy="78" r="4" fill="#FF8A65" opacity="0.6" />
              {faces[face]}
            </svg>
          </div>
        </button>
      </div>

      <p className="text-xs text-center mb-4" style={{ color: '#A8826A', fontFamily: 'var(--font-mono)' }}>
        탭해서 표정 바꾸기 ✨
      </p>

      <section className="px-6 pb-12 max-w-[480px] mx-auto text-center">
        <h1
          className="leading-[1.1] mb-5 tracking-tight"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 9.5vw, 52px)', color: '#3D2817' }}
        >
          내 인성,<br />
          <span
            className="inline-block px-2.5 rounded-xl"
            style={{ background: '#FFEE00', boxShadow: '0 3px 0 #3D2817' }}
          >
            친구가 답한다.
          </span>
        </h1>

        <p className="text-base mb-8" style={{ color: '#5A4030', lineHeight: 1.6 }}>
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
            border: '2px solid #FFCFBA',
            fontFamily: 'var(--font-body)',
            color: '#3D2817',
          }}
        />
        {error && (
          <p className="text-sm mb-3" style={{ color: '#D32F2F' }}>{error}</p>
        )}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-5 text-lg rounded-2xl transition-all"
          style={{
            background: loading ? '#A8826A' : '#3D2817',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 5px 0 #FF8A65',
          }}
        >
          {loading ? '생성 중...' : '시작하기'}
        </button>

        <p className="text-xs mt-5" style={{ color: '#A8826A' }}>
          소요시간 2분 · 28문항
        </p>

        {stats.users > 0 && (
          <p className="text-xs mt-2" style={{ color: '#A8826A' }}>
            지금까지 <strong style={{ color: '#3D2817' }}>{stats.users.toLocaleString()}명</strong>이 평가받았어요
          </p>
        )}
      </section>

      <section className="px-6 pb-12 max-w-[480px] mx-auto">
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: '#fff',
            border: '2px solid #FFCFBA',
            boxShadow: '0 4px 0 #FFCFBA',
          }}
        >
          <p className="text-sm leading-relaxed" style={{ color: '#5A4030' }}>
            MBTI는 <strong style={{ color: '#3D2817' }}>내가 보는 나</strong>.<br />
            FPTI는 <strong style={{ color: '#3D2817' }}>친구가 보는 나</strong>.<br /><br />
            본인이 답하는 테스트는 그만.<br />
            이번엔 다른 사람의 눈으로 보는 차례.
          </p>
        </div>
      </section>

      <footer className="px-6 py-8 text-center">
        <div className="text-xs" style={{ color: '#A8826A', lineHeight: 1.8 }}>
          © 2026 FPTI
        </div>
      </footer>
    </main>
  )
}
