'use client'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Zap } from 'lucide-react'

interface DragAndDropQuestionProps {
  question_text: string
  pairs: { target: string; correct: string }[]
  options: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  onAnswer: (answer: Record<string, string[]>, isCorrect: boolean) => void
  disabled?: boolean
  onNext: () => void
  showNext: boolean
}

export function DragAndDropQuestion({
  question_text,
  pairs,
  options,
  difficulty,
  onAnswer,
  onNext,
  showNext,
  disabled
}: DragAndDropQuestionProps) {
  const [assignments, setAssignments] = useState<Record<string, string[]>>({})
  const [dragItem, setDragItem] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleDrop = (target: string) => {
    if (dragItem && !disabled && !showResult) {
      setAssignments((prev) => ({
  ...prev,
  [target]: [...(prev[target] || []), dragItem]
}))

      setDragItem(null)
    }
  }

  const parseCoin = (str: string): number => {
  if (str.includes('¢')) return parseFloat(str.replace('¢', '')) / 100
  return parseFloat(str.replace('$', ''))
}

 const isAllCorrect = pairs.every((pair) => {
  const dropped = assignments[pair.target] || []
  const sum = dropped.reduce((total, coin) => total + parseCoin(coin), 0)
  return Math.abs(sum - parseCoin(pair.correct)) < 0.001 // tolerance for float precision
})

const handleSubmit = () => {
  if (showResult) return

  const isCorrect = pairs.every((pair) => {
    const coins = assignments[pair.target] || []
    const total = coins.reduce((sum, coin) => sum + parseCoin(coin), 0)
    const targetAmount = parseCoin(pair.correct)
    return Math.abs(total - targetAmount) < 0.001 // float-safe comparison
  })

  setShowResult(true)
  onAnswer(assignments, isCorrect)
}

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">
          {question_text}
        </CardTitle>
        <div className="flex items-center space-x-2 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {difficulty}
          </span>
          <span className="text-gray-500">Drag & Drop</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {pairs.map((pair, idx) => (
            <div
              key={idx}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(pair.target)}
              className="min-h-[80px] p-3 border-2 rounded-lg bg-gray-50 flex flex-col justify-center items-center text-center"
            >
              <div className="flex flex-col items-center space-y-1">
  <img
    src="/images/piggy.png"
    alt={pair.target}
    className="h-20 w-20 object-contain"
  />
  <div className="font-semibold text-gray-700">{pair.target}</div>
  <div className="text-sm text-blue-700">
    Match this: <span className="font-semibold">{pair.correct}</span>
  </div>
</div>

              <div className="flex gap-2 flex-wrap justify-center mt-2">
            {(assignments[pair.target] || []).length === 0
            ? <span className="text-blue-600 font-medium">Drop here</span>
            : assignments[pair.target]?.map((coin, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-100 text-sm rounded-full">
            {coin}
            </span>
      ))
  }
</div>

            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {options.map((option, idx) => (
            <div
              key={idx}
              draggable={!disabled && !showResult}
              onDragStart={() => setDragItem(option)}
              className="cursor-grab px-3 py-2 bg-white border rounded-lg shadow hover:bg-blue-50"
            >
              {option}
            </div>
          ))}
        </div>

        {options.length > 0 && (
            <div className="flex justify-end">
            <Button
            variant="outline"
            onClick={() => setAssignments({})}
            disabled={disabled || showResult}
            className="text-sm"
            >
            Clear All
        </Button>
        </div>
        )}


        {!showResult && (
          <Button
            onClick={handleSubmit}
            disabled={Object.keys(assignments).length !== pairs.length || disabled}
            className="w-full"
          >
            Submit Answer
          </Button>
        )}

        {showResult && (
  <>
    <div className={`p-4 rounded-lg ${
  isAllCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
}`}>
  <span className={`font-medium ${isAllCorrect ? 'text-green-800' : 'text-red-800'}`}>
    {isAllCorrect ? 'Correct!' : 'Incorrect'}
  </span>
</div>


    {showNext && (
      <div className="flex justify-end mt-4">
        <Button onClick={onNext} className="bg-blue-600 hover:bg-blue-700">
          <Zap className="h-4 w-4 mr-2" />
          Next (AI Selected)
        </Button>
      </div>
    )}
  </>
)}

      </CardContent>
    </Card>
  )
}