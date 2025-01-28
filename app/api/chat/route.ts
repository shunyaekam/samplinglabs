import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { queryContent } from '@/lib/utils/vectorStore'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages, courseId } = await req.json()
    const lastUserMessage = messages.findLast((m: any) => m.role === 'user')

    if (!lastUserMessage) {
      return NextResponse.json({ error: 'No user message found' }, { status: 400 })
    }

    // Get relevant content using vector similarity search
    const relevantContent = await queryContent(lastUserMessage.content, courseId)
    const context = relevantContent.length > 0
      ? `Relevant course content:\n${relevantContent.join('\n\n')}`
      : 'No specific course content found.'

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are an AI tutor helping with course content. Use the following context to answer questions:\n${context}`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 