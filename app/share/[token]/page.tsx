'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function SharePage() {
  const { token } = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [responseCount, setResponseCount] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const testUrl = 'https://fpti.kr/test/' + token
  const resultUrl = 'https://fpti.kr/result/' + token

  useEffect(() => {
    if (!token) return
    const fetchData = () => {
      fetch('/api/get-result?token=' + token).then(r => r.json()).then(d => {
        setUser({ nickname: d.nickname })
        setResponseCount(d.count || 0)
        setLoading(false)
      })
    }
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [token])

  const shareMessage = '나 ' + (user?.nickname || '내') + ' 인성 평가 좀 해줘 🥺\n친구가 답해주는 인성테스트야 (2분컷)\n\n👉 ' + testUrl

  const handleKakaoShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FPTI - 친구가 답하는 인성 테스트',
        text: shareMessage,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(shareMessage)
      setCopied('full')
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(testUrl)
    setCopied('link')
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyResultLink = () => {
    navigator.clipboard.writeText(resultUrl)
    setCopied('result')
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#9B8268', fontSize: 13 }}>준비 중...</p>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810', paddingLeft: 16, paddingRight: 16, paddingBottom: 32 }}>
      <div style={{ maxWidth: 448, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' }}>

        <header style={{ paddingTop: 20, paddingBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: '#2C1810', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontSize: 14,
            }}>F</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>FPTI</span>
          </div>
          <button onClick={() => router.push('/')} style={{
            fontSize: 12, padding: '6px 12px', borderRadius: 999,
            color: '#6B5544', background: '#fff', border: '1.5px solid #E5D4C0', cursor: 'pointer',
          }}>처음으로</button>
        </header>

        {/* 진행 상태 */}
        <div style={{
          background: responseCount >= 2 ? '#FFD96B' : '#FFF8EE',
          borderRadius: 16,
          padding: 16,
          border: '2px solid #2C1810',
          boxShadow: '0 4px 0 #C97D5A',
          boxSizing: 'border-box',
          width: '100%',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, color: '#9B8268', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
              {responseCount >= 2 ? '✅ 결과 준비 완료!' : '응답 수집 중'}
            </div>
            <div style={{ fontSize: 13, color: '#2C1810', fontFamily: 'var(--font-display)' }}>
              {responseCount === 0 && '아직 답변한 친구가 없어요'}
              {responseCount === 1 && '1명이 답했어요 · 1명만 더!'}
              {responseCount >= 2 && '결과 보러 가세요'}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#2C1810' }}>
            {responseCount}<span style={{ fontSize: 16, color: '#9B8268' }}>명</span>
          </div>
        </div>

        {/* 결과 보기 (응답 2명 이상일 때만) */}
        {responseCount >= 2 && (
          <button
            onClick={() => router.push('/result/' + token)}
            style={{
              width: '100%', padding: 16, fontSize: 15, borderRadius: 16,
              background: '#FFD96B', color: '#2C1810',
              fontFamily: 'var(--font-display)',
              border: '2.5px solid #2C1810',
              boxShadow: '0 5px 0 #C97D5A',
              cursor: 'pointer', boxSizing: 'border-box',
              marginBottom: 20,
            }}
          >
            🎉 내 결과 보러가기
          </button>
        )}

        {/* 핵심 안내 */}
        <div style={{
          background: '#2C1810',
          borderRadius: 20,
          padding: '20px 18px',
          boxSizing: 'border-box',
          width: '100%',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📨</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            color: '#FFD96B',
            marginBottom: 8,
            lineHeight: 1.3,
          }}>
            지금 친구한테<br />
            <span style={{ color: '#fff' }}>카톡으로 보내주세요!</span>
          </h2>
          <p style={{ fontSize: 12, color: '#E5D4C0', lineHeight: 1.6 }}>
            친구가 답해야 결과가 나와요.<br />
            본인이 푸는 게 아니에요.
          </p>
        </div>

        {/* 메시지 미리보기 */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 16,
          border: '1.5px solid #E5D4C0',
          boxSizing: 'border-box',
          width: '100%',
          marginBottom: 12,
        }}>
          <div style={{
            fontSize: 11,
            color: '#9B8268',
            fontFamily: 'var(--font-mono)',
            marginBottom: 8,
          }}>
            친구한테 보낼 메시지 미리보기
          </div>
          <div style={{
            background: '#F5E6D8',
            padding: 12,
            borderRadius: 12,
            fontSize: 13,
            color: '#2C1810',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
          }}>
            {shareMessage}
          </div>
        </div>

        {/* 메인 공유 버튼 */}
        <button
          onClick={handleKakaoShare}
          style={{
            width: '100%', padding: 18, fontSize: 16, borderRadius: 16,
            background: '#FEE500', color: '#2C1810',
            fontFamily: 'var(--font-display)',
            border: '2.5px solid #2C1810',
            boxShadow: '0 5px 0 #C97D5A',
            cursor: 'pointer', boxSizing: 'border-box',
            marginBottom: 10,
            fontWeight: 700,
          }}
        >
          💬 카톡으로 친구에게 보내기
        </button>

        {/* 보조 버튼 */}
        <button
          onClick={handleCopyLink}
          style={{
            width: '100%', padding: 14, fontSize: 13, borderRadius: 14,
            background: copied === 'link' ? '#2C1810' : '#fff',
            color: copied === 'link' ? '#fff' : '#2C1810',
            fontFamily: 'var(--font-display)',
            border: '1.5px solid ' + (copied === 'link' ? '#2C1810' : '#E5D4C0'),
            cursor: 'pointer', boxSizing: 'border-box',
            marginBottom: 24,
          }}
        >
          {copied === 'link' ? '✓ 링크 복사됨' : '🔗 평가 링크만 복사'}
        </button>

        {/* 팁 */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 16,
          border: '1.5px dashed #C97D5A',
          boxSizing: 'border-box',
          width: '100%',
          marginBottom: 20,
        }}>
          <div style={{
            fontSize: 12,
            fontFamily: 'var(--font-display)',
            color: '#2C1810',
            marginBottom: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            💡 더 정확한 결과를 받으려면
          </div>
          <div style={{ fontSize: 12, color: '#5A4030', lineHeight: 1.7 }}>
            • <strong>2명 이상</strong>이 답해야 결과가 공개돼요<br />
            • <strong>5명 이상</strong>이 답하면 정확도 100%<br />
            • 친한 친구일수록 솔직한 결과 나와요
          </div>
        </div>

        {/* 결과 링크 저장 (작게) */}
        <div style={{
          background: '#fff',
          borderRadius: 12,
          padding: 14,
          border: '1px solid #E5D4C0',
          boxSizing: 'border-box',
          width: '100%',
          marginBottom: 16,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 11,
                color: '#9B8268',
                fontFamily: 'var(--font-mono)',
                marginBottom: 2,
              }}>
                내 결과 페이지 (나만 볼 수 있어요)
              </div>
              <div style={{
                fontSize: 11,
                color: '#5A4030',
                fontFamily: 'var(--font-mono)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {resultUrl}
              </div>
            </div>
            <button
              onClick={handleCopyResultLink}
              style={{
                flexShrink: 0,
                fontSize: 11,
                padding: '8px 12px',
                borderRadius: 10,
                background: copied === 'result' ? '#2C1810' : '#F5E6D8',
                color: copied === 'result' ? '#fff' : '#2C1810',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {copied === 'result' ? '✓' : '복사'}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
