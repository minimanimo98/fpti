'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

const QUESTIONS = [
  { id: 1, text: "○○은 친구가 우울해 보일 때 먼저 말을 건다", category: "공감", reverse: false },
  { id: 2, text: "○○은 남의 얘기를 자기 얘기처럼 들어준다", category: "공감", reverse: false },
  { id: 3, text: "○○은 친구가 힘들어할 때 조언보다 위로가 먼저다", category: "공감", reverse: false },
  { id: 4, text: "○○은 상대방 말이 끝나기도 전에 자기 할 말을 한다", category: "공감", reverse: true },
  { id: 5, text: "○○은 친구의 기분 변화를 잘 알아챈다", category: "공감", reverse: false },
  { id: 6, text: "○○은 약속 시간에 늦지 않는다", category: "책임감", reverse: false },
  { id: 7, text: "○○은 한다고 한 일은 반드시 한다", category: "책임감", reverse: false },
  { id: 8, text: "○○은 자기가 잘못했을 때 깔끔하게 사과한다", category: "책임감", reverse: false },
  { id: 9, text: "○○은 일이 꼬이면 남 탓부터 찾는다", category: "책임감", reverse: true },
  { id: 10, text: "○○한테 비밀을 말해도 새어나가지 않을 것 같다", category: "신뢰", reverse: false },
  { id: 11, text: "○○은 허세나 과장이 심하다", category: "신뢰", reverse: true },
  { id: 12, text: "○○은 앞에서 하는 말과 뒤에서 하는 말이 다르다", category: "신뢰", reverse: true },
  { id: 13, text: "○○은 돈 관련된 일에 깔끔하다", category: "신뢰", reverse: false },
  { id: 14, text: "○○은 밥 먹을 때 다른 사람 속도에 맞춰 먹는다", category: "배려", reverse: false },
  { id: 15, text: "○○은 친구의 생일이나 기념일을 잘 챙긴다", category: "배려", reverse: false },
  { id: 16, text: "○○은 자기 편한 것보다 친구가 편한 걸 먼저 생각한다", category: "배려", reverse: false },
  { id: 17, text: "○○은 약속 장소를 늘 자기 집 근처로 잡는다", category: "배려", reverse: true },
  { id: 18, text: "○○은 같이 있으면 웃음이 끊이지 않는다", category: "유머", reverse: false },
  { id: 19, text: "○○은 어색한 분위기를 잘 풀어준다", category: "유머", reverse: false },
  { id: 20, text: "○○은 드립 타율이 좋다", category: "유머", reverse: false },
  { id: 21, text: "○○은 같이 놀고 나면 또 부르고 싶다", category: "유머", reverse: false },
  { id: 22, text: "○○은 대화의 8할이 자기 얘기다", category: "이기심", reverse: true },
  { id: 23, text: "○○은 본인 기분이 나쁘면 주변이 다 눈치 본다", category: "이기심", reverse: true },
  { id: 24, text: "○○은 필요할 때만 연락이 온다", category: "이기심", reverse: true },
  { id: 25, text: "○○은 손해 보는 일은 절대 하지 않는다", category: "이기심", reverse: true },
  { id: 26, text: "솔직히 ○○은 좀 재수없을 때가 있다", category: "보너스", reverse: true },
  { id: 27, text: "○○은 애인한테는 잘할 것 같다", category: "보너스", reverse: false },
  { id: 28, text: "내가 큰 잘못을 했을 때 ○○한테는 제일 먼저 말하고 싶지 않다", category: "보너스", reverse: true },
]

const BASE_CHOICES = [
  { label: "매우 그렇다", value: 2 },
  { label: "그런 편이다", value: 1 },
  { label: "모르겠다", value: 0 },
  { label: "아닌 편이다", value: -1 },
  { label: "전혀 아니다", value: -2 },
]

