'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  SendHorizonal,
  Sparkles,
  User,
  Loader2,
  Trash2,
} from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

/* ═══════════════════════════════════════
   Custom Chat Hook — direct streaming, no AI SDK
   ═══════════════════════════════════════ */
function useCapyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    // Create a placeholder for the assistant's streaming reply
    const assistantId = `assistant-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', createdAt: new Date() },
    ])

    try {
      abortRef.current = new AbortController()

      // Build history: all messages so far (including the new user message)
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error(`API error: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk

        // Update the assistant message in-place as chunks arrive
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fullText } : m,
          ),
        )
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') return
      // On error, show a fallback message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Hmm, I got a little lost in my puddle 🌊 Try sending that again?" }
            : m,
        ),
      )
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }, [messages, isLoading])

  const clearMessages = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setIsLoading(false)
  }, [])

  return { messages, isLoading, sendMessage, clearMessages }
}

/* ═══════════════════════════════════════
   Constants
   ═══════════════════════════════════════ */
const WELCOME_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: "Hey there, friend! 🦦 I'm Capy, your cozy AI companion. I'm here to listen, chat, and help you feel a little better about your day.",
    createdAt: new Date(),
  },
  {
    id: 'welcome-2',
    role: 'assistant',
    content: "You can tell me about how you're feeling, ask for advice, or just chat about anything at all. No judgment here — only warm vibes. 🌿",
    createdAt: new Date(),
  },
]

const QUICK_REPLIES = [
  "I'm feeling stressed today",
  "Tell me something nice",
  "I need some motivation",
  "What should I do to relax?",
]

/* ═══════════════════════════════════════
   Utility
   ═══════════════════════════════════════ */
function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

/* ═══════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════ */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-end gap-3"
    >
      <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full bg-matcha/30">
        <Image src="/capybara-texting.png" alt="Capy" fill className="object-contain" />
      </span>
      <div className="rounded-r-2xl rounded-tl-2xl bg-matcha/30 px-5 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-2 rounded-full bg-matcha-foreground/60"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

