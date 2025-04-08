import { connectToDatabase } from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDatabase()
    return NextResponse.json({ message: 'MongoDB connected' })
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Connection failed' },
      { status: 500 }
    )
  }
}
