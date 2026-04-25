'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({ users: 0, responses: 0 })
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

  return (
    <main className="min-h-screen" style={{ background: '#FAFAFA', color: '#0a0a0a' }}>
      {/* Header */}
      <header className="px-6 py-5 max-w-[480px] mx-auto flex justify-center">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: '#FFEE00', boxShadow: '0 3px 0 #0a0a0a' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>FPTI</span>
        </div>
      </header>

      {/* Hero - 한 화면 안에 다 들어옴 */}
      <section className="px-6 pt-8 pb-12 max-w-[480px] mx-auto text-center">
        <h1
          className="leading-[1.1] mb-5 tracking-tight"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 10vw, 56px)' }}
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
          2분 · 28문항 · 오락 전용
        </p>

        {stats.users > 0 && (
          <p className="text-xs mt-2" style={{ color: '#999' }}>
            지금까지 <strong style={{ color: '#0a0a0a' }}>{stats.users.toLocaleString()}명</strong>이 평가받았어요
          </p>
        )}
      </section>

      {/* 스크롤 유도 화살표 */}
      <div className="text-center pb-6" style={{ color: '#bbb', fontSize: 20 }}>↓</div>

      {/* What is FPTI - 짧게 */}
      <section className="px-6 pb-10 max-w-[480px] mx-auto text-center">
        <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
          MBTI는 <strong style={{ color: '#0a0a0a' }}>내가 보는 나</strong>.<br />
          FPTI는 <strong style={{ color: '#0a0a0a' }}>친구가 보는 나</strong>.<br /><br />
          본인이 답하는 테스트는 그만.<br />
          이번엔 다른 사람의 눈으로 보는 차례.
        </p>
      </section>

      {/* How - 간결하게 */}
      <section className="px-6 pb-12 max-w-[480px] mx-auto">
        <div className="flex justify-around text-center">
          {[
            { num: '1', title: '링크 만들기' },
            { num: '2', title: '친구에게 보내기' },
            { num: '3', title: '결과 확인' },
          ].map((step, i) => (
            <div key={i} className="flex-1">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-2"
                style={{ background: '#FFEE00', fontFamily: 'var(--font-display)', fontSize: 20 }}
              >
                {step.num}
              </div>
              <div className="text-xs" style={{ color: '#666' }}>{step.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center">
        <div className="text-xs" style={{ color: '#aaa', lineHeight: 1.8 }}>
          © 2026 FPTI · 오락 전용
        </div>
      </footer>
    </main>
  )
}
