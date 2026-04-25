import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { nickname } = await request.json()

  if (!nickname || nickname.trim().length < 1) {
    return NextResponse.json({ error: '닉네임을 입력해주세요' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('users')
    .insert({ nickname: nickname.trim() })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: '오류가 발생했습니다' }, { status: 500 })
  }

  return NextResponse.json({ token: data.share_token })
}
