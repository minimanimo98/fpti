import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

async function sendTelegram(message: string) {
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
  } catch (e) {}
}

export async function POST(request: Request) {
  try {
    const { token, event } = await request.json()
    if (!token || !event) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const { data: user } = await supabase
      .from('users')
      .select('id, nickname')
      .eq('share_token', token)
      .single()

    if (!user) return NextResponse.json({ ok: false }, { status: 404 })

    // event: 'shared' | 'test_visited' | 'test_started'
    if (event === 'shared') {
      await supabase.from('users').update({ shared: true }).eq('id', user.id)
      sendTelegram(`📤 <b>${user.nickname}</b>님이 친구에게 공유했어요!`)
    } else if (event === 'test_visited') {
      sendTelegram(`👀 <b>${user.nickname}</b>님 친구가 평가 링크 들어왔어요`)
    } else if (event === 'test_started') {
      sendTelegram(`✏️ <b>${user.nickname}</b>님 친구가 평가 시작했어요`)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
