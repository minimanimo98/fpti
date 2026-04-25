import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const REVERSE = [4, 9, 11, 12, 17, 22, 23, 24, 25, 26, 28]

function calcScore(allAnswers: Record<number, number>[]) {
  const avgPerQ: Record<number, number> = {}
  for (let i = 1; i <= 28; i++) {
    const vals = allAnswers.map(a => a[i]).filter(v => v !== undefined)
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
  const topQ = Object.entries(avgPerQ)
    .slice(0, 25)
    .map(([id, avg]) => ({ id: Number(id), avg: REVERSE.includes(Number(id)) ? -avg : avg }))
    .sort((a, b) => b.avg - a.avg)
  return { score, typeName, topItems: topQ.slice(0, 3), bottomItems: topQ.slice(-3).reverse() }
}

export async function GET(request: Request) {
  const token = request.url.split('/').pop() || ''

  const { data: user } = await supabase
    .from('users')
    .select('id, nickname, response_count')
    .eq('share_token', token)
    .single()

  if (!user) return NextResponse.json({ error: '없는 링크' }, { status: 404 })

  const { data: responses } = await supabase
    .from('responses')
    .select('answers')
    .eq('user_id', user.id)

  if (!responses || responses.length === 0) {
    return NextResponse.json({ nickname: user.nickname, count: 0, locked: true })
  }

  const allAnswers = responses.map(r => r.answers)
  const result = calcScore(allAnswers)

  return NextResponse.json({
    nickname: user.nickname,
    count: responses.length,
    locked: responses.length < 3,
    ...result,
  })
}
