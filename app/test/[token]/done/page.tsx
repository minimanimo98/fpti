'use client'

import { useRouter } from 'next/navigation'

export default function DonePage() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810', paddingLeft: 16, paddingRight: 16, display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 448, marginLeft: 'auto', marginRight: 'auto', boxSizing: 'border-box', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 48, paddingBottom: 48 }}>

        {/* 로고 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
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

        {/* 완료 카드 */}
        <div style={{
          borderRadius: 20,
          padding: 32,
          textAlign: 'center',
          marginBottom: 16,
          background: '#fff',
          border: '2px solid #2C1810',
          boxShadow: '0 5px 0 #C97D5A',
          boxSizing: 'border-box',
          width: '100%',
        }}>
          {/* 캐릭터 */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ position: 'relative', width: 130, height: 130, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute',
                width: 110, height: 110,
                background: '#FFD96B',
                borderRadius: '50%',
                opacity: 0.35,
              }} />
              <svg width="120" height="120" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
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
            lineHeight: 1.3,
            marginBottom: 12,
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: '#2C1810',
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

          <p style={{ fontSize: 13, lineHeight: 1.6, marginTop: 16, color: '#5A4030' }}>
            솔직하게 답해줘서 고마워요.<br />
            친구의 인성 결과에 반영됩니다.
          </p>
        </div>

        {/* 본인도 받기 */}
        <div style={{
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          background: '#fff',
          border: '1.5px solid #E5D4C0',
          boxSizing: 'border-box',
          width: '100%',
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

        <button
          onClick={() => router.push('/')}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: 15,
            borderRadius: 16,
            background: '#2C1810',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #C97D5A',
            boxSizing: 'border-box',
          }}
        >
          나도 평가받기 →
        </button>
      </div>
    </main>
  )
}
