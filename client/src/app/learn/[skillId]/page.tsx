'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Target,
  Trophy,
  Brain,
  Lightbulb,
  Zap
} from 'lucide-react'

// Simple BKT-inspired adaptive learning system
class SimpleBKT {
  private masteryThreshold = 0.8
  private initialMastery = 0.1
  private learnRate = 0.3
  private guessRate = 0.25
  private slipRate = 0.1

  updateMastery(currentMastery: number, isCorrect: boolean): number {
    if (isCorrect) {
      // Bayesian update for correct answer
      const numerator = currentMastery * (1 - this.slipRate)
      const denominator = numerator + (1 - currentMastery) * this.guessRate
      const posteriorMastery = numerator / denominator
      
      // Apply learning
      return posteriorMastery + (1 - posteriorMastery) * this.learnRate
    } else {
      // Bayesian update for incorrect answer
      const numerator = currentMastery * this.slipRate
      const denominator = numerator + (1 - currentMastery) * (1 - this.guessRate)
      return numerator / denominator
    }
  }

  selectNextQuestion(questions: SkillData['questions'], masteryLevel: number, answeredQuestions: number[]): number {
    // BKT-inspired question selection:
    // - If mastery is low, prefer easier questions
    // - If mastery is high, prefer harder questions
    // - Avoid recently answered questions
    
    const availableQuestions = questions
      .map((_, index) => index)
      .filter(index => !answeredQuestions.includes(index))
    
    if (availableQuestions.length === 0) {
      return -1 // No more questions
    }

    // Simple adaptive selection based on mastery
    if (masteryLevel < 0.3) {
      // Low mastery: prefer first questions (easier)
      return availableQuestions[0]
    } else if (masteryLevel < 0.7) {
      // Medium mastery: random selection
      return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
    } else {
      // High mastery: prefer later questions (harder)
      return availableQuestions[availableQuestions.length - 1]
    }
  }

  isMastered(masteryLevel: number): boolean {
    return masteryLevel >= this.masteryThreshold
  }
}

// Mock question data
interface SkillData {
  name: string
  description: string
  questions: {
    id: number
    question: string
    type: 'multiple_choice' | 'true_false'
    options: string[]
    correct: number
    explanation: string
    difficulty: 'easy' | 'medium' | 'hard'
  }[]
}

const skillQuestions: Record<string, SkillData> = {
  'js-fundamentals': {
    name: 'JavaScript Fundamentals',
    description: 'Learn the basics of JavaScript programming',
    questions: [
      {
        id: 1,
        question: 'What is the result of 5 + "5" in JavaScript?',
        type: 'multiple_choice',
        options: ['10', '55', 'Error', 'NaN'],
        correct: 1,
        explanation: 'In JavaScript, when you add a number and a string, the number is converted to a string and concatenated.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'Which keyword is used to declare a variable in JavaScript?',
        type: 'multiple_choice',
        options: ['var', 'let', 'const', 'All of the above'],
        correct: 3,
        explanation: 'JavaScript has three ways to declare variables: var (function-scoped), let (block-scoped), and const (block-scoped, immutable).',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'Is JavaScript case-sensitive?',
        type: 'true_false',
        options: ['True', 'False'],
        correct: 0,
        explanation: 'JavaScript is case-sensitive. Variables like "myVar" and "myvar" are different.',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: 'What does "typeof null" return in JavaScript?',
        type: 'multiple_choice',
        options: ['null', 'undefined', 'object', 'boolean'],
        correct: 2,
        explanation: 'This is a well-known JavaScript quirk. "typeof null" returns "object" due to a legacy bug in the language.',
        difficulty: 'medium'
      },
      {
        id: 5,
        question: 'Which method is used to add an element to the end of an array?',
        type: 'multiple_choice',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correct: 0,
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.',
        difficulty: 'medium'
      }
    ]
  },
  'react-components': {
    name: 'React Components',
    description: 'Understanding React component lifecycle and patterns',
    questions: [
      {
        id: 1,
        question: 'What is JSX?',
        type: 'multiple_choice',
        options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extended', 'JavaScript Extension'],
        correct: 0,
        explanation: 'JSX stands for JavaScript XML. It allows you to write HTML-like syntax in JavaScript.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'Which hook is used for state management in functional components?',
        type: 'multiple_choice',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correct: 1,
        explanation: 'useState is the primary hook for managing state in functional React components.',
        difficulty: 'medium'
      },
      {
        id: 3,
        question: 'React components must return a single parent element.',
        type: 'true_false',
        options: ['True', 'False'],
        correct: 1,
        explanation: 'False. React components can return multiple elements using React.Fragment or <> </> syntax.',
        difficulty: 'hard'
      }
    ]
  },
  'css-flexbox': {
    name: 'CSS Flexbox',
    description: 'Modern CSS layout techniques with Flexbox',
    questions: [
      {
        id: 1,
        question: 'What does "flex: 1" mean in CSS Flexbox?',
        type: 'multiple_choice',
        options: ['Fixed width of 1px', 'Grow to fill available space', 'Minimum width of 1', 'Maximum of 1 item'],
        correct: 1,
        explanation: 'flex: 1 is shorthand for flex-grow: 1, which makes the item grow to fill available space.',
        difficulty: 'medium'
      },
      {
        id: 2,
        question: 'Is "display: flex" applied to the container or items?',
        type: 'multiple_choice',
        options: ['Container', 'Items', 'Both', 'Neither'],
        correct: 0,
        explanation: 'display: flex is applied to the parent container to create a flex layout for its children.',
        difficulty: 'easy'
      }
    ]
  }
}

