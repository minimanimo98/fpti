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
        await navigator.share({ title: 'FPTI - 내 인성 평가해줘', text: shareText, url: shareUrl })
      } catch (err) {
        if ((err as Error).name !== 'AbortError') handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810', paddingLeft: 16, paddingRight: 16 }}>
      <div style={{ maxWidth: 448, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' }}>

        {/* 헤더 */}
        <header style={{ paddingTop: 20, paddingBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#2C1810', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 14,
            }}>F</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: '#2C1810' }}>FPTI</span>
          </div>
          <button onClick={() => router.push('/')}
            style={{ fontSize: 12, padding: '6px 12px', borderRadius: 999, color: '#6B5544', background: '#fff', border: '1.5px solid #E5D4C0', cursor: 'pointer' }}>
            처음으로
          </button>
        </header>

        {/* 응답 카운터 */}
        <div style={{
          padding: 16,
          marginBottom: 16,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#fff',
          border: '2px solid #2C1810',
          boxShadow: '0 4px 0 #C97D5A',
          boxSizing: 'border-box',
          width: '100%',
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11, color: '#9B8268', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
              {count >= 3 ? '결과 공개됨' : count > 0 ? '응답 진행 중' : '응답 대기 중'}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#2C1810' }}>
              {count >= 3 ? '잠시 후 결과로 이동' : count > 0 ? `${3 - count}명 더 답하면 정확도 ↑` : '한 명만 답해도 임시 결과'}
            </div>
          </div>
          <div style={{ flexShrink: 0, marginLeft: 12, fontFamily: 'var(--font-display)', fontSize: 32, color: '#2C1810', lineHeight: 1 }}>
            {count}<span style={{ fontSize: 16, color: '#9B8268' }}>/3</span>
          </div>
        </div>

        {/* 메인 안내 */}
        <h1 style={{
          lineHeight: 1.2,
          marginBottom: 8,
          textAlign: 'center',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(26px, 7vw, 36px)',
          color: '#2C1810',
          paddingTop: 16,
        }}>
          친구에게<br />
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(180deg, transparent 65%, #FFD96B 65%)',
            padding: '0 4px',
          }}>
            평가받기
          </span>
        </h1>

        <p style={{ fontSize: 13, textAlign: 'center', marginBottom: 24, color: '#5A4030' }}>
          친구가 답하면 점수가 집계됩니다
        </p>

        {/* 메인 공유 버튼 */}
        <button onClick={handleShare}
          style={{
            width: '100%',
            padding: '18px',
            fontSize: 16,
            borderRadius: 16,
            marginBottom: 10,
            background: '#2C1810',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 5px 0 #C97D5A',
            boxSizing: 'border-box',
          }}>
          💛 카톡/메시지로 공유
        </button>

        <button onClick={handleCopy}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: 13,
            borderRadius: 16,
            marginBottom: 24,
            background: copied ? '#FFD96B' : '#fff',
            color: '#2C1810',
            border: '2px solid #E5D4C0',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}>
          {copied ? '✓ 복사됐어요' : '🔗 평가 링크만 복사'}
        </button>

        {/* 본인 결과 링크 저장 */}
        <div style={{
          padding: 16,
          marginBottom: 16,
          borderRadius: 16,
          background: '#fff',
          border: '1.5px solid #E5D4C0',
          boxSizing: 'border-box',
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 18, lineHeight: 1.2, flexShrink: 0 }}>⭐</div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#2C1810' }}>
                내 결과 페이지 저장
              </strong>
              <p style={{ fontSize: 11, marginTop: 4, color: '#7A5A47', lineHeight: 1.5 }}>
                <strong style={{ color: '#2C1810' }}>{nickname}</strong>님 결과 링크예요.<br />
                메모장이나 카톡에 저장하세요.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => {
              navigator.clipboard.writeText(resultUrl)
              alert('결과 링크 복사됨!\n메모장이나 카톡에 저장하세요.')
            }} style={{
              flex: 1,
              padding: '12px',
              fontSize: 13,
              borderRadius: 12,
              background: '#2C1810',
              color: '#fff',
              fontFamily: 'var(--font-display)',
              border: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}>
              📋 링크 저장
            </button>
            <button onClick={() => router.push(`/result/${token}`)}
              style={{
                flex: 1,
                padding: '12px',
                fontSize: 13,
                borderRadius: 12,
                background: '#fff',
                color: '#2C1810',
                fontFamily: 'var(--font-display)',
                border: '2px solid #2C1810',
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}>
              결과 보기 →
            </button>
          </div>
        </div>

        {/* 링크 미리보기 */}
        <div style={{
          padding: 12,
          marginBottom: 32,
          fontSize: 11,
          wordBreak: 'break-all',
          borderRadius: 12,
          textAlign: 'center',
          border: '1.5px dashed #E5D4C0',
          fontFamily: 'var(--font-mono)',
          background: '#fff',
          color: '#9B8268',
          boxSizing: 'border-box',
        }}>
          {shareUrl}
        </div>
      </div>
    </main>
  )
}
