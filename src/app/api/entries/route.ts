import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { entries } from '@/lib/db/schema'
import { z } from 'zod'

const entrySchema = z.object({
  mode: z.enum(['freeform', 'prompted']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  moodScore: z.number().int().min(1).max(10),
  freeformText: z.string().optional(),
  gratitude: z.string().optional(),
  todo: z.string().optional(),
  affirmations: z.string().optional(),
  didRight: z.string().optional(),
  didWrong: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = entrySchema.parse(body)

    const userId = process.env.SINGLE_USER_ID!

    const [entry] = await db.insert(entries).values({ userId, ...data }).returning()
    return NextResponse.json(entry, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
