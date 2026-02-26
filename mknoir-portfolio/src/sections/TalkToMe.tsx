'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useConversation } from '@elevenlabs/react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Mic, PhoneOff } from 'lucide-react'

const AGENT_ID = 'agent_2801kjbnafwqe0jaajfhk6hv87h4'
const BAR_COUNT = 50
const TARGET_FPS = 30
const FRAME_INTERVAL = 1000 / TARGET_FPS

export function TalkToMe() {
  const [barHeights, setBarHeights] = useState<number[]>(() =>
    Array(BAR_COUNT).fill(4)
  )
  const animFrameRef = useRef<number>(undefined)
  const lastFrameRef = useRef(0)
  const startTimeRef = useRef(Date.now())

  const conversation = useConversation({
    onConnect: () => console.log('Connected to Mickey AI'),
    onDisconnect: () => console.log('Disconnected'),
    onError: (err) => console.error('Conversation error:', err),
  })

  const { status, isSpeaking, getInputVolume, getOutputVolume } = conversation
  const isConnected = status === 'connected'
  const isConnecting = status === 'connecting'

  useEffect(() => {
    const animate = (timestamp: number) => {
      animFrameRef.current = requestAnimationFrame(animate)
      if (timestamp - lastFrameRef.current < FRAME_INTERVAL) return
      lastFrameRef.current = timestamp

      const t = (Date.now() - startTimeRef.current) / 1000

      setBarHeights(
        Array.from({ length: BAR_COUNT }, (_, i) => {
          const center = BAR_COUNT / 2
          const normDist = Math.abs(i - center) / center
          const envelope = Math.max(0.2, 1 - normDist * 0.55)

          if (isConnected) {
            const vol = isSpeaking
              ? (getOutputVolume?.() ?? 0)
              : (getInputVolume?.() ?? 0)
            const base = vol * 60 * envelope
            const wave = Math.sin(t * 10 + i * 0.5) * base * 0.35
            const noise = (Math.random() - 0.5) * base * 0.25
            return Math.max(3, base + wave + noise)
          }

          if (isConnecting) {
            return 4 + Math.abs(Math.sin(t * 4 + i * 0.28)) * 30 * envelope
          }

          return 3 + Math.abs(Math.sin(t * 0.7 + i * 0.18)) * 6 * envelope
        })
      )
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [isConnected, isConnecting, isSpeaking, getInputVolume, getOutputVolume])

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'webrtc',
      })
    } catch (err) {
      console.error('Failed to start conversation:', err)
    }
  }, [conversation])

  const stopConversation = useCallback(async () => {
    await conversation.endSession()
  }, [conversation])

  const barColorClass =
    isConnected && isSpeaking
      ? 'bg-primary'
      : isConnected
        ? 'bg-primary/70'
        : isConnecting
          ? 'bg-primary/45'
          : 'bg-muted-foreground/20'

  return (
    <section id="talk" className="py-24 px-6">
      <div className="mx-auto max-w-2xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Talk to Me
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mx-auto mb-10 max-w-xl text-muted-foreground"
        >
          Ask me anything about my work, research, or what I&apos;m building
          next. Powered by AI in my own voice.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card>
            <CardContent className="flex flex-col items-center gap-6 px-8 py-8">
              {/* Waveform */}
              <div className="relative flex h-24 w-full items-center justify-center gap-[2px] overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-card to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-card to-transparent" />
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}px` }}
                    className={`w-[3px] shrink-0 rounded-full ${barColorClass}`}
                  />
                ))}
              </div>

              {/* Status label */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {isConnected && (
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isSpeaking ? 'animate-pulse bg-primary' : 'bg-green-500'
                    }`}
                  />
                )}
                <span>
                  {isConnecting
                    ? 'Connecting...'
                    : isConnected
                      ? isSpeaking
                        ? 'Mickey is speaking...'
                        : 'Listening — go ahead'
                      : 'Start a voice conversation with Mickey'}
                </span>
              </div>

              {/* Button */}
              {!isConnected ? (
                <Button
                  size="lg"
                  onClick={startConversation}
                  disabled={isConnecting}
                  className="min-w-48 gap-2"
                >
                  <Mic className="h-4 w-4" />
                  {isConnecting ? 'Connecting...' : 'Start Conversation'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={stopConversation}
                  className="min-w-48 gap-2"
                >
                  <PhoneOff className="h-4 w-4" />
                  End Conversation
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