export default function TestPage() {
  const { token } = useParams()
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [current, setCurrent] = useState(0)
  const [shuffleSeeds, setShuffleSeeds] = useState<number[]>([])
  const [alreadyVoted, setAlreadyVoted] = useState(false)
  const [checking, setChecking] = useState(true)

  // 중복 답변 체크 (페이지 진입 즉시)
  useEffect(() => {
    if (typeof token !== 'string') return
    
    const votedKey = `fpti_voted_${token}`
    const hasVoted = localStorage.getItem(votedKey)
    
    if (hasVoted) {
      setAlreadyVoted(true)
    }
    setChecking(false)
  }, [token])

  useEffect(() => {
    setShuffleSeeds(QUESTIONS.map(() => Math.random()))
  }, [])

  const progress = Math.round(((current + 1) / QUESTIONS.length) * 100)
  const q = QUESTIONS[current]

  const shuffledChoices = (() => {
    const seed = shuffleSeeds[current] ?? 0
    const arr = [...BASE_CHOICES]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor((seed * (i + 1) * 13) % (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })()

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)
    if (current < QUESTIONS.length - 1) {
      setTimeout(() => setCurrent(current + 1), 250)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      alert('모든 문항에 답해주세요')
      return
    }
    setSubmitting(true)
    const res = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, answers }),
    })
    if (res.ok) {
      // 답변 완료 시 localStorage에 기록
      localStorage.setItem(`fpti_voted_${token}`, new Date().toISOString())
      router.push(`/test/${token}/done`)
    } else {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  const isLast = current === QUESTIONS.length - 1
  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  // 체크 중
  if (checking) {
    return (
      <main style={{ minHeight: '100vh', background: '#F5E6D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9B8268', fontSize: 13 }}>잠시만요...</p>
      </main>
    )
  }

  // 이미 답변한 사용자
  if (alreadyVoted) {
    return (
      <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810', paddingLeft: 16, paddingRight: 16 }}>
        <div style={{
          maxWidth: 448, marginLeft: 'auto', marginRight: 'auto',
          boxSizing: 'border-box',
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          paddingTop: 32, paddingBottom: 32,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#2C1810', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 14,
              }}>F</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>FPTI</span>
            </div>
          </div>

          <div style={{
            borderRadius: 20, padding: 28,
            textAlign: 'center', marginBottom: 16,
            background: '#fff', border: '2px solid #2C1810',
            boxShadow: '0 5px 0 #C97D5A',
            boxSizing: 'border-box', width: '100%',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🤔</div>
            <h1 style={{
              lineHeight: 1.3, marginBottom: 12,
              fontFamily: 'var(--font-display)', fontSize: 26, color: '#2C1810',
            }}>
              이미 답변하셨어요
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: '#5A4030' }}>
              한 친구당 한 번만 평가할 수 있어요.<br />
              결과는 친구한테만 공개됩니다.
            </p>
          </div>

          <button onClick={() => router.push('/')} style={{
            width: '100%', padding: 16, fontSize: 15, borderRadius: 16,
            background: '#2C1810', color: '#fff',
            fontFamily: 'var(--font-display)', border: 'none',
            cursor: 'pointer', boxShadow: '0 4px 0 #C97D5A',
            boxSizing: 'border-box',
          }}>
            나도 평가받기 →
          </button>

          <p style={{ fontSize: 11, color: '#9B8268', textAlign: 'center', marginTop: 16, fontFamily: 'var(--font-mono)' }}>
            본인 결과는 fpti.kr 첫화면에서 확인하세요
          </p>
        </div>
      </main>
    )
  }

  // 정상 답변 화면
  return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810' }}>
      <div style={{ height: 5, background: '#E5D4C0' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#C97D5A', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ paddingLeft: 16, paddingRight: 16 }}>
        <div style={{ maxWidth: 448, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' }}>
          <header style={{ paddingTop: 16, paddingBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 7,
                background: '#2C1810', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 13,
              }}>F</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>FPTI</span>
            </div>
            <div style={{
              fontSize: 11, padding: '6px 12px', borderRadius: 999,
              background: '#fff', border: '1.5px solid #E5D4C0',
              fontFamily: 'var(--font-mono)', color: '#6B5544',
            }}>
              {current + 1} / {QUESTIONS.length}
            </div>
          </header>

          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 16, paddingBottom: 12 }}>
            <span style={{
              fontSize: 11, padding: '6px 14px', borderRadius: 999,
              background: '#FFD96B', color: '#2C1810',
              fontFamily: 'var(--font-display)', border: '1.5px solid #2C1810',
            }}>
              {q.category}
            </span>
          </div>

          <div style={{
            borderRadius: 20, padding: 24, marginBottom: 20,
            background: '#fff', border: '2px solid #2C1810',
            boxShadow: '0 5px 0 #C97D5A',
            minHeight: 160,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxSizing: 'border-box', width: '100%',
          }}>
            <h2 style={{
              textAlign: 'center', lineHeight: 1.4,
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(18px, 5vw, 26px)', color: '#2C1810',
            }}>
              {q.text}
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
            {shuffledChoices.map((choice) => {
              const isSelected = answers[q.id] === choice.value
              return (
                <button
                  key={choice.value}
                  onClick={() => handleAnswer(choice.value)}
                  style={{
                    width: '100%', padding: '16px 20px', textAlign: 'center',
                    borderRadius: 16,
                    background: isSelected ? '#2C1810' : '#fff',
                    color: isSelected ? '#fff' : '#2C1810',
                    border: `2px solid ${isSelected ? '#2C1810' : '#E5D4C0'}`,
                    boxShadow: isSelected ? '0 3px 0 #C97D5A' : '0 2px 0 #E5D4C0',
                    fontFamily: 'var(--font-display)',
                    cursor: 'pointer', fontSize: 14,
                    boxSizing: 'border-box', transition: 'all 0.15s',
                  }}
                >
                  {choice.label}
                </button>
              )
            })}
          </div>

          <div style={{ paddingBottom: 32, display: 'flex', gap: 10 }}>
            {current > 0 && (
              <button onClick={() => setCurrent(current - 1)} style={{
                padding: '12px 18px', fontSize: 13, borderRadius: 12,
                background: '#fff', color: '#6B5544',
                border: '1.5px solid #E5D4C0',
                fontFamily: 'var(--font-display)', cursor: 'pointer',
              }}>
                ← 이전
              </button>
            )}

            {isLast && allAnswered && (
              <button onClick={handleSubmit} disabled={submitting} style={{
                flex: 1, padding: 16, fontSize: 15, borderRadius: 16,
                background: submitting ? '#9B8268' : '#2C1810',
                color: '#fff', border: 'none',
                fontFamily: 'var(--font-display)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 4px 0 #C97D5A',
                boxSizing: 'border-box',
              }}>
                {submitting ? '제출 중...' : '답변 제출하기 →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
