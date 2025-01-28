import { demoStorage } from './storage'

// Helper to format content for the AI
export function formatContentForAI(content: string) {
  return `
Context: The following is course content from a learning management system.
---
${content}
---
Please provide helpful, accurate responses based on this content. If the question is not related to the content, politely guide the user back to the course material.
`
}

// Function to get AI response using Deepseek
export async function getAIResponse(message: string, courseContent: string) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  const apiUrl = 'https://api.deepseek.com/v1/chat/completions' // Replace with actual Deepseek endpoint

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Replace with actual model identifier
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI tutor assisting with course content.'
          },
          {
            role: 'user',
            content: formatContentForAI(courseContent)
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('AI API error:', error)
    throw new Error('Failed to get AI response')
  }
} 