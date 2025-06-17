'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/supabase'

type Question = Database['public']['Tables']['questions']['Row']

interface ShortAnswerQuestionProps {
  question: Question
  onAnswer: (answer: string, isCorrect: boolean) => void
  disabled?: boolean
}

export function ShortAnswerQuestion({ question, onAnswer, disabled }: ShortAnswerQuestionProps) {
  const [answer, setAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    if (!answer.trim() || showResult) return
    
    // For short answer questions, we'll do a case-insensitive comparison
    // In a real app, you might want more sophisticated matching
    const isCorrect = answer.trim().toLowerCase() === question.correct_answer.toLowerCase()
    setShowResult(true)
    onAnswer(answer.trim(), isCorrect)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          {question.question_text}
        </CardTitle>
        <div className="flex items-center space-x-2 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {question.difficulty}
          </span>
          <span className="text-gray-500">Short Answer</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="answer-input" className="block text-sm font-medium text-gray-700">
            Your Answer:
          </label>
          <Input
            id="answer-input"
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled || showResult}
            placeholder="Type your answer here..."
            className="text-lg"
          />
        </div>

        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || disabled}
            className="w-full"
          >
            Submit Answer
          </Button>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg ${
            answer.trim().toLowerCase() === question.correct_answer.toLowerCase()
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                answer.trim().toLowerCase() === question.correct_answer.toLowerCase()
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {answer.trim().toLowerCase() === question.correct_answer.toLowerCase() ? '✓' : '✗'}
              </div>
              <span className={`font-medium ${
                answer.trim().toLowerCase() === question.correct_answer.toLowerCase()
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {answer.trim().toLowerCase() === question.correct_answer.toLowerCase() ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {answer.trim().toLowerCase() !== question.correct_answer.toLowerCase() && (
              <div className="mt-2">
                <p className="text-sm text-red-700">
                  Your answer: <span className="font-medium">{answer}</span>
                </p>
                <p className="text-sm text-red-700">
                  Correct answer: <span className="font-medium">{question.correct_answer}</span>
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 