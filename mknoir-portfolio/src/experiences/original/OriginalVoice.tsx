'use client'

import { useEffect, useRef, useState } from 'react'
import { useConversation } from '@elevenlabs/react'
import { Mic, PhoneOff, X } from 'lucide-react'
import DnaLoader from '@/components/Dnaloader'
import { Button } from './button'
import { Card, CardContent } from './card'

const AGENT_ID = 'agent_2801kjbnafwqe0jaajfhk6hv87h4'
type ConnectionPhase = 'idle' | 'permission' | 'connecting' | 'closing'

function getConnectionError(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      return 'Microphone access is blocked. Allow it in your browser’s site settings, then try again.'
    }
    if (error.name === 'NotFoundError') {
      return 'No microphone was found. Connect a microphone, then try again.'
    }
    if (error.name === 'NotReadableError') {
      return 'Your microphone is unavailable. Check whether another app is using it, then try again.'
    }
    if (error.message === 'microphone-unavailable') {
      return 'Voice chat needs a browser with microphone support and a secure connection. You can still reach me below.'
    }
  }
  return 'AI Mickey couldn’t connect. Check your connection and try again, or send me a note below.'
}

export function OriginalVoice() {
  const [phase, setPhase] = useState<ConnectionPhase>('idle')
  const [error, setError] = useState<string | null>(null)
  const [needsReload, setNeedsReload] = useState(false)
  const [notice, setNotice] = useState('Ready when you are.')
  const mountedRef = useRef(false)
  const attemptRef = useRef(0)
  const startingRef = useRef(false)
  const closingRef = useRef(false)
  const conversation = useConversation()
  const conversationRef = useRef(conversation)
  conversationRef.current = conversation

  const { status, isSpeaking } = conversation
  const connected = status === 'connected'
  const pending = phase === 'permission' || phase === 'connecting' || status === 'connecting'
  const closing = phase === 'closing' || status === 'disconnecting'

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      attemptRef.current += 1
      // The SDK also cancels sessions that are still connecting.
      void conversationRef.current.endSession().catch(() => {})
    }
  }, [])

  async function startConversation() {
    if (startingRef.current || closingRef.current || connected || pending || closing || needsReload) return

    const attempt = ++attemptRef.current
    const isCurrent = () => mountedRef.current && attempt === attemptRef.current
    startingRef.current = true
    setError(null)
    setNotice('')
    setPhase('permission')

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('microphone-unavailable')
      }

      // Release the permission-check stream before the SDK opens its own.
      // Even a cancelled request must stop any microphone stream it returns.
      const permissionStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      permissionStream.getTracks().forEach((track) => track.stop())
      if (!isCurrent()) return

      setPhase('connecting')
      await conversationRef.current.startSession({
        agentId: AGENT_ID,
        connectionType: 'webrtc',
        onDisconnect: () => {
          if (isCurrent()) setNotice('Conversation ended. Thanks for stopping by.')
        },
        onError: () => {
          if (!isCurrent()) return
          setError('The voice connection was interrupted. Please try again, or send me a note below.')
          void conversationRef.current.endSession().catch(() => {})
        },
      })

    } catch (connectionError) {
      if (isCurrent()) {
        setError(getConnectionError(connectionError))
        await conversationRef.current.endSession().catch(() => {})
      }
    } finally {
      if (isCurrent()) {
        startingRef.current = false
        setPhase('idle')
      }
    }
  }

  async function stopConversation() {
    if (closingRef.current) return

    // A late permission response must never start a cancelled conversation.
    attemptRef.current += 1
    startingRef.current = false
    closingRef.current = true
    const wasPending = pending
    setPhase('closing')

    try {
      await conversationRef.current.endSession()
      if (mountedRef.current) {
        setNotice(wasPending ? 'Connection cancelled. Ready when you are.' : 'Conversation ended. Thanks for stopping by.')
      }
    } catch {
      if (mountedRef.current) {
        setError('The connection could not close cleanly. Refresh this page before starting again.')
        setNeedsReload(true)
      }
    } finally {
      closingRef.current = false
      if (mountedRef.current) setPhase('idle')
    }
  }

  const statusText = closing
    ? 'Ending the conversation…'
    : phase === 'permission'
      ? 'Allow microphone access in your browser to continue.'
      : pending
        ? 'Connecting to AI Mickey…'
        : connected
          ? isSpeaking
            ? 'AI Mickey is speaking.'
            : 'Listening. Go ahead.'
          : error
            ? 'Let’s try that again.'
            : notice

  return (
    <section id="talk" className="original-voice py-24 px-6" aria-labelledby="original-voice-title">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="original-voice-title" className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Talk to Me</h2>
        <p className="mx-auto mb-10 max-w-xl text-muted-foreground">
          Ask about my work, research, or what I&apos;m building next.
          This is AI Mickey, with a synthetic version of my voice.
        </p>
        <Card>
          <CardContent className="flex flex-col items-center gap-6 px-8 py-8">
            <div className="original-waveform" aria-hidden="true" data-active={connected}>
              {pending || closing ? <DnaLoader active /> : Array.from({ length: 50 }, (_, i) => (
                <i key={i} style={{ height: `${3 + Math.abs(Math.sin(i * 0.18)) * 6}px` }} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">{statusText}</p>
            {error && <p className="original-voice-error" role="alert">{error}</p>}
            {needsReload ? <Button size="lg" variant="outline" onClick={() => window.location.reload()}>Refresh to reconnect</Button>
              : connected || pending || closing ? <Button size="lg" variant="outline" onClick={stopConversation} disabled={closing} className="min-w-48 gap-2">
                {pending ? <X aria-hidden="true" /> : <PhoneOff aria-hidden="true" />}
                {closing ? 'Ending…' : pending ? 'Cancel connection' : 'End Conversation'}
              </Button> : <Button size="lg" onClick={startConversation} className="min-w-48 gap-2" aria-describedby="original-voice-disclosure"><Mic aria-hidden="true" />{error ? 'Try again' : 'Start Conversation'}</Button>}
            <p id="original-voice-disclosure" className="original-voice-disclosure">Microphone required · Powered by ElevenLabs<br />You’re talking to AI. Its answers can be imperfect.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
