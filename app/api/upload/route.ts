import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import PDFParser from 'pdf-parse'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Get file content based on type
    let fileContent: string
    const buffer = await file.arrayBuffer()

    if (file.type === 'application/pdf') {
      try {
        const pdfData = await PDFParser(Buffer.from(buffer))
        fileContent = pdfData.text
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError)
        return new Response(JSON.stringify({ error: 'Failed to parse PDF file' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    } else {
      try {
        fileContent = new TextDecoder().decode(buffer)
      } catch (textError) {
        console.error('Text decoding error:', textError)
        return new Response(JSON.stringify({ error: 'Failed to read file content' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    if (!fileContent?.trim()) {
      return new Response(JSON.stringify({ error: 'File appears to be empty' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      content: fileContent,
      fileType: file.type,
      fileName: file.name,
      fileSize: file.size
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to process file' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 