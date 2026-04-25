'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function DonePage() {
  const { token } = useParams()
  const router = useRouter()
  const [nickname, setNickname] = useState('친구')
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/get-result?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.nickname) setNickname(d.nickname)
      })
      .catch(() => {})
  }, [token])

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isIOS = typeof window !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isKakaoInApp = typeof window !== 'undefined' && /KAKAOTALK/i.test(navigator.userAgent)

  const resultUrl = `https://fpti.kr/result/${token}`
  const shareText = `${nickname}야! 너 인성테스트 답변 완료했어 ✅\n\n결과 확인해봐 👉 ${resultUrl}`

  // 메인 알림 버튼
  const handleNotify = async () => {
    // 카카오 인앱이면 외부 브라우저 안내
    if (isKakaoInApp) {
      alert('카카오톡 안에서는 공유가 안 돼요.\n오른쪽 위 메뉴 → "다른 브라우저로 열기"를 눌러주세요.')
      return
    }

    // 모바일 + Web Share API 가능하면 시스템 공유창
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: 'FPTI - 답변 완료',
          text: shareText,
          url: resultUrl,
        })
        return
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
      }
    }

    // 안 되면 자체 모달
    setShowShareModal(true)
  }

  // 카톡 직접 열기
  const openKakaoTalk = () => {
    navigator.clipboard.writeText(shareText)
    
    if (isIOS) {
      window.location.href = 'kakaotalk://'
    } else {
      window.location.href = 'intent://launch#Intent;scheme=kakaolink;package=com.kakao.talk;end'
    }
    
    setTimeout(() => {
      alert('메시지가 복사됐어요!\n카톡에서 친구한테 붙여넣기 하세요.')
    }, 500)
    
    setShowShareModal(false)
  }

  const openSMS = () => {
    window.location.href = `sms:?body=${encodeURIComponent(shareText)}`
    setShowShareModal(false)
  }

  const copyMessage = () => {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setShowShareModal(false)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810', paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column' }}>
      <div style={{
        maxWidth: 448, marginLeft: 'auto', marginRight: 'auto',
        boxSizing: 'border-box', flex: 1,
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
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute',
                width: 100, height: 100,
                background: '#FFD96B',
                borderRadius: '50%',
                opacity: 0.35,
              }} />
              <svg width="110" height="110" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
                <ellipse cx="72" cy="128" rx="50" ry="6" fill="rgba(0,0,0,0.08)" />
                <circle cx="70" cy="65" r="55" fill="#FFD96B" stroke="#2C1810" strokeWidth="3.5" />
                <circle cx="42" cy="78" r="4" fill="#E89B7A" opacity="0.7" />
                <circle cx="98" cy="78" r="4" fill="#E89B7A" opacity="0.7" />
                <path d="M 42 58 Q 50 50 58 58" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 82 58 Q 90 50 98 58" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 55 82 Q 70 95 85 82" stroke="#2C1810" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <h1 style={{
            lineHeight: 1.3, marginBottom: 12,
            fontFamily: 'var(--font-display)', fontSize: 26, color: '#2C1810',
          }}>
            답변이<br />
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(180deg, transparent 65%, #FFD96B 65%)',
              padding: '0 4px',
            }}>
              전달됐어요
            </span>
          </h1>

          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12, color: '#5A4030' }}>
            솔직하게 답해줘서 고마워요.<br />
            <strong style={{ color: '#2C1810' }}>{nickname}</strong>의 인성 결과에 반영됩니다.
          </p>
        </div>

        {/* 카카오 인앱 안내 */}
        {isKakaoInApp && (
          <div style={{
            borderRadius: 12, padding: 12, marginBottom: 12,
            background: '#FFF1E6', border: '1.5px solid #C97D5A',
            boxSizing: 'border-box', width: '100%',
          }}>
            <p style={{ fontSize: 11, color: '#5A4030', lineHeight: 1.5, textAlign: 'center' }}>
              💡 카톡 안에서는 공유가 제한됩니다.<br />
              우상단 메뉴 → "다른 브라우저로 열기"를 눌러주세요.
            </p>
          </div>
        )}

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 12,
          background: '#FFF8EE', border: '2px solid #C97D5A',
          boxSizing: 'border-box', width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 22, flexShrink: 0 }}>📨</div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#2C1810' }}>
                {nickname}한테 알려주기
              </strong>
              <p style={{ fontSize: 11, marginTop: 4, color: '#7A5A47', lineHeight: 1.5 }}>
                답변 완료했다고 알려주면<br />
                {nickname}이 결과를 더 빨리 봐요.
              </p>
            </div>
          </div>

          <button onClick={handleNotify} style={{
            width: '100%', padding: 14, fontSize: 14, borderRadius: 12,
            background: '#2C1810', color: '#fff',
            fontFamily: 'var(--font-display)', border: 'none',
            cursor: 'pointer', boxSizing: 'border-box',
          }}>
            💬 {nickname}한테 알리기
          </button>
        </div>

        <div style={{
          borderRadius: 16, padding: 16, marginBottom: 12,
          background: '#fff', border: '1.5px solid #E5D4C0',
          boxSizing: 'border-box', width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ fontSize: 20, flexShrink: 0 }}>💡</div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: '#2C1810' }}>
                나도 받아볼까?
              </strong>
              <p style={{ fontSize: 11, marginTop: 4, color: '#7A5A47', lineHeight: 1.5 }}>
                내 친구들은 나를 어떻게 볼까요?<br />
                2분이면 결과 받을 수 있어요.
              </p>
            </div>
          </div>
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
      </div>

      {/* 공유 모달 */}
      {showShareModal && (
        <div onClick={() => setShowShareModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: '#FFF8EE',
            borderRadius: '24px 24px 0 0',
            padding: 24, width: '100%', maxWidth: 480,
            boxSizing: 'border-box',
          }}>
            <div style={{
              width: 40, height: 4, background: '#E5D4C0',
              borderRadius: 2, margin: '0 auto 20px',
            }} />

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18, color: '#2C1810',
              textAlign: 'center', marginBottom: 4,
            }}>
              어떻게 알릴까요?
            </h3>
            <p style={{ fontSize: 12, color: '#9B8268', textAlign: 'center', marginBottom: 20 }}>
              {nickname}한테 답변 완료를 알려주세요
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
                    카카오톡 열기
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
                    문자 메시지
                  </button>
                </>
              )}

              <button onClick={copyMessage} style={{
                width: '100%', padding: 16, fontSize: 14,
                borderRadius: 14,
                background: copied ? '#FFD96B' : '#2C1810',
                color: copied ? '#2C1810' : '#fff',
                fontFamily: 'var(--font-display)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                boxSizing: 'border-box',
              }}>
                <span style={{ fontSize: 18 }}>📋</span>
                {copied ? '✓ 복사됨' : '메시지 복사하기'}
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