function ChatBubble({ message, index }: { message: ChatMessage; index: number }) {
  const isUser = message.role === 'user'
  const isEmpty = !message.content && !isUser

  if (isEmpty) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        delay: index < 3 ? index * 0.08 : 0,
      }}
      className={cn('flex items-end gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <span
        className={cn(
          'relative grid shrink-0 place-items-center overflow-hidden rounded-full shadow-sm',
          isUser ? 'size-8 bg-caramel/30' : 'size-9 bg-matcha/30',
        )}
      >
        {isUser ? (
          <User className="size-4 text-caramel" strokeWidth={2.4} />
        ) : (
          <Image src="/capybara-texting.png" alt="Capy" fill className="object-contain" />
        )}
      </span>

      <div className="flex max-w-[78%] flex-col gap-1">
        <div
          className={cn(
            'px-4 py-3 text-sm leading-relaxed font-semibold shadow-sm whitespace-pre-wrap',
            isUser
              ? 'rounded-l-2xl rounded-tr-2xl bg-caramel/20 text-foreground'
              : 'rounded-r-2xl rounded-tl-2xl bg-matcha/25 text-foreground',
          )}
        >
          {message.content}
        </div>
        <span
          className={cn(
            'px-1 text-[0.6rem] font-bold text-muted-foreground/70',
            isUser ? 'text-right' : 'text-left',
          )}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   Main Component
   ═══════════════════════════════════════ */
export function CapyChat() {
  const { messages, isLoading, sendMessage, clearMessages } = useCapyChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    }
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, isLoading, scrollToBottom])
  useEffect(() => { inputRef.current?.focus() }, [])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return
    const text = input.trim()
    setInput('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    sendMessage(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const hasUserMessages = messages.some((m) => m.role === 'user')

  // The assistant is streaming if it's loading and the last message is an (empty) assistant placeholder
  const lastMsg = messages[messages.length - 1]
  const isStreaming = isLoading && lastMsg?.role === 'assistant' && lastMsg.content === ''

  // Display: welcome messages + real messages
  const displayMessages: ChatMessage[] = messages.length === 0
    ? WELCOME_MESSAGES
    : [...WELCOME_DISPLAY_ONLY, ...messages]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 24 }}
      className="flex flex-col"
      style={{ height: 'calc(100dvh - 180px)' }}
    >
      {/* ── Header ── */}
      <motion.section
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 240, damping: 24 }}
        className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-matcha/30 via-card to-honey/20 p-5 shadow-[0_12px_40px_-18px_rgba(120,80,40,0.35)] sm:p-6"
      >
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <motion.div
              className="relative size-14 sm:size-16"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Image
                src="/chatting-capy.png"
                alt="Capy AI mascot"
                fill
                sizes="64px"
                className="object-contain drop-shadow-md"
              />
            </motion.div>
            <motion.span
              className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-2 border-card bg-matcha-foreground/70"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-xl font-bold text-foreground sm:text-2xl">
                Chat with Capy
              </h2>
              <Sparkles className="size-5 text-honey-foreground" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              Your friendly AI companion is here to listen.
            </p>
          </div>

          {hasUserMessages && (
            <motion.button
              type="button"
              onClick={clearMessages}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.9 }}
              title="Clear chat"
              className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            >
              <Trash2 className="size-4" />
            </motion.button>
          )}
        </div>
      </motion.section>

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-1 py-5 scrollbar-thin"
        style={{ scrollbarColor: 'oklch(0.89 0.03 75) transparent' }}
      >
        {displayMessages.map((msg, i) => (
          <ChatBubble key={msg.id} message={msg} index={i} />
        ))}

        <AnimatePresence>
          {isStreaming && <TypingIndicator />}
        </AnimatePresence>

        {!hasUserMessages && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {QUICK_REPLIES.map((text) => (
              <motion.button
                key={text}
                type="button"
                onClick={() => sendMessage(text)}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                className="rounded-full border border-caramel/30 bg-card px-4 py-2 text-xs font-bold text-caramel transition-all hover:border-caramel/60 hover:bg-caramel/10 hover:shadow-sm"
              >
                {text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

      {/* ── Input ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 24 }}
        className="shrink-0 rounded-[1.75rem] border border-border bg-card p-3 shadow-[0_-8px_30px_-12px_rgba(120,80,40,0.2)]"
      >
        <form className="flex items-end gap-2" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message to Capy…"
            rows={1}
            disabled={isLoading}
            className={cn(
              'max-h-28 min-h-[2.5rem] flex-1 resize-none rounded-2xl bg-secondary/50 px-4 py-2.5 text-sm font-semibold text-foreground outline-none transition-all',
              'placeholder:font-medium placeholder:text-muted-foreground',
              'focus:bg-secondary/80 focus:ring-2 focus:ring-caramel/40',
              'disabled:opacity-50',
            )}
            style={{ height: 'auto', minHeight: '2.5rem' }}
            onInput={(e) => {
              const t = e.target as HTMLTextAreaElement
              t.style.height = 'auto'
              t.style.height = Math.min(t.scrollHeight, 112) + 'px'
            }}
          />

          <motion.button
            type="submit"
            disabled={!input.trim() || isLoading}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-2xl shadow-md transition-all',
              input.trim() && !isLoading
                ? 'bg-caramel text-caramel-foreground hover:shadow-lg'
                : 'bg-secondary text-muted-foreground cursor-not-allowed',
            )}
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <SendHorizonal className="size-5" strokeWidth={2.2} />
            )}
          </motion.button>
        </form>

        <p className="mt-2 px-2 text-center text-[0.6rem] font-semibold text-muted-foreground/60">
          Powered by Gemini 2.0 Flash 🦦
        </p>
      </motion.div>
    </motion.div>
  )
}

// Welcome display messages (not sent to API)
const WELCOME_DISPLAY_ONLY: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: "Hey there, friend! 🦦 I'm Capy, your cozy AI companion. I'm here to listen, chat, and help you feel a little better about your day.",
    createdAt: new Date(),
  },
  {
    id: 'welcome-2',
    role: 'assistant',
    content: "You can tell me about how you're feeling, ask for advice, or just chat about anything at all. No judgment here — only warm vibes. 🌿",
    createdAt: new Date(),
  },
]
