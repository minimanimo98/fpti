export default function Home() {
  const INK = "#0a0a0a";
  const PAPER = "#ffffff";
  const HIGHLIGHT = "#FFEE00";
  const GRAY = "#888888";

  return (
    <main>
      {/* 상단 바 */}
      <div
        className="flex justify-between px-6 py-5 text-[11px] uppercase tracking-wider"
        style={{ fontFamily: "var(--font-mono)", borderBottom: `2px solid ${INK}` }}
      >
        <div className="font-bold">FPTI.KR</div>
        <div style={{ color: GRAY }}>VOL.01 · 2026</div>
      </div>

      {/* 히어로 */}
      <section className="px-6 pt-10 pb-16">
        <div
          className="text-xs mb-8 pl-2.5 leading-snug"
          style={{ fontFamily: "var(--font-mono)", borderLeft: `3px solid ${HIGHLIGHT}` }}
        >
          FRIEND PERSONALITY TYPE INDICATOR<br />
          NO.001 · SEOUL
        </div>

        <h1
          className="leading-none tracking-tight mb-7"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 11vw, 88px)" }}
        >
          친구들한테<br />
          물어봤습니다.<br />
          <span
            className="px-2.5 inline-block"
            style={{ background: HIGHLIGHT, transform: "rotate(-1.5deg)" }}
          >
            당신 인성
          </span>
          <br />
          몇 점인지.
        </h1>

        <p className="text-base leading-relaxed mb-9 max-w-[480px] font-medium" style={{ color: "#333" }}>
          MBTI는 당신이 보는 당신.<br />
          FPTI는 친구가 보는 당신.<br />
          친구 3명의 답으로 당신의 진짜 인성이 드러납니다.
        </p>

        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <button
            className="px-8 py-[18px] text-lg inline-flex items-center gap-2.5 transition-colors"
            style={{
              background: INK,
              color: PAPER,
              fontFamily: "var(--font-display)",
              border: "none",
              cursor: "pointer",
            }}
          >
            평가받기 시작 →
          </button>
          <span
            className="text-[11px] tracking-wider"
            style={{ color: GRAY, fontFamily: "var(--font-mono)" }}
          >
            2분 · 28문항 · 오락 전용
          </span>
        </div>
      </section>

      {/* 큰 FPTI 마크 */}
      <div
        className="leading-[0.85] tracking-[-0.04em] py-6 overflow-hidden text-center"
        style={{
          fontFamily: "var(--font-archivo)",
          fontSize: "clamp(120px, 38vw, 320px)",
          color: INK,
          borderTop: `2px solid ${INK}`,
          borderBottom: `2px solid ${INK}`,
        }}
      >
        FPTI
      </div>

      {/* 통계 섹션 */}
      <section className="px-6 py-9" style={{ borderBottom: `2px solid ${INK}` }}>
        <div
          className="text-[11px] uppercase tracking-wider mb-6"
          style={{ color: GRAY, fontFamily: "var(--font-mono)" }}
        >
          — By the Numbers
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { num: "12", desc: "성격 유형" },
            { num: "28", desc: "평가 문항" },
            { num: "2분", desc: "완료 시간" },
          ].map((s, i) => (
            <div key={i}>
              <div
                className="leading-none mb-1.5"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 9vw, 56px)" }}
              >
                {s.num}
              </div>
              <div className="text-xs" style={{ color: GRAY }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 어떻게 작동? */}
      <section className="px-6" style={{ paddingTop: "60px", paddingBottom: "60px" }}>
        <div
          className="text-[11px] uppercase tracking-wider mb-4"
          style={{ color: GRAY, fontFamily: "var(--font-mono)" }}
        >
          — How It Works
        </div>
        <h2
          className="leading-none mb-9"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 7vw, 48px)" }}
        >
          어떻게<br />작동하나요?
        </h2>

        {[
          { num: "1", title: "링크 만들기", desc: "닉네임 입력. 30초 만에 내 전용 링크 생성." },
          { num: "2", title: "친구에게 전송", desc: "카톡, DM, 어디든. 친구는 2분 안에 답변." },
          { num: "3", title: "결과 공개", desc: "3명 응답하면 잠금 해제. 12개 유형 중 하나로 판정." },
        ].map((step, i, arr) => (
          <div
            key={i}
            className="py-5 grid gap-4 items-start"
            style={{
              gridTemplateColumns: "56px 1fr",
              borderTop: "1px solid #ddd",
              borderBottom: i === arr.length - 1 ? "1px solid #ddd" : "none",
            }}
          >
            <div
              className="leading-none flex items-center justify-center"
              style={{
                fontFamily: "var(--font-archivo)",
                fontSize: "22px",
                color: INK,
                background: HIGHLIGHT,
                width: "44px",
                height: "44px",
              }}
            >
              {step.num}
            </div>
            <div>
              <h3
                className="text-xl mb-1.5 leading-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#444" }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* 푸터 CTA */}
      <section className="px-6" style={{ background: INK, color: PAPER, paddingTop: "60px", paddingBottom: "28px" }}>
        <h2
          className="leading-tight mb-7"
          style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 7vw, 42px)", color: PAPER }}
        >
          친구들이 뭐라고<br />답할지, 안 궁금해요?
        </h2>
        <button
          className="px-8 py-[18px] text-lg mb-9 transition-transform"
          style={{
            background: HIGHLIGHT,
            color: INK,
            fontFamily: "var(--font-display)",
            border: "none",
            cursor: "pointer",
          }}
        >
          FPTI 시작하기 →
        </button>
        <div
          className="text-[10px] tracking-wider uppercase pt-5 leading-loose"
          style={{
            fontFamily: "var(--font-mono)",
            color: "#888",
            borderTop: "1px solid #333",
          }}
        >
          © 2026 FPTI · 오락 전용<br />
          심리학적 진단이 아닙니다
        </div>
      </section>
    </main>
  );
}