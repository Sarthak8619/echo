import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers, getResurfacedEntries, getCachedReflection, cacheReflection } from '@/lib/db/queries'
import { generateReflection } from '@/lib/ai/reflection'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]
  const allUsers = await getAllUsers()
  const results: { userId: string; label: string; status: string }[] = []

  for (const user of allUsers) {
    const candidates = await getResurfacedEntries(user.id)

    for (const { label, days, entry } of candidates) {
      if (!entry) continue

      const existing = await getCachedReflection(entry.id, today)
      let reflectionText = existing?.reflectionText

      if (!reflectionText) {
        try {
          reflectionText = await generateReflection(entry, days)
          await cacheReflection(user.id, entry.id, today, reflectionText)
        } catch (err) {
          console.error(`Reflection generation failed (user ${user.id}, entry ${entry.id}):`, err)
          results.push({ userId: user.id, label, status: 'generation_failed' })
          continue
        }
      }

      results.push({ userId: user.id, label, status: existing ? 'already_cached' : 'generated' })
    }
  }

  return NextResponse.json({ ok: true, results })
}
