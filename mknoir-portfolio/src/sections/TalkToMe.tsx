'use client'

import { useEffect, useRef, useState } from 'react'
import { useConversation } from '@elevenlabs/react'
import { ArrowUpRight, Mic, PhoneOff, X } from 'lucide-react'
import DnaLoader from '@/components/Dnaloader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import '@/styles/voice.css'

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

export function TalkToMe() {
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
    <section id="talk" className="voice-section" aria-labelledby="voice-heading">
      <div className="shell">
        <div className="voice-grid">
          <div className="voice-copy">
            <p className="eyebrow">04 / A LITTLE EXPERIMENT</p>
            <h2 id="voice-heading">A different kind<br />of hello.</h2>
            <p className="voice-intro">
              Meet AI Mickey. An AI version of me, with a synthetic version of my
              voice. Ask about my work, the things I build, or the ideas behind them.
            </p>
            <div className="voice-prompts">
              <p>A few places to start</p>
              <ul>
                <li>“What are you building?”</li>
                <li>“How do biology and software connect in your work?”</li>
              </ul>
            </div>
            <a className="voice-human-link" href="#contact">
              Prefer the human? Send me a note <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <Card className="voice-interface" data-connected={connected && !closing}>
            <div className="voice-interface-topline">
              <span>VOICE EXPERIMENT</span>
              <Badge variant="outline" className="voice-connection-label rounded-md">
                <span className="voice-status-dot" aria-hidden="true" />
                {closing ? 'Closing' : connected ? 'Connected' : pending ? 'Connecting' : 'On demand'}
              </Badge>
            </div>
            <CardContent className="p-0">
            <div className="voice-symbol" aria-hidden="true">
              <DnaLoader active={pending || closing} className="voice-dna" />
            </div>
            <h3>AI Mickey</h3>
            <p className="voice-status" role="status" aria-live="polite" aria-atomic="true">
              {statusText}
            </p>

            {error && <p className="voice-error" role="alert">{error}</p>}

            <div className="voice-actions">
              {needsReload ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="voice-button"
                  type="button"
                  onClick={() => window.location.reload()}
                >
                  Refresh to reconnect
                </Button>
              ) : connected || pending || closing ? (
                <Button
                  variant="outline"
                  size="lg"
                  className="voice-button"
                  type="button"
                  onClick={stopConversation}
                  disabled={closing}
                >
                  {pending ? <X size={16} aria-hidden="true" /> : <PhoneOff size={16} aria-hidden="true" />}
                  {closing ? 'Ending…' : pending ? 'Cancel connection' : 'End conversation'}
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="voice-button"
                  type="button"
                  onClick={startConversation}
                  aria-describedby="voice-disclosure"
                >
                  <Mic size={16} aria-hidden="true" />
                  {error ? 'Try again' : 'Start a conversation'}
                </Button>
              )}
            </div>
            <p id="voice-disclosure" className="voice-disclosure">
              Microphone required · Powered by ElevenLabs<br />
              You’re talking to AI. Its answers can be imperfect.
            </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
