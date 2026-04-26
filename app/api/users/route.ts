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
    // 알림 실패해도 메인 흐름은 정상 진행
    console.error('Telegram notification failed:', e)
  }
}

export async function POST(request: Request) {
  try {
    const { nickname } = await request.json()

    if (!nickname || nickname.trim().length === 0) {
      return NextResponse.json({ error: '닉네임을 입력해주세요' }, { status: 400 })
    }

    // 토큰 생성 (8자)
    const token = Math.random().toString(36).substring(2, 10)

    const { data, error } = await supabase
      .from('users')
      .insert([{ nickname: nickname.trim(), share_token: token }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: '사용자 생성 실패' }, { status: 500 })
    }

    // 누적 사용자 수 조회
    const { count } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // 텔레그램 알림 발송 (백그라운드)
    sendTelegramNotification(
      `🎉 <b>새 사용자!</b>\n\n` +
      `닉네임: <b>${nickname.trim()}</b>\n` +
      `누적: <b>${count || '?'}명</b>\n` +
      `시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}\n\n` +
      `🔗 https://fpti.kr/share/${token}`
    )

    return NextResponse.json({ token: data.share_token })
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json({ error: '오류가 발생했습니다' }, { status: 500 })
  }
}
