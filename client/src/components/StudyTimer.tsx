'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Play, 
  Pause, 
  Square, 
  Coffee, 
  Brain, 
  Zap, 
  Target,
  Volume2,
  VolumeX
} from 'lucide-react'

interface StudySession {
  id: string
  startTime: Date
  endTime?: Date
  duration: number
  mode: 'focus' | 'break' | 'deep-work'
  skillId?: string
  completed: boolean
}

interface StudyTimerProps {
  onSessionComplete?: (session: StudySession) => void
  skillId?: string
}

export default function StudyTimer({ onSessionComplete, skillId }: StudyTimerProps) {
  const [isActive, setIsActive] = useState(false)
  const [time, setTime] = useState(25 * 60) // 25 minutes in seconds
  const [mode, setMode] = useState<'focus' | 'break' | 'deep-work'>('focus')
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null)
  const [completedSessions, setCompletedSessions] = useState<StudySession[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const modes = {
    focus: { duration: 25 * 60, label: 'Focus Session', icon: Brain, color: 'bg-blue-500' },
    break: { duration: 5 * 60, label: 'Short Break', icon: Coffee, color: 'bg-green-500' },
    'deep-work': { duration: 50 * 60, label: 'Deep Work', icon: Zap, color: 'bg-purple-500' }
  }

  useEffect(() => {
    if (isActive && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime(time => time - 1)
      }, 1000)
    } else if (time === 0) {
      handleSessionComplete()
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, time])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    if (!currentSession) {
      const session: StudySession = {
        id: Date.now().toString(),
        startTime: new Date(),
        duration: modes[mode].duration,
        mode,
        skillId,
        completed: false
      }
      setCurrentSession(session)
    }
    setIsActive(true)
  }

  const pauseTimer = () => {
    setIsActive(false)
  }

  const stopTimer = () => {
    setIsActive(false)
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: false
      }
      setCompletedSessions(prev => [...prev, completedSession])
      onSessionComplete?.(completedSession)
    }
    setCurrentSession(null)
    setTime(modes[mode].duration)
  }

  const handleSessionComplete = () => {
    setIsActive(false)
    if (currentSession) {
      const completedSession = {
        ...currentSession,
        endTime: new Date(),
        completed: true
      }
      setCompletedSessions(prev => [...prev, completedSession])
      onSessionComplete?.(completedSession)
      
      // Play completion sound if enabled
      if (soundEnabled) {
        const audio = new Audio('/notification.mp3')
        audio.play().catch(() => {
          // Fallback to system notification
          if (Notification.permission === 'granted') {
            new Notification('Study Session Complete!', {
              body: `${modes[mode].label} finished!`,
              icon: '/favicon.ico'
            })
          }
        })
      }
    }
    setCurrentSession(null)
    
    // Auto-switch to break mode after focus session
    if (mode === 'focus') {
      setMode('break')
      setTime(modes.break.duration)
    } else if (mode === 'break') {
      setMode('focus')
      setTime(modes.focus.duration)
    } else {
      setTime(modes[mode].duration)
    }
  }

  const switchMode = (newMode: 'focus' | 'break' | 'deep-work') => {
    if (isActive) return // Don't switch modes during active session
    setMode(newMode)
    setTime(modes[newMode].duration)
    setCurrentSession(null)
  }

  const progress = ((modes[mode].duration - time) / modes[mode].duration) * 100
  const ModeIcon = modes[mode].icon

  const todaySessions = completedSessions.filter(session => {
    const today = new Date()
    const sessionDate = new Date(session.startTime)
    return sessionDate.toDateString() === today.toDateString()
  })

  const totalFocusTime = todaySessions
    .filter(session => session.mode === 'focus' && session.completed)
    .reduce((total, session) => total + session.duration, 0)

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center space-x-2">
          <ModeIcon className="h-5 w-5" />
          <span>{modes[mode].label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-black mb-4">
            {formatTime(time)}
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex items-center justify-center space-x-2 text-sm text-black">
            <Target className="h-4 w-4" />
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex space-x-2">
          {Object.entries(modes).map(([key, modeConfig]) => {
            const Icon = modeConfig.icon
            return (
              <Button
                key={key}
                variant={mode === key ? 'default' : 'outline'}
                size="sm"
                onClick={() => switchMode(key as 'focus' | 'break' | 'deep-work')}
                disabled={isActive}
                className="flex-1 flex items-center space-x-1"
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{modeConfig.label}</span>
              </Button>
            )
          })}
        </div>

        {/* Control Buttons */}
        <div className="flex space-x-2">
          {!isActive ? (
            <Button 
              onClick={startTimer} 
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button 
              onClick={pauseTimer} 
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button 
            onClick={stopTimer} 
            variant="outline"
            className="flex-1"
            disabled={!currentSession}
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="ghost"
            size="icon"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{todaySessions.filter(s => s.completed).length}</div>
            <div className="text-sm text-black">Sessions Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-black">{Math.round(totalFocusTime / 60)}</div>
            <div className="text-sm text-black">Minutes Focused</div>
          </div>
        </div>

        {/* Current Session Info */}
        {currentSession && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black">Session Started:</span>
              <span className="text-black">{currentSession.startTime.toLocaleTimeString()}</span>
            </div>
            {skillId && (
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-black">Studying:</span>
                <Badge variant="secondary">{skillId}</Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 