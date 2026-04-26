import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  
  if (!token || !chatId) return
  
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })
  } catch (e) {
    console.error('Telegram notification failed:', e)
  }
}

export async function POST(request: Request) {
  try {
    const { token, answers } = await request.json()

    if (!token || !answers) {
      return NextResponse.json({ error: '필수 정보 누락' }, { status: 400 })
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, nickname')
      .eq('share_token', token)
      .single()

    if (userError || !user) {
      return NextResponse.json({ error: '없는 링크' }, { status: 404 })
    }

    const { error: insertError } = await supabase
      .from('responses')
      .insert([{ user_id: user.id, answers }])

    if (insertError) {
      console.error('Insert error:', insertError)
      return NextResponse.json({ error: '저장 실패' }, { status: 500 })
    }

    // 응답 횟수 카운트
    const { count } = await supabase
      .from('responses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    // 텔레그램 알림
    sendTelegramNotification(
      `📝 <b>응답 도착!</b>\n\n` +
      `대상: <b>${user.nickname}</b>\n` +
      `현재 응답 수: <b>${count}명</b>\n` +
      `시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json({ error: '오류 발생' }, { status: 500 })
  }
}
