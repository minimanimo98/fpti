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
    <main className="min-h-screen" style={{ background: '#FFE4D9', color: '#3D2817' }}>
      <div className="max-w-[480px] mx-auto px-6">
        {/* 헤더 */}
        <header className="py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#FFEE00', boxShadow: '0 3px 0 #3D2817' }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#3D2817' }}>F</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>FPTI</span>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-xs px-3 py-2 rounded-full"
            style={{ color: '#7A5A47', background: '#fff', border: '1.5px solid #FFCFBA' }}
          >
            처음으로
          </button>
        </header>

        {/* 응답 카운터 (가장 위로 - 제일 중요) */}
        <div
          className="p-5 mb-5 rounded-2xl flex items-center justify-between"
          style={{
            background: count >= 3 ? '#FFEE00' : '#fff',
            border: '2.5px solid #3D2817',
            boxShadow: '0 5px 0 ' + (count >= 3 ? '#3D2817' : '#FF8A65'),
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div className="text-xs mb-1" style={{ color: '#7A5A47' }}>
              {count >= 3 ? '✓ 결과 공개됐어요!' : count > 0 ? '응답 진행 중' : '응답 대기 중'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#3D2817' }}>
              {count >= 3
                ? '잠시 후 결과로 이동'
                : count > 0
                  ? `${3 - count}명 더 답하면 정확도 ↑`
                  : '한 명만 답해도 임시 결과'}
            </div>
          </div>
          <div
            className="flex-shrink-0 ml-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: '#3D2817', lineHeight: 1 }}
          >
            {count}<span style={{ fontSize: 18, color: '#A8826A' }}>/3</span>
          </div>
        </div>

        {/* 메인 안내 */}
        <h1
          className="leading-[1.2] mb-3 text-center"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 8vw, 38px)', color: '#3D2817' }}
        >
          친구에게<br />
          <span
            style={{
              display: 'inline-block',
              background: 'linear-gradient(180deg, transparent 60%, #FFEE00 60%)',
              padding: '0 4px',
            }}
          >
            평가받기
          </span>
        </h1>

        <p className="text-sm text-center mb-6" style={{ color: '#5A4030' }}>
          친구가 답하면 점수가 집계됩니다
        </p>

        {/* 공유 버튼 (가장 큰 액션) */}
        <button
          onClick={handleShare}
          className="w-full py-5 text-base rounded-2xl mb-3 transition-all"
          style={{
            background: '#3D2817',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 5px 0 #FF8A65',
            fontSize: 17,
          }}
        >
          💛 카톡/메시지로 공유
        </button>

        <button
          onClick={handleCopy}
          className="w-full py-3 text-sm rounded-2xl mb-6"
          style={{
            background: copied ? '#FFEE00' : '#fff',
            color: '#3D2817',
            border: '2px solid #FFCFBA',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
          }}
        >
          {copied ? '✓ 복사됐어요!' : '🔗 평가 링크만 복사'}
        </button>

        {/* 본인 결과 페이지 저장 안내 */}
        <div
          className="p-5 mb-5 rounded-2xl"
          style={{
            background: '#fff',
            border: '2px solid #FFCFBA',
            boxShadow: '0 4px 0 #FFCFBA',
          }}
        >
          <div className="flex items-start gap-3 mb-3">
            <div style={{ fontSize: 20, lineHeight: 1.2 }}>⭐</div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: '#3D2817' }}>
                내 결과 페이지 저장
              </strong>
              <p className="text-xs mt-1" style={{ color: '#7A5A47', lineHeight: 1.5 }}>
                <strong style={{ color: '#3D2817' }}>{nickname}</strong>님 결과 링크예요.<br />
                메모장이나 카톡에 저장하세요.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(resultUrl)
                alert('결과 링크 복사됨!\n메모장이나 카톡에 저장하세요.')
              }}
              className="flex-1 py-3 text-sm rounded-xl"
              style={{
                background: '#3D2817',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              📋 링크 저장
            </button>
            <button
              onClick={() => router.push(`/result/${token}`)}
              className="flex-1 py-3 text-sm rounded-xl"
              style={{
                background: '#FFEE00',
                color: '#3D2817',
                fontFamily: 'var(--font-display)',
                border: '2px solid #3D2817',
                cursor: 'pointer',
              }}
            >
              결과 보기 →
            </button>
          </div>
        </div>

        {/* 링크 미리보기 */}
        <div
          className="p-3 mb-8 text-xs break-all rounded-xl text-center"
          style={{
            border: '1.5px dashed #FFCFBA',
            fontFamily: 'var(--font-mono)',
            background: '#fff',
            color: '#A8826A',
          }}
        >
          {shareUrl}
        </div>
      </div>
    </main>
  )
}
