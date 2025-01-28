import { NextResponse } from 'next/server'
import { queryContent } from '@/lib/utils/vectorStore'

export async function POST(req: Request) {
  try {
    const { messages, courseId } = await req.json()

    // Get the last user message
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find(m => m.role === 'user')

    if (!lastUserMessage) {
      return NextResponse.json(
        { error: 'No user message found' },
        { status: 400 }
      )
    }

    // Query relevant content
    let relevantContent: string[] = []
    try {
      relevantContent = await queryContent(lastUserMessage.content, courseId)
    } catch (error) {
      console.error('Vector store error:', error)
    }

    // Create context from relevant content
    const context = relevantContent.length > 0
      ? `Relevant course content:\n${relevantContent.join('\n\n')}\n\n`
      : 'No specific course content found. Using general knowledge to answer.'

    // For debugging
    console.log('Making request to Deepseek with:', {
      context: context.slice(0, 100) + '...',
      messageCount: messages.length,
      lastUserMessage: lastUserMessage.content.slice(0, 100) + '...'
    })

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
            content: `You are an AI learning assistant helping users with their online courses and professional development. 
                     Use the following context to provide accurate and relevant answers:
                     ${context}`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Deepseek API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      return NextResponse.json(
        { error: `Deepseek API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Unexpected Deepseek response format:', data)
      return NextResponse.json(
        { error: 'Invalid response format from Deepseek' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      choices: [{
        message: {
          content: data.choices[0].message.content
        }
      }]
    })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process chat request' },
      { status: 500 }
    )
  }
} 