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
  const resultUrl = `https://fpti.kr/result/${token}`

  // 본인 토큰 localStorage에 저장 (페이지 들어오는 즉시)
  useEffect(() => {
    if (typeof token === 'string') {
      localStorage.setItem('fpti_my_token', token)
    }
  }, [token])

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

  // 공유 메시지에 본인 결과 링크도 포함
  const handleShare = async () => {
    const shareText = `내 인성 평가해줘 🥺\n\n👉 ${shareUrl}\n\n(내 결과는 여기서: ${resultUrl})`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FPTI - 내 인성 평가해줘',
          text: shareText,
          url: shareUrl,
        })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  return (
    <main className="min-h-screen px-6 py-10" style={{ background: '#FAFAFA', color: '#0a0a0a' }}>
      {/* 헤더 */}
      <header className="max-w-[480px] mx-auto flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#FFEE00', boxShadow: '0 2px 0 #0a0a0a' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>F</span>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>FPTI</span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-xs px-3 py-1.5 rounded-full"
          style={{ color: '#666', background: '#fff', border: '1px solid #e5e5e5' }}
        >
          처음으로
        </button>
      </header>

      <div className="max-w-[480px] mx-auto">
        {/* 본인 결과 링크 - 강조 (북마크 안내) */}
        <div
          className="p-5 mb-6 rounded-2xl"
          style={{
            background: '#FFFBE5',
            border: '2px solid #FFEE00',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: 20 }}>⭐</span>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>
              여기 꼭 저장하세요
            </strong>
          </div>
          <p className="text-sm mb-3" style={{ color: '#444', lineHeight: 1.5 }}>
            <strong>{nickname}</strong>님의 결과 페이지예요.<br />
            이 링크 잃어버리면 결과 못 봐요.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(resultUrl)
                alert('결과 링크 복사됨!\n메모장이나 카톡에 저장하세요.')
              }}
              className="flex-1 py-3 text-sm rounded-xl"
              style={{
                background: '#0a0a0a',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                border: 'none',
              }}
            >
              📋 결과 링크 저장
            </button>
            <button
              onClick={() => router.push(`/result/${token}`)}
              className="px-4 py-3 text-sm rounded-xl"
              style={{
                background: '#fff',
                color: '#0a0a0a',
                fontFamily: 'var(--font-display)',
                border: '1.5px solid #0a0a0a',
              }}
            >
              보기 →
            </button>
          </div>
        </div>

        {/* 응답 카운터 */}
        <div
          className="p-5 mb-6 rounded-2xl flex items-center justify-between"
          style={{
            background: count >= 3 ? '#FFEE00' : '#fff',
            border: '1.5px solid ' + (count >= 3 ? '#0a0a0a' : '#e5e5e5'),
            boxShadow: count >= 3 ? '0 3px 0 #0a0a0a' : '0 2px 12px rgba(0,0,0,0.04)',
          }}
        >
          <div>
            <div className="text-xs mb-1" style={{ color: '#666' }}>
              {count >= 3 ? '✓ 결과 공개됐어요!' : '응답 대기 중'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14 }}>
              {count >= 3 ? '잠시 후 결과로 이동' : '3명 이상 답변 필요'}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}>
            {count}/3
          </div>
        </div>

        {/* 공유 안내 */}
        <h1
          className="leading-tight mb-3 text-center"
          style={{ fontFamily: 'var(--font-display)', fontSize: 32 }}
        >
          친구에게<br />
          <span className="inline-block px-2 rounded-lg mt-1" style={{ background: '#FFEE00' }}>
            평가받기
          </span>
        </h1>

        <p className="text-sm text-center mb-6" style={{ color: '#666' }}>
          친구가 답하면 점수가 집계됩니다
        </p>

        {/* 공유 버튼 */}
        <button
          onClick={handleShare}
          className="w-full py-4 text-base rounded-2xl mb-3 transition-all"
          style={{
            background: '#0a0a0a',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #FFEE00',
          }}
        >
          💛 카톡/메시지로 공유
        </button>

        <button
          onClick={handleCopy}
          className="w-full py-3 text-sm rounded-2xl mb-6"
          style={{
            background: copied ? '#FFEE00' : '#fff',
            color: '#0a0a0a',
            border: '1.5px solid #e5e5e5',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {copied ? '✓ 복사됐어요!' : '🔗 평가 링크만 복사'}
        </button>

        {/* 링크 미리보기 */}
        <div
          className="p-3 text-xs break-all rounded-xl"
          style={{
            border: '1px dashed #ccc',
            fontFamily: 'var(--font-mono)',
            background: '#fff',
            color: '#888',
          }}
        >
          {shareUrl}
        </div>
      </div>
    </main>
  )
}
