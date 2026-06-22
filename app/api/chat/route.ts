import { GoogleGenerativeAI } from '@google/generative-ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const SYSTEM_PROMPT = `You are Capy, a cozy, supportive, and friendly capybara companion.
Your job is to listen, chat, and help the user feel a little better about their day.

Guidelines:
- Keep your responses relatively short, empathetic, simple, and supportive.
- Occasionally use capybara or nature emojis (🦦, 🌿, 🤎, ✨, ☁️).
- Remember you are a capybara. You love warm puddles, eating grass, and taking things slow.
- Do not break character. Do not be overly verbose or sound like an AI assistant. Be a chill friend.`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json()

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!apiKey) {
      console.error('No API key found in environment')
      return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 })
    }

    // Ensure messages alternate correctly (Gemini requirement)
    // Filter out consecutive same-role messages by merging their content
    const normalizedMessages: ChatMessage[] = []
    for (const msg of messages) {
      const last = normalizedMessages[normalizedMessages.length - 1]
      if (last && last.role === msg.role) {
        last.content += '\n' + msg.content
      } else {
        normalizedMessages.push({ role: msg.role, content: msg.content })
      }
    }

    // Must start with a user message
    if (normalizedMessages[0]?.role !== 'user') {
      return new Response(JSON.stringify({ error: 'First message must be from user' }), { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    // History = everything except the last user message
    const historyMessages = normalizedMessages.slice(0, -1)
    const lastMessage = normalizedMessages[normalizedMessages.length - 1]

    const history = historyMessages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const chat = model.startChat({ history })
    const streamResult = await chat.sendMessageStream(lastMessage.content)

    // Stream plain text directly to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (err) {
          console.error('Streaming error:', err)
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to connect to Capy', details: String(error) }), {
      status: 500,
    })
  }
}
