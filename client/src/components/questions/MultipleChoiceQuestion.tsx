'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/supabase'
import { useEffect } from 'react'



type Question = {
  question_text: string
  options: string[]
  correct: number
  difficulty: 'easy' | 'medium' | 'hard'
}

interface MultipleChoiceQuestionProps {
  question: Question
  onAnswer: (answer: string, isCorrect: boolean) => void
  disabled?: boolean
}

export function MultipleChoiceQuestion({ question, onAnswer, disabled }: MultipleChoiceQuestionProps) {
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
  // When the parent question prop changes, reset state
  setSelectedAnswerIndex(null)
  setShowResult(false)
}, [question])

  const handleAnswerSelect = (index: number) => {
    if (disabled || showResult) return
    setSelectedAnswerIndex(index)
  }

  const handleSubmit = () => {
    if (!selectedAnswerIndex || showResult) return
    
     const isCorrect = selectedAnswerIndex === question.correct
    setShowResult(true)
    onAnswer(question.options[selectedAnswerIndex], isCorrect)
  }

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedAnswerIndex === index
        ? 'border-blue-500 bg-blue-50 text-blue-700'
        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
    }

    if (index === question.correct) {
      return 'border-green-500 bg-green-50 text-green-700'
    }

    if (selectedAnswerIndex === index && index !== question.correct) {
      return 'border-red-500 bg-red-50 text-red-700'
    }

    return 'border-gray-200 bg-gray-50 text-gray-500'
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
          <span className="text-gray-500">Multiple Choice</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={disabled || showResult}
              className={`w-full p-4 text-left border-2 rounded-lg transition-colors ${getOptionStyle(index)}`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswerIndex === index ? 'border-current' : 'border-gray-300'
                }`}>
                  {selectedAnswerIndex === index && (
                    <div className="w-3 h-3 rounded-full bg-current"></div>
                  )}
                </div>
                <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={selectedAnswerIndex === null || disabled}
            className="w-full"
          >
            Submit Answer
          </Button>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg ${
            selectedAnswerIndex === question.correct
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                selectedAnswerIndex === question.correct
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {selectedAnswerIndex === question.correct ? '✓' : '✗'}
              </div>
              <span className={`font-medium ${
                selectedAnswerIndex === question.correct
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {selectedAnswerIndex === question.correct ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {selectedAnswerIndex !== question.correct && (
              <p className="mt-2 text-sm text-red-700">
                The correct answer is: {question.options[question.correct]}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}