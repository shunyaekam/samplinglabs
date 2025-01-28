import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { queryVectorStore } from '@/lib/services/vectorStore'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
    }

    // Get relevant context from vector store
    const lastMessage = messages[messages.length - 1]
    const context = await queryVectorStore(lastMessage.content)
    
    // Prepare system message with context
    const systemMessage = {
      role: 'system',
      content: `You are a helpful AI tutor. Use the following course content to inform your responses, but don't mention that you're using it unless asked:
      
      ${context.map(c => `From "${c.title}": ${c.text}`).join('\n\n')}`
    }

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [systemMessage, ...messages],
          temperature: 0.7,
          max_tokens: 1000
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Deepseek API error:', error)
        throw new Error(error.error?.message || 'Failed to get response from Deepseek')
      }

      const data = await response.json()
      return NextResponse.json(data)

    } catch (apiError) {
      console.error('API request error:', apiError)
      throw apiError
    }

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 