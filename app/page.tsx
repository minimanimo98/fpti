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
      <header className="px-6 py-5 max-w-[600px] mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: '#FFEE00', boxShadow: '0 2px 0 #0a0a0a' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>FPTI</span>
        </div>
        <span className="text-xs" style={{ color: '#888' }}>한국어</span>
      </header>

      {/* Hero */}
      <section className="px-6 pt-10 pb-14 max-w-[600px] mx-auto text-center">
        <div
          className="inline-block px-4 py-1.5 mb-7 text-xs rounded-full"
          style={{ background: 'rgba(255,238,0,0.4)', border: '1px solid rgba(0,0,0,0.08)' }}
        >
          12개 유형 · 28문항 · 2분 소요
        </div>

        <h1
          className="leading-[1.05] mb-6 tracking-tight"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 10vw, 64px)' }}
        >
          MBTI는 내가 보는 나.<br />
          <span
            className="inline-block px-3 py-0.5 rounded-2xl mt-2"
            style={{ background: '#FFEE00', boxShadow: '0 3px 0 #0a0a0a' }}
          >
            FPTI
          </span>
          는<br />친구가 보는 나.
        </h1>

        <p className="text-base mb-10 px-2" style={{ color: '#555', lineHeight: 1.7 }}>
          본인이 답하는 테스트는 그만.<br />
          친구 3명이 답하면 진짜 인성이 드러납니다.
        </p>

        {/* Input Card */}
        <div
          className="rounded-2xl p-5 mb-3 mx-auto max-w-[420px]"
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <input
            type="text"
            placeholder="닉네임 (예: 회사 김지훈)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            maxLength={20}
            className="w-full px-4 py-3.5 text-base outline-none rounded-xl mb-3"
            style={{
              background: '#FAFAFA',
              border: '1px solid #eaeaea',
              fontFamily: 'var(--font-body)',
              textAlign: 'center',
            }}
          />
          {error && (
            <p className="text-sm mb-3" style={{ color: '#e00' }}>{error}</p>
          )}
          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full py-4 text-lg rounded-xl transition-all"
            style={{
              background: loading ? '#888' : '#0a0a0a',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 0 #FFEE00',
            }}
          >
            {loading ? '생성 중...' : '평가받기 시작 →'}
          </button>
        </div>

        <p className="text-xs mt-4" style={{ color: '#999' }}>
          오락 전용 · 심리학적 진단이 아닙니다
        </p>
      </section>

      {/* Live Stats Card */}
      <section className="px-6 pb-8 max-w-[600px] mx-auto">
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div className="text-xs mb-4" style={{ color: '#888' }}>
            🔴 실시간
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div
                className="leading-none mb-1.5"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 7vw, 40px)' }}
              >
                {stats.users.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: '#666' }}>명이 평가받았어요</div>
            </div>
            <div>
              <div
                className="leading-none mb-1.5"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 7vw, 40px)' }}
              >
                {stats.responses.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: '#666' }}>건의 솔직한 답변</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is FPTI */}
      <section className="px-6 pb-8 max-w-[600px] mx-auto">
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <h2
            className="mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}
          >
            FPTI가 뭔가요?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: '#444' }}>
            <strong>F</strong>riend <strong>P</strong>ersonality <strong>T</strong>ype <strong>I</strong>ndicator.
            친구들이 답하는 인성 테스트입니다. 자기를 객관적으로 보는 사람이 얼마나 될까요. FPTI는 그 허점에서 출발합니다.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 pb-8 max-w-[600px] mx-auto">
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <h2
            className="mb-5"
            style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}
          >
            어떻게 작동하나요?
          </h2>
          {[
            { num: '1', title: '링크 만들기', desc: '닉네임 입력. 30초.' },
            { num: '2', title: '친구에게 전송', desc: '카톡, DM, 어디든.' },
            { num: '3', title: '결과 공개', desc: '3명 응답하면 잠금 해제.' },
          ].map((step, i, arr) => (
            <div
              key={i}
              className="flex items-center gap-4"
              style={{
                paddingTop: i === 0 ? 0 : 16,
                paddingBottom: i === arr.length - 1 ? 0 : 16,
                borderBottom: i === arr.length - 1 ? 'none' : '1px solid #f0f0f0',
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: '#FFEE00', fontFamily: 'var(--font-display)', fontSize: 18 }}
              >
                {step.num}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{step.title}</div>
                <div className="text-sm" style={{ color: '#666' }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Type Preview */}
      <section className="px-6 pb-8 max-w-[600px] mx-auto">
        <div
          className="rounded-2xl p-6"
          style={{
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <h2
            className="mb-4"
            style={{ fontFamily: 'var(--font-display)', fontSize: 24 }}
          >
            12가지 유형
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              '성인군자', '걸어다니는 힐링', '다정한 호구', '상식선 인간',
              '무난무취형', '은근한 빌런', '뒷담화 챔피언', '기분파 폭군',
              '감정 흡혈귀', '허당 귀요미', '???', '???'
            ].map((type, i) => (
              <span
                key={i}
                className="px-3 py-1.5 text-xs rounded-full"
                style={{
                  background: type === '???' ? '#0a0a0a' : '#f5f5f5',
                  color: type === '???' ? '#FFEE00' : '#333',
                  border: type === '???' ? 'none' : '1px solid #eaeaea',
                }}
              >
                {type}
              </span>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: '#888' }}>
            마지막 두 개는 <strong style={{ color: '#0a0a0a' }}>숨은 유형</strong>입니다. 대부분 평생 받지 못합니다.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pt-4 pb-12 max-w-[600px] mx-auto text-center">
        <h2
          className="mb-6 leading-tight"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 6vw, 36px)' }}
        >
          친구들이 뭐라고 답할지,<br />
          <span
            className="inline-block px-2 rounded-xl mt-1"
            style={{ background: '#FFEE00' }}
          >
            안 궁금해요?
          </span>
        </h2>
        <button
          onClick={() => document.querySelector('input')?.focus()}
          className="px-10 py-4 text-lg rounded-xl transition-all"
          style={{
            background: '#0a0a0a',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #FFEE00',
          }}
        >
          시작하기 →
        </button>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid #eaeaea' }}>
        <div className="text-xs" style={{ color: '#999', lineHeight: 1.8 }}>
          © 2026 FPTI · 오락 전용<br />
          심리학적 진단이 아닙니다
        </div>
      </footer>
    </main>
  )
}
