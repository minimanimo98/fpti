import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const REVERSE = [4, 9, 11, 12, 17, 22, 23, 24, 25, 26, 28]

function calc(answers: Record<number, number>[]) {
  const avgPerQ: Record<number, number> = {}
  for (let i = 1; i <= 28; i++) {
    const vals = answers.map(a => a[i]).filter(v => v !== undefined)
    if (vals.length > 0) avgPerQ[i] = vals.reduce((a, b) => a + b, 0) / vals.length
  }
  let raw = 0
  for (let i = 1; i <= 25; i++) {
    const avg = avgPerQ[i] ?? 0
    raw += REVERSE.includes(i) ? -avg : avg
  }
  const score = Math.max(0, Math.min(100, Math.round(((raw + 50) / 100) * 100)))
  const humorAvg = [18,19,20,21].map(i => avgPerQ[i] ?? 0).reduce((a,b)=>a+b,0) / 4
  const selfRaw = [22,23,24,25].map(i => avgPerQ[i] ?? 0).reduce((a,b)=>a+b,0) / 4
  let typeName = ''
  if (score < 15)                              typeName = '순수악'
  else if (humorAvg >= 1.5 && score < 65)     typeName = '허당 귀요미'
  else if (humorAvg >= 1.0 && selfRaw >= 1.0) typeName = '관종 빌런'
  else if (score >= 90) typeName = '성인군자'
  else if (score >= 80) typeName = '걸어다니는 힐링'
  else if (score >= 70) typeName = '다정한 호구'
  else if (score >= 60) typeName = '상식선 인간'
  else if (score >= 50) typeName = '무난무취형'
  else if (score >= 40) typeName = '은근한 빌런'
  else if (score >= 30) typeName = '뒷담화 챔피언'
  else if (score >= 20) typeName = '기분파 폭군'
  else                  typeName = '감정 흡혈귀'
  return typeName
}

async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    }),
  })
}

export async function GET(request: Request) {
  // 크론 인증 (Vercel이 보내는 요청만 통과)
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 한국 시간 기준 어제 0시 ~ 오늘 0시
    const now = new Date()
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
    const today = new Date(Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()))
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    
    // UTC로 변환 (한국 0시 = UTC 전날 15시)
    const startUTC = new Date(yesterday.getTime() - 9 * 60 * 60 * 1000)
    const endUTC = new Date(today.getTime() - 9 * 60 * 60 * 1000)
    
    const yesterdayDate = `${yesterday.getUTCMonth() + 1}월 ${yesterday.getUTCDate()}일`

    // 어제 신규 사용자
    const { count: newUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startUTC.toISOString())
      .lt('created_at', endUTC.toISOString())

    // 어제 새 응답
    const { count: newResponses } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startUTC.toISOString())
      .lt('created_at', endUTC.toISOString())

    // 누적 데이터
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: totalResponses } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })

    // 어제 결과 나온 사용자들 (응답 2개 이상)
    const { data: usersWithResponses } = await supabase
      .from('users')
      .select(`
        id, nickname,
        responses!inner(answers, created_at)
      `)
    
    // 어제 결과가 처음 2개째 도달한 케이스 = 완성된 결과
    const yesterdayCompletedTypes: string[] = []
    let completedCount = 0
    
    if (usersWithResponses) {
      for (const user of usersWithResponses) {
        const responses = (user as any).responses
        if (responses && responses.length >= 2) {
          // 2번째 응답이 어제인지 확인
          const sortedResponses = responses.sort((a: any, b: any) => 
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
          const secondResponse = sortedResponses[1]
          const secondTime = new Date(secondResponse.created_at)
          
          if (secondTime >= startUTC && secondTime < endUTC) {
            completedCount++
            const typeName = calc(responses.map((r: any) => r.answers))
            yesterdayCompletedTypes.push(typeName)
          }
        }
      }
    }

    // 인기 유형 TOP 3
    const typeCount: Record<string, number> = {}
    yesterdayCompletedTypes.forEach(t => {
      typeCount[t] = (typeCount[t] || 0) + 1
    })
    const topTypes = Object.entries(typeCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    // 메시지 작성
    let message = `📊 <b>어제의 FPTI (${yesterdayDate})</b>\n\n`
    message += `🎉 신규 사용자: <b>${newUsers || 0}명</b>\n`
    message += `📝 새 응답: <b>${newResponses || 0}개</b>\n`
    message += `✅ 완료된 결과: <b>${completedCount}개</b>\n\n`

    if (topTypes.length > 0) {
      message += `🏆 <b>인기 유형 TOP ${topTypes.length}</b>\n`
      topTypes.forEach((t, i) => {
        const medal = ['🥇', '🥈', '🥉'][i]
        message += `${medal} ${t[0]} (${t[1]}명)\n`
      })
      message += `\n`
    }

    message += `📈 <b>누적</b>\n`
    message += `총 사용자: <b>${totalUsers || 0}명</b>\n`
    message += `총 응답: <b>${totalResponses || 0}개</b>\n`

    if (newUsers === 0 && newResponses === 0) {
      message += `\n💪 오늘 시딩 한 번 더 어때요?`
    } else if ((newUsers || 0) >= 10) {
      message += `\n🔥 어제 잘 나갔어요! 시딩 효과 좋네요`
    }

    await sendTelegram(message)

    return NextResponse.json({ ok: true, newUsers, newResponses, completedCount, topTypes })
  } catch (e) {
    console.error('Daily report error:', e)
    await sendTelegram(`❌ 일별 리포트 생성 실패: ${(e as Error).message}`)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
