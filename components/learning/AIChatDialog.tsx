'use client'

import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Send, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AIChatDialog({ open, onOpenChange }: AIChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage = data.choices[0].message
      if (assistantMessage) {
        setMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-screen h-[calc(100vh-48px)] mt-12 flex flex-col p-0 gap-0 bg-transparent backdrop-blur-none border-none shadow-none transition-all duration-200 max-w-none m-0 rounded-none"
        style={{ marginTop: '48px' }}
      >
        <DialogTitle className="sr-only">AI Tutor Chat</DialogTitle>

        <ScrollArea className="flex-1 px-4 md:px-8 lg:px-16 py-8 overflow-y-auto bg-transparent">
          <div className="space-y-4 max-w-4xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((message, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-6 py-3 break-words shadow-lg",
                      message.role === 'user'
                        ? "bg-blue-600 text-white prose-invert"
                        : "bg-white text-gray-900 prose prose-sm"
                    )}
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: ({ node, ...props }) => (
                          <div className="overflow-auto rounded-lg bg-black/10 p-2 my-2">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ node, inline, ...props }) => (
                          inline 
                            ? <code className="bg-black/10 rounded px-1" {...props} />
                            : <code {...props} />
                        ),
                        p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2 text-white/75"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </motion.div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="px-4 md:px-8 lg:px-16 pb-[25vh]">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 px-6 py-3 rounded-full bg-black/30 backdrop-blur-sm border-0 
                text-white placeholder-white/50 
                focus:outline-none focus:ring-2 focus:ring-white/50 
                transition-all duration-200"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-black/30 hover:bg-black/40 text-white border-0
                transition-all duration-200 hover:scale-105 backdrop-blur-sm rounded-full px-6"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
} 