'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SharePage() {
  const { token } = useParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [count, setCount] = useState(0)
  const [nickname, setNickname] = useState('친구')
  const [showShareModal, setShowShareModal] = useState(false)
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
    }
    fetchCount()
    const interval = setInterval(fetchCount, 5000)
    return () => clearInterval(interval)
  }, [token])

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 디바이스 감지
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)

  // 메인 공유 버튼
  const handleShare = async () => {
    const shareText = `내 인성 평가해줘 🥺\n\n👉 ${shareUrl}`

    // 1. 모바일이면 Web Share API 시도
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: 'FPTI - 내 인성 평가해줘',
          text: shareText,
          url: shareUrl,
        })
        return
      } catch (err) {
        // 사용자가 취소했거나 미지원
        if ((err as Error).name === 'AbortError') return
      }
    }

    // 2. 안 되면 공유 모달 표시
    setShowShareModal(true)
  }

  // 카카오톡 직접 열기 (모바일)
  const openKakaoTalk = () => {
    const text = `내 인성 평가해줘 🥺\n\n${shareUrl}`
    navigator.clipboard.writeText(text)
    
    if (isIOS) {
      // iOS: 카톡 앱 열기
      window.location.href = 'kakaotalk://'
    } else {
      // Android: 카톡 인텐트
      window.location.href = 'intent://send?msg=' + encodeURIComponent(text) + '#Intent;scheme=kakaolink;package=com.kakao.talk;end'
    }
    
    setTimeout(() => {
      alert('링크가 복사됐어요!\n카톡에 붙여넣기 하세요.')
    }, 1000)
    
    setShowShareModal(false)
  }

  // 문자 메시지 열기
  const openSMS = () => {
    const text = `내 인성 평가해줘 🥺\n\n${shareUrl}`
    window.location.href = `sms:?body=${encodeURIComponent(text)}`
    setShowShareModal(false)
  }

  // 그냥 링크 복사
  const copyLink = () => {
    const text = `내 인성 평가해줘 🥺\n\n${shareUrl}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setShowShareModal(false)
  }

  const getStatusMessage = () => {
    if (count === 0) return { title: '응답 대기 중', sub: '한 명만 답해도 임시 결과를 볼 수 있어요' }
    if (count < 3) return { title: '응답 진행 중', sub: `${3 - count}명만 더 답하면 정확도가 올라가요` }
    if (count < 5) return { title: '결과 공개됨', sub: `${5 - count}명만 더 답하면 정확도 100%` }
    return { title: '결과 공개됨', sub: '높은 정확도로 결과가 나왔어요' }
  }
  const status = getStatusMessage()

  return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810', paddingLeft: 16, paddingRight: 16 }}>
      <div style={{ maxWidth: 448, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box' }}>

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
              {status.title}
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#2C1810' }}>
              {status.sub}
            </div>
          </div>
          <div style={{ flexShrink: 0, marginLeft: 12, textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: '#9B8268', fontFamily: 'var(--font-mono)', marginBottom: 2 }}>
              총 응답
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#2C1810', lineHeight: 1 }}>
              {count}<span style={{ fontSize: 14, color: '#9B8268', marginLeft: 2 }}>명</span>
            </div>
          </div>
        </div>

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
          📤 친구에게 공유하기
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

        {count > 0 && (
          <button onClick={() => router.push(`/result/${token}`)}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: 14,
              borderRadius: 16,
              marginBottom: 24,
              background: '#FFD96B',
              color: '#2C1810',
              border: '2px solid #2C1810',
              fontFamily: 'var(--font-display)',
              cursor: 'pointer',
              boxShadow: '0 3px 0 #2C1810',
              boxSizing: 'border-box',
            }}>
            👀 지금까지 결과 보기
          </button>
        )}

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
          <button onClick={() => {
            navigator.clipboard.writeText(resultUrl)
            alert('결과 링크 복사됨!\n메모장이나 카톡에 저장하세요.')
          }} style={{
            width: '100%',
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
            📋 결과 링크 저장
          </button>
        </div>

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

      {/* 공유 모달 */}
      {showShareModal && (
        <div
          onClick={() => setShowShareModal(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFF8EE',
              borderRadius: '24px 24px 0 0',
              padding: 24,
              width: '100%',
              maxWidth: 480,
              boxSizing: 'border-box',
            }}
          >
            <div style={{
              width: 40, height: 4, background: '#E5D4C0',
              borderRadius: 2, margin: '0 auto 20px',
            }} />

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, color: '#2C1810',
              textAlign: 'center', marginBottom: 4,
            }}>
              어떻게 공유할까요?
            </h3>
            <p style={{ fontSize: 12, color: '#9B8268', textAlign: 'center', marginBottom: 20 }}>
              친구에게 평가 링크를 보내주세요
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {isMobile && (
                <>
                  <button onClick={openKakaoTalk} style={{
                    width: '100%', padding: 16, fontSize: 14,
                    borderRadius: 14,
                    background: '#FEE500', color: '#2C1810',
                    fontFamily: 'var(--font-display)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxSizing: 'border-box',
                  }}>
                    <span style={{ fontSize: 18 }}>💬</span>
                    카카오톡으로 보내기
                  </button>

                  <button onClick={openSMS} style={{
                    width: '100%', padding: 16, fontSize: 14,
                    borderRadius: 14,
                    background: '#fff', color: '#2C1810',
                    fontFamily: 'var(--font-display)',
                    border: '2px solid #E5D4C0', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    boxSizing: 'border-box',
                  }}>
                    <span style={{ fontSize: 18 }}>📱</span>
                    문자로 보내기
                  </button>
                </>
              )}

              <button onClick={copyLink} style={{
                width: '100%', padding: 16, fontSize: 14,
                borderRadius: 14,
                background: '#2C1810', color: '#fff',
                fontFamily: 'var(--font-display)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxSizing: 'border-box',
              }}>
                <span style={{ fontSize: 18 }}>🔗</span>
                링크 복사하기
              </button>

              <button onClick={() => setShowShareModal(false)} style={{
                width: '100%', padding: 12, fontSize: 13,
                borderRadius: 14, marginTop: 8,
                background: 'transparent', color: '#9B8268',
                fontFamily: 'var(--font-mono)',
                border: 'none', cursor: 'pointer',
                boxSizing: 'border-box',
              }}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
