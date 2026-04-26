'use client'

import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <main style={{ minHeight: '100vh', background: '#F5E6D8', color: '#2C1810', paddingLeft: 16, paddingRight: 16, paddingBottom: 48 }}>
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

        <div style={{
          background: '#FFF8EE',
          borderRadius: 20,
          padding: '24px 20px',
          border: '2px solid #2C1810',
          boxShadow: '0 4px 0 #C97D5A',
          boxSizing: 'border-box',
          width: '100%',
          marginTop: 16,
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            color: '#2C1810',
            marginBottom: 8,
            lineHeight: 1.3,
          }}>
            개인정보 처리방침
          </h1>
          <p style={{ fontSize: 11, color: '#9B8268', marginBottom: 20, fontFamily: 'var(--font-mono)' }}>
            최종 업데이트: 2026년 4월 26일
          </p>

          <Section title="1. 수집하는 개인정보">
            FPTI(이하 "서비스")는 다음의 정보를 수집합니다:
            <br /><br />
            • 닉네임 (사용자가 직접 입력)<br />
            • 28문항에 대한 응답 데이터<br />
            • 결과 페이지 접속 시점의 익명 토큰
            <br /><br />
            서비스는 사용자의 실명, 연락처, 이메일, 주민번호 등 개인을 식별할 수 있는 정보를 일체 수집하지 않습니다.
          </Section>

          <Section title="2. 수집 목적">
            • 인성 테스트 결과 산출 및 제공<br />
            • 친구들의 평가 데이터 집계<br />
            • 서비스 품질 개선
          </Section>

          <Section title="3. 보관 기간">
            수집된 닉네임 및 응답 데이터는 사용자가 직접 삭제 요청을 하기 전까지 보관됩니다. 삭제 요청은 fpti.kr 운영자에게 직접 문의해주세요.
          </Section>

          <Section title="4. 제3자 제공">
            서비스는 수집한 정보를 제3자에게 제공하거나 판매하지 않습니다. 단, 법령에 따라 수사기관의 요청이 있는 경우 예외로 합니다.
          </Section>

          <Section title="5. 데이터 처리 위탁">
            서비스는 데이터 저장을 위해 다음 업체의 서비스를 이용합니다:<br /><br />
            • Supabase (데이터베이스)<br />
            • Vercel (호스팅)
          </Section>

          <Section title="6. 만 14세 미만 이용 제한">
            서비스는 만 14세 미만 이용자의 개인정보를 수집하지 않습니다. 만 14세 미만은 본 서비스를 이용할 수 없습니다.
          </Section>

          <Section title="7. 사용자 권리">
            사용자는 언제든지 본인의 데이터 조회, 수정, 삭제를 요청할 수 있습니다. 운영자에게 직접 문의해주세요.
          </Section>

          <Section title="8. 쿠키 및 로컬 스토리지">
            서비스는 사용자 편의를 위해 브라우저의 localStorage를 사용합니다:<br /><br />
            • 사용자 본인의 결과 토큰 저장 (재방문 시 결과 페이지 접근)<br />
            • 답변 완료 기록 (중복 답변 방지)
            <br /><br />
            이 정보는 사용자 기기에만 저장되며 서버로 전송되지 않습니다.
          </Section>

          <Section title="9. 문의처">
            개인정보 관련 문의는 GitHub 저장소의 Issues를 통해 가능합니다.<br />
            github.com/minimanimo98/fpti
          </Section>

          <Section title="10. 정책 변경">
            본 처리방침은 법령 또는 서비스 정책에 따라 변경될 수 있으며, 변경 시 본 페이지를 통해 공지합니다.
          </Section>
        </div>

        <button onClick={() => router.push('/')} style={{
          width: '100%', padding: 14, fontSize: 14, borderRadius: 16,
          background: '#2C1810', color: '#fff',
          fontFamily: 'var(--font-display)', border: 'none',
          cursor: 'pointer', boxShadow: '0 4px 0 #C97D5A',
          boxSizing: 'border-box', marginTop: 24,
        }}>
          처음으로 돌아가기
        </button>
      </div>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        color: '#2C1810',
        marginBottom: 8,
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: 13,
        lineHeight: 1.7,
        color: '#5A4030',
        margin: 0,
      }}>
        {children}
      </p>
    </div>
  )
}
