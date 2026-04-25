'use client'

import { useState } from 'react'
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

const CHOICES = [
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

  const progress = Math.round(((current + 1) / QUESTIONS.length) * 100)
  const q = QUESTIONS[current]

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
      router.push(`/test/${token}/done`)
    } else {
      alert('오류가 발생했습니다. 다시 시도해주세요.')
      setSubmitting(false)
    }
  }

  const isLast = current === QUESTIONS.length - 1
  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  return (
    <main className="min-h-screen" style={{ background: '#FFE4D9', color: '#3D2817' }}>
      {/* 상단 진행 바 */}
      <div style={{ height: 6, background: '#FFCFBA' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: '#FFEE00',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

      <div className="max-w-[480px] mx-auto px-6">
        {/* 상단 정보 */}
        <header className="py-5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFEE00', boxShadow: '0 2px 0 #3D2817' }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#3D2817' }}>F</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>FPTI</span>
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              background: '#fff',
              border: '1.5px solid #FFCFBA',
              fontFamily: 'var(--font-mono)',
              color: '#7A5A47',
            }}
          >
            {current + 1} / {QUESTIONS.length}
          </div>
        </header>

        {/* 카테고리 라벨 */}
        <div className="flex justify-center pt-4 pb-3">
          <span
            className="text-xs px-3 py-1.5 rounded-full"
            style={{
              background: '#FFEE00',
              color: '#3D2817',
              fontFamily: 'var(--font-display)',
              border: '1.5px solid #3D2817',
            }}
          >
            {q.category}
          </span>
        </div>

        {/* 문항 카드 */}
        <div
          className="rounded-2xl p-6 mb-6"
          style={{
            background: '#fff',
            border: '2.5px solid #3D2817',
            boxShadow: '0 5px 0 #FF8A65',
            minHeight: 160,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h2
            className="text-center leading-snug"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(20px, 5.5vw, 28px)',
              color: '#3D2817',
            }}
          >
            {q.text}
          </h2>
        </div>

        {/* 답변 선택지 */}
        <div className="flex flex-col gap-2.5 pb-6">
          {CHOICES.map((choice) => {
            const isSelected = answers[q.id] === choice.value
            return (
              <button
                key={choice.value}
                onClick={() => handleAnswer(choice.value)}
                className="w-full py-4 px-5 text-center text-base transition-all rounded-2xl"
                style={{
                  background: isSelected ? '#3D2817' : '#fff',
                  color: isSelected ? '#fff' : '#3D2817',
                  border: `2px solid ${isSelected ? '#3D2817' : '#FFCFBA'}`,
                  boxShadow: isSelected ? '0 3px 0 #FF8A65' : '0 2px 0 #FFCFBA',
                  fontFamily: 'var(--font-display)',
                  cursor: 'pointer',
                  fontSize: 15,
                }}
              >
                {choice.label}
              </button>
            )
          })}
        </div>

        {/* 이전/다음 */}
        <div className="pb-12 flex gap-3">
          {current > 0 && (
            <button
              onClick={() => setCurrent(current - 1)}
              className="py-3 px-5 text-sm rounded-xl"
              style={{
                background: '#fff',
                color: '#7A5A47',
                border: '1.5px solid #FFCFBA',
                fontFamily: 'var(--font-display)',
                cursor: 'pointer',
              }}
            >
              ← 이전
            </button>
          )}

          {isLast && allAnswered && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 py-4 text-base rounded-2xl"
              style={{
                background: submitting ? '#A8826A' : '#3D2817',
                color: '#fff',
                border: 'none',
                fontFamily: 'var(--font-display)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: submitting ? 'none' : '0 4px 0 #FF8A65',
              }}
            >
              {submitting ? '제출 중...' : '답변 제출하기 →'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
