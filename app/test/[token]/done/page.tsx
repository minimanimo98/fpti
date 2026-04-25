'use client'

import { useParams, useRouter } from 'next/navigation'

export default function DonePage() {
  const { token } = useParams()
  const router = useRouter()

  return (
    <main className="min-h-screen flex flex-col" style={{ background: '#FFE4D9', color: '#3D2817' }}>
      <div className="max-w-[480px] mx-auto px-6 flex-1 flex flex-col justify-center py-12">
        {/* 로고 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#FFEE00', boxShadow: '0 3px 0 #3D2817' }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#3D2817' }}>F</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>FPTI</span>
          </div>
        </div>

        {/* 완료 카드 */}
        <div
          className="rounded-2xl p-8 text-center mb-6"
          style={{
            background: '#fff',
            border: '2.5px solid #3D2817',
            boxShadow: '0 6px 0 #FF8A65',
          }}
        >
          {/* 캐릭터 */}
          <div className="flex justify-center mb-5">
            <div
              style={{
                position: 'relative',
                width: 130,
                height: 130,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{
                position: 'absolute',
                width: 110, height: 110,
                background: 'radial-gradient(circle, #FFEE00 0%, #FFD700 100%)',
                borderRadius: '50%',
                opacity: 0.4,
              }} />
              <svg width="120" height="120" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
                <ellipse cx="72" cy="128" rx="50" ry="6" fill="rgba(0,0,0,0.08)" />
                <circle cx="70" cy="65" r="55" fill="#FFEE00" stroke="#3D2817" strokeWidth="3.5" />
                <circle cx="42" cy="78" r="4" fill="#FF8A65" opacity="0.6" />
                <circle cx="98" cy="78" r="4" fill="#FF8A65" opacity="0.6" />
                <path d="M 42 58 Q 50 50 58 58" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 82 58 Q 90 50 98 58" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                <path d="M 55 82 Q 70 95 85 82" stroke="#3D2817" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <h1
            className="leading-tight mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: '#3D2817' }}
          >
            답변이<br />
            <span
              style={{
                display: 'inline-block',
                background: 'linear-gradient(180deg, transparent 60%, #FFEE00 60%)',
                padding: '0 4px',
              }}
            >
              전달됐어요!
            </span>
          </h1>

          <p className="text-sm leading-relaxed mt-4" style={{ color: '#5A4030' }}>
            솔직하게 답해줘서 고마워요.<br />
            친구의 인성 결과에 반영됩니다.
          </p>
        </div>

        {/* 본인도 받기 안내 */}
        <div
          className="rounded-2xl p-5 mb-3"
          style={{
            background: '#fff',
            border: '2px solid #FFCFBA',
            boxShadow: '0 4px 0 #FFCFBA',
          }}
        >
          <div className="flex items-start gap-3">
            <div style={{ fontSize: 22 }}>💡</div>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: '#3D2817' }}>
                나도 받아볼까?
              </strong>
              <p className="text-xs mt-1" style={{ color: '#7A5A47', lineHeight: 1.5 }}>
                내 친구들은 나를 어떻게 볼까요?<br />
                2분이면 결과 받을 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full py-4 text-base rounded-2xl"
          style={{
            background: '#3D2817',
            color: '#fff',
            fontFamily: 'var(--font-display)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #FF8A65',
          }}
        >
          나도 평가받기 →
        </button>
      </div>
    </main>
  )
}