export default function LearnSkillPage() {
  const router = useRouter()
  const params = useParams()
  const skillId = params.skillId as string
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeStarted, setTimeStarted] = useState<number>(Date.now())
  const [isComplete, setIsComplete] = useState(false)
  const [masteryLevel, setMasteryLevel] = useState(0.1) // BKT mastery tracking
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])
  const [bktEngine] = useState(new SimpleBKT())
  const [answeredQuestion, setAnsweredQuestion] = useState<typeof currentQuestion | null>(null)


  const adaptiveMode = true

  const skillData = skillQuestions[skillId]
  
  useEffect(() => {
    if (!skillData) {
      router.push('/dashboard')
      return
    }
    setTimeStarted(Date.now())
    
    // Initialize with adaptive question selection
    if (adaptiveMode) {
      const nextQuestion = bktEngine.selectNextQuestion(skillData.questions, masteryLevel, answeredQuestions)
      if (nextQuestion !== -1) {
        setCurrentQuestionIndex(nextQuestion)
      }
    }
  }, [skillId, skillData, router, adaptiveMode, bktEngine, masteryLevel, answeredQuestions])

  if (!skillData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-black mb-4">Skill not found</p>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = skillData.questions[currentQuestionIndex]
  const progress = (answeredQuestions.length / skillData.questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return
    const snapshot = { ...currentQuestion }
    console.log('📌 Submitted:', currentQuestionIndex, currentQuestion)
    console.log('📌 Snapshot stored as answeredQuestion:', snapshot)
    setAnsweredQuestion(snapshot)
    setShowResult(true)
    const isCorrect = selectedAnswer === currentQuestion.correct
    if (isCorrect) {
      setScore(score + 1)
    }
    
    // Update BKT mastery level
    const newMastery = bktEngine.updateMastery(masteryLevel, isCorrect)
    setMasteryLevel(newMastery)
    
    // Track answered question
    setAnsweredQuestions(prev => [...prev, currentQuestionIndex])
    
    setShowResult(true)
  }

  const handleNextQuestion = () => {
    if (adaptiveMode) {
      // Use BKT to select next question
      const nextQuestion = bktEngine.selectNextQuestion(skillData.questions, masteryLevel, answeredQuestions)
      if (nextQuestion !== -1) {
        setCurrentQuestionIndex(nextQuestion)
        setSelectedAnswer(null)
        setShowResult(false)
        setAnsweredQuestion(null)
      } else {
        setIsComplete(true)
      }
    } else {
      // Sequential mode
      if (currentQuestionIndex < skillData.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowResult(false)
        setAnsweredQuestion(null)
      } else {
        setIsComplete(true)
      }
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setIsComplete(false)
    setTimeStarted(Date.now())
    setMasteryLevel(0.1)
    setAnsweredQuestions([])
  }

  const getMasteryLevel = () => {
    if (masteryLevel >= 0.8) return { label: 'Mastered', color: 'text-green-600', bg: 'bg-green-100' }
    if (masteryLevel >= 0.6) return { label: 'Proficient', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (masteryLevel >= 0.4) return { label: 'Developing', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { label: 'Beginner', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getScoreColor = () => {
    const percentage = (score / answeredQuestions.length) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = () => {
    const percentage = (score / answeredQuestions.length) * 100
    if (percentage >= 80) return { text: 'Excellent!', variant: 'default' as const, icon: Trophy }
    if (percentage >= 60) return { text: 'Good Job!', variant: 'secondary' as const, icon: Target }
    return { text: 'Keep Practicing!', variant: 'outline' as const, icon: Brain }
  }

  if (isComplete || bktEngine.isMastered(masteryLevel)) {
    const totalTime = Math.round((Date.now() - timeStarted) / 1000)
    const percentage = answeredQuestions.length > 0 ? (score / answeredQuestions.length) * 100 : 0
    const scoreBadge = getScoreBadge()
    const ScoreIcon = scoreBadge.icon
    const masteryInfo = getMasteryLevel()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="bg-white shadow-xl">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white/20 rounded-full">
                  <ScoreIcon className="h-12 w-12" />
                </div>
              </div>
              <CardTitle className="text-2xl">
                {bktEngine.isMastered(masteryLevel) ? 'Skill Mastered! 🎉' : 'Session Complete!'}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {skillData.name} • BKT Adaptive Learning
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 text-center space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <div className={`text-3xl font-bold ${getScoreColor()}`}>
                    {score}/{answeredQuestions.length}
                  </div>
                  <p className="text-black">Score</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(percentage)}%
                  </div>
                  <p className="text-black">Accuracy</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-600">
                    {totalTime}s
                  </div>
                  <p className="text-black">Time</p>
                </div>
                <div className="space-y-2">
                  <div className={`text-3xl font-bold ${masteryInfo.color}`}>
                    {Math.round(masteryLevel * 100)}%
                  </div>
                  <p className="text-black">BKT Mastery</p>
                </div>
              </div>

              <div className="flex justify-center">
                <Badge variant={scoreBadge.variant} className={`text-lg px-6 py-3 ${masteryInfo.bg} ${masteryInfo.color}`}>
                  <Zap className="h-4 w-4 mr-2" />
                  {masteryInfo.label}
                </Badge>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🧠 BKT Analysis</h4>
                <p className="text-blue-800">
                  {bktEngine.isMastered(masteryLevel) 
                    ? 'Congratulations! Our Bayesian Knowledge Tracing algorithm indicates you have mastered this skill.'
                    : `Your current mastery level is ${Math.round(masteryLevel * 100)}%. The adaptive system selected ${answeredQuestions.length} questions based on your performance.`
                  }
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleRestart}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const masteryInfo = getMasteryLevel()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">{skillData.name}</h1>
              <p className="text-black">{skillData.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline" className={`${masteryInfo.bg} ${masteryInfo.color}`}>
                  <Brain className="h-3 w-3 mr-1" />
                  {masteryInfo.label} ({Math.round(masteryLevel * 100)}%)
                </Badge>

              </div>
              <p className="text-sm text-black">Question {answeredQuestions.length + 1} • Adaptive Mode</p>
              <div className="flex items-center space-x-2 mt-1">
                <Clock className="h-4 w-4 text-black" />
                <span className="text-sm text-black">Score: {score}/{answeredQuestions.length}</span>
              </div>
            </div>
          </div>
          
          <Progress value={progress} className="mt-4" />
        </div>

        <Card className="bg-white shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-black">
                    {(answeredQuestion ?? currentQuestion).question}
                  </CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {(answeredQuestion ?? currentQuestion).difficulty}
                  </Badge>
                </div>
            {(answeredQuestion ?? currentQuestion).type === 'true_false' && (
              <CardDescription className="text-black">
                Select True or False
              </CardDescription>
            )}
            {currentQuestion.type === 'multiple_choice' && (
              <CardDescription className="text-black">
                Choose the best answer
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {(answeredQuestion ?? currentQuestion).options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showResult
                        ? index === answeredQuestion?.correct
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : 'border-red-500 bg-red-50 text-red-800'
                        : 'border-blue-500 bg-blue-50 text-blue-800'
                      : showResult && index === answeredQuestion?.correct
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100 text-black'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showResult && (
                      <>
                        {index === answeredQuestion?.correct && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {selectedAnswer === index && index !== answeredQuestion?.correct && (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Explanation</h4>
                    <p className="text-blue-800 mt-1">{answeredQuestion?.explanation}</p>
                    <div className="mt-2 text-sm text-blue-700">
                      <strong>BKT Update:</strong> Mastery level {selectedAnswer === answeredQuestion?.correct ? 'increased' : 'adjusted'} to {Math.round(masteryLevel * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              {!showResult && (
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Submit Answer
                </Button>
              )}
              {showResult && (
                <Button 
                  onClick={handleNextQuestion}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Next (AI Selected)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}