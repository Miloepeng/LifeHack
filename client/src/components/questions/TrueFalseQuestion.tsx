'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/lib/supabase'

type Question = Database['public']['Tables']['questions']['Row']

interface TrueFalseQuestionProps {
  question: Question
  onAnswer: (answer: string, isCorrect: boolean) => void
  disabled?: boolean
}

export function TrueFalseQuestion({ question, onAnswer, disabled }: TrueFalseQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showResult, setShowResult] = useState(false)

  const handleAnswerSelect = (answer: string) => {
    if (disabled || showResult) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (!selectedAnswer || showResult) return
    
    const isCorrect = selectedAnswer === question.correct_answer
    setShowResult(true)
    onAnswer(selectedAnswer, isCorrect)
  }

  const getButtonStyle = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? 'border-blue-500 bg-blue-50 text-blue-700'
        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
    }

    if (option === question.correct_answer) {
      return 'border-green-500 bg-green-50 text-green-700'
    }

    if (option === selectedAnswer && option !== question.correct_answer) {
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
          <span className="text-gray-500">True/False</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAnswerSelect('True')}
            disabled={disabled || showResult}
            className={`p-6 text-center border-2 rounded-lg transition-colors ${getButtonStyle('True')}`}
          >
            <div className="space-y-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto ${
                selectedAnswer === 'True' ? 'border-current' : 'border-gray-300'
              }`}>
                {selectedAnswer === 'True' && (
                  <div className="w-4 h-4 rounded-full bg-current"></div>
                )}
              </div>
              <div className="text-lg font-semibold">True</div>
            </div>
          </button>

          <button
            onClick={() => handleAnswerSelect('False')}
            disabled={disabled || showResult}
            className={`p-6 text-center border-2 rounded-lg transition-colors ${getButtonStyle('False')}`}
          >
            <div className="space-y-2">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mx-auto ${
                selectedAnswer === 'False' ? 'border-current' : 'border-gray-300'
              }`}>
                {selectedAnswer === 'False' && (
                  <div className="w-4 h-4 rounded-full bg-current"></div>
                )}
              </div>
              <div className="text-lg font-semibold">False</div>
            </div>
          </button>
        </div>

        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || disabled}
            className="w-full"
          >
            Submit Answer
          </Button>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg ${
            selectedAnswer === question.correct_answer
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                selectedAnswer === question.correct_answer
                  ? 'bg-green-500 text-white'
                  : 'bg-red-500 text-white'
              }`}>
                {selectedAnswer === question.correct_answer ? '✓' : '✗'}
              </div>
              <span className={`font-medium ${
                selectedAnswer === question.correct_answer
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {selectedAnswer === question.correct_answer ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {selectedAnswer !== question.correct_answer && (
              <p className="mt-2 text-sm text-red-700">
                The correct answer is: {question.correct_answer}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 