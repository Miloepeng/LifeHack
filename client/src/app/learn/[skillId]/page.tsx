'use client'
import { DragAndDropQuestion } from '@/components/questions/DragDrop'
import { useState, useEffect,} from 'react'
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
    type: 'multiple_choice' | 'true_false' | 'drag_and_drop'
    topics: string[]
    options: string[]
    correct: number
    explanation: string
    difficulty: 'easy' | 'medium' | 'hard'
    image?: string
  }[]
}

const skillQuestions: Record<string, SkillData> = {
  'math-money-1': {
    name: 'Math: Decimal Notation',
    description: 'Before getting started on money, we would have to learn the decimal notation, read and write in decimal!',
    questions: [
      {
        id: 1,
        question: 'Which of the following is a decimal number?',
        type: 'multiple_choice',
        topics: ['Read and write in decimal', 'Decimal Notation'],
        options: ['3', '0', '120', '1.2'],
        correct: 3,
        explanation: 'Decimal numbers are numbers that have a dot (we call them a decimal point) in them.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'Which of the following is a decimal number?',
        type: 'multiple_choice',
        topics: ['Read and write in decimal', 'Decimal Notation'],
        options: ['7', '7.0', '23', '230'],
        correct: 1,
        explanation: 'Decimal numbers are numbers that have a dot (we call them a decimal point) in them.',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: 'Which of these are forty-four point thirty-one?',
        type: 'multiple_choice',
        topics: ['Read and write in decimal', 'Decimal Notation'],
        options: ['44.31', '443.1', '4431', '4.431'],
        correct: 0,
        explanation: 'Forty-four is 44, the point represents the decimal point and thirty-one is 31.',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: '0.3 is bigger than 0.5. True or False?',
        type: 'true_false',
        topics: ['Decimal Notation'],
        options: ['True', 'False'],
        correct: 1,
        explanation: '0.5 is bigger than 0.3, if you have 0.5 of a pizza, you have half the pizza. If you have 0.3 of a pizza, you would have a third of the pizza.',
        difficulty: 'medium'
      },
      {
        id: 5,
        question: '0.45 is smaller than 0.54',
        type: 'true_false',
        topics: ['Decimal Notation'],
        options: ['True', 'False'],
        correct: 0,
        explanation: 'If we have a cake of 100 slices, 0.45 means you get 45 slices and 0.54 means you get 54 slices. 45 slices of cake is less than 54 slices of cake.',
        difficulty: 'medium'
      },
      {
        id: 6,
        question: '1.5 - 0.7 = ?',
        type: 'multiple_choice',
        topics: ['Decimal Notation'],
        options: ['2.4', '0.8', '0.7', '0.75'],
        correct: 1,
        explanation: '1.5 - 0.7 = 0.8',
        difficulty: 'hard'
      },
    ]
  },
  'math-money-2': {
    name: 'Math: Counting Money',
    description: 'Learn recognise coins and notes, and count them!',
    questions: [
      {
        id: 1,
        question: 'What is the coin below?',
        type: 'multiple_choice',
        topics: ['Recognising coins/notes'],
        options: ['10 cent coin', '20 cent coin', '30 cent coin', '50 cent coin'],
        correct: 1,
        explanation: 'It is a 20 cents coin! You can tell by the number 20 on the coin.',
        difficulty: 'easy',
        image: '/images/math-money-2-q1.png'
      },
      {
        id: 2,
        question: 'What is below?',
        type: 'multiple_choice',
        topics: ['Recognising coins/notes'],
        options: ['50 cent coin', '2 dollar note', '1 dollar coin', '10 dollar note'],
        correct: 3,
        explanation: 'You can tell that it is a 10 dollar note as it is a rectangle and there is a 10 on it!',
        difficulty: 'easy',
        image: '/images/math-money-2-q2.png'
      },
      {
        id: 3,
        question: 'How much is $3 in cents?',
        type: 'multiple_choice',
        topics: ['Counting Simple Amounts'],
        options: ['30¢', '3¢', '300¢', '3000¢'],
        correct: 2,
        explanation: '1 dollar is made out of 100 cents. So if we have 3 dollars, \
          it is made out of 3 x 100 cents which is 300 cents.',
        difficulty: 'easy'
      },
      {
        id: 4,
        question: 'How much is shown below?',
        type: 'multiple_choice',
        topics: ['Recognising coins/notes', 'Counting Simple Amounts'],
        options: ['$1.30', '$1.40', '$1.10', '$0.90'],
        correct: 0,
        explanation: 'There is one 50 cent coin, two 20 cent coins and four 10 cent coins. \
          In total it will be $0.50 + 2 x $0.20 + 4 x $0.10 = $1.30.',
        difficulty: 'easy',
        image: '/images/math-money-2-q4.png'
      },
      {
        id: 5,
        question: 'How much is shown below?',
        type: 'multiple_choice',
        topics: ['Recognising coins/notes', 'Counting Simple Amounts'],
        options: ['$49.80', '$57.80', "$530.80", '$53.80'],
        correct: 3,
        explanation: 'There are four 10 dollar notes, six 2 dollar notes, one 1 dollar coin, \
        three 20 cent coins and two 10 cent coins. In total it will be 4 x $10 + 6 x $2 + $1 + \
        3 x $0.20 + 2 x $0.10 = $53.80.',
        difficulty: 'medium',
        image: '/images/math-money-2-q5.png'
      },
      {
        id: 6,
        question: 'How much is shown below? Answer in cents.',
        type: 'multiple_choice',
        topics: ['Recognising coins/notes', 'Counting Simple Amounts'],
        options: ['45.45¢', '4545¢', '41.85¢', '4185¢'],
        correct: 3,
        explanation: 'There are two 10 dollar notes, three 5 dollar notes, two 2 dollar notes, \
        two 1 dollar coins, two 20 cent coins, two 10 cent coins and one 5 cent coin. Together, \
        they will total to be 2 x $10 + 3 x $5 + 2 x $2 + 2 x $1 + 2 x $0.20 + 2 x $0.10 + 1 x $0.05 \
        = $41.85. Then you can convert $41.85 to 4185¢.',
        difficulty: 'hard',
        image: '/images/math-money-2-q6.png'
      },
      {
        id: 7,
        question: 'Match each piggy bank to the correct amount.',
        type: 'drag_and_drop',
        topics: ['Matching', 'Counting'],
        options: ['$1', '$0.50', '$2'],
        correct: -1, // not used
        explanation: 'Each piggy bank has its correct value: A → $1, B → $0.50, C → $2.',
        difficulty: 'medium'
      }
    ]
  },
  'math-money 3': {
    name: 'Math: Money & Real World Problems',
    description: 'Now that you are so capable at counting money, lets compare multiple amounts and see some real world examples!',
    questions: [
      {
        id: 1,
        question: 'If Alex has $3.00 and each curry puff costs $1.00, how many curry puffs can Alex buy?',
        type: 'multiple_choice',
        topics: ['Problem Solving', 'Comparing multiple amounts', 'Real World Context'],
        options: ['2', '3', '4', '5'],
        correct: 1,
        explanation: 'Each curry puff costs $1.00. If Alex has three $1 coins, he can give one coin for one curry puff, in total giving him 3 curry puffs.',
        difficulty: 'easy'
      },
      {
        id: 2,
        question: 'A highlighter costs $2.20. An eraser costs $0.45. What is the total cost of a highlighter and an eraser?',
        type: 'multiple_choice',
        topics: ['Comparing multiple amounts', 'Real World Context'],
        options: ['$2.55', '$2.60', '$2.65', '$2.70'],
        correct: 2,
        explanation: 'For one highlighter and one eraser, it will cost $2.20 + $0.45 = $2.65',
        difficulty: 'easy'
      },
      {
        id: 3,
        question: '$3.40 + $2.20 + ? = $10',
        type: 'multiple_choice',
        topics: ['Problem Solving', 'Comparing multiple amounts'],
        options: ['$4.40', '$3.40', '$5.40', '$6.40'],
        correct: 0,
        explanation: '$3.40 + $2.20 is $5.60. ? is an amount of money that when added to $5.60 makes $10. So $10 - $5.60 = $4.40',
        difficulty: 'medium'
      },
      {
        id: 4,
        question: 'Ted saved $124 each month. Tom saved 3 times as much as John each month. How much would Tom save in 6 months?',
        type: 'multiple_choice',
        topics: ['Problem Solving', 'Comparing multiple amounts', 'Real World Context'],
        options: ['$264', '$372', '$2232', '$2976'],
        correct: 2,
        explanation: 'Tom saves 3 x $124 = $372 each month. In 6 months, he will save $372 x 6 = $2232',
        difficulty: 'hard'
      },
      {
        id: 5,
        question: 'At the bookshop, erasers were sold for 65¢ each. Jason had 4 two-dollar notes in her wallet. How much money would Jason have left after buying 10 such erasers?',
        type: 'multiple_choice',
        topics: ['Problem Solving', 'Comparing multiple amounts', 'Real World Context'],
        options: ['$1.00', '$2.00', '$1.50', '$2.50'],
        correct: 2,
        explanation: 'Jason has 4 x $2 = $8. Jason bought 10 erasers, which costs him 10 x 65¢ = $6.50. Hence he will have $8 - $6.50 = $1.50 left.',
        difficulty: 'hard'
      },
      {
        id: 6,
        question: 'Timmy wants to buy the new Lego City set which costs $210.45. Timmy only has three 50-dollar notes, four 10-dollar notes and eight 20-cent coins. How much more does Timmy need to buy the Lego City set?',
        type: 'multiple_choice',
        topics: ['Problem Solving', 'Comparing multiple amounts', 'Real World Context'],
        options: ['$14.55', '$14.85', '$18.55', '$18.85'],
        correct: 0,
        explanation: 'Timmy has 3 x $50 + 4 x $10 + 6 x $0.20 = $191.60. To buy the Lego City set, he would need $210.45 - $191.60 = $18.85',
        difficulty: 'hard'
      },
    ]
  }
}

export default function LearnSkillPage() {
  const router = useRouter()
  const params = useParams()
  const skillId = params.skillId as string
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeStarted, setTimeStarted] = useState<number>(Date.now())
  const [isComplete, setIsComplete] = useState(false)
  const [masteryLevel, setMasteryLevel] = useState(0.1) // BKT mastery tracking
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])
  const [bktEngine] = useState(new SimpleBKT())
  const [answeredQuestion, setAnsweredQuestion] = useState<SkillData['questions'][number] | null>(null)
  const [questionReady, setQuestionReady] = useState(false)
  const [questionLoaded, setQuestionLoaded] = useState(false)


  const adaptiveMode = true

  const skillData = skillQuestions[skillId]
  
  useEffect(() => {
  if (!skillData) {
    router.push('/dashboard')
    return
  }

  setTimeStarted(Date.now())

  if (adaptiveMode) {
    const nextQuestion = bktEngine.selectNextQuestion(skillData.questions, 0.1, [])
    if (nextQuestion !== -1) {
      setCurrentQuestionIndex(nextQuestion)
    }
  } else {
    setCurrentQuestionIndex(0)
  }
}, [skillId]) // Only depend on skillId


  useEffect(() => {
  if (currentQuestionIndex !== null) {
    setQuestionLoaded(true);
  }
}, [currentQuestionIndex]);

  if (!skillData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center text-black">
          <p className="mb-4">Skill not found</p>
          <Button className="text-gray-600 hover:bg-gray-200" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }
  if (!questionLoaded || currentQuestionIndex === null) return null


  if (currentQuestionIndex === null) return null;
  const currentQuestion = skillData.questions[currentQuestionIndex];




  const progress = (answeredQuestions.length / skillData.questions.length) * 100

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const handleSubmitAnswer = () => {
  if (!questionLoaded || currentQuestionIndex === null || selectedAnswer === null) return;



  if (!currentQuestion) return;
const snapshot = { ...currentQuestion };

  const isCorrect = selectedAnswer === snapshot.correct;

  setAnsweredQuestion(snapshot); // ✅ Set the snapshot
  setScore(prev => (isCorrect ? prev + 1 : prev)); // ✅ Score if correct

  // BKT update
  const newMastery = bktEngine.updateMastery(masteryLevel, isCorrect);
  setMasteryLevel(newMastery);

  setAnsweredQuestions(prev => [...prev, currentQuestionIndex]);

  // ✅ Defer showResult until after answeredQuestion is set
  setTimeout(() => {
    setShowResult(true);
  }, 0);
};

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
      if (currentQuestionIndex === null) return null;
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
    setAnsweredQuestion(null) 
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

  if (isComplete || (bktEngine.isMastered(masteryLevel) && answeredQuestions.length >= 5)) {
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
              className="text-gray-600 hover:bg-gray-200 mb-4"
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
                  className="text-gray-600 hover:bg-gray-200"
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
            className="text-gray-600 mb-4 hover:bg-gray-200"
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
                  <Badge variant="outline" className={`ml-2 ${
                    (answeredQuestion ?? currentQuestion).difficulty === 'easy' ? 'text-green-400' :
                    (answeredQuestion ?? currentQuestion).difficulty === 'medium' ? 'text-yellow-500' : 'text-red-400'}`}>
                    {(answeredQuestion ?? currentQuestion).difficulty}
                  </Badge>
                </div>
                
            {(answeredQuestion ?? currentQuestion).image && (
            <div className="flex justify-center mt-4">
            <img
            src={(answeredQuestion ?? currentQuestion).image}
            alt="Coin shown"
            className="h-85 object-contain"
            />
            </div>
            )}

            {(answeredQuestion ?? currentQuestion).type === 'true_false' && (
              <CardDescription className="text-black">
                Select True or False
              </CardDescription>
            )}
            {(answeredQuestion ?? currentQuestion).type === 'multiple_choice' && (
              <CardDescription className="text-black">
                Choose the best answer
              </CardDescription>
            )}
            {(answeredQuestion ?? currentQuestion).type === 'drag_and_drop' && (
              <CardDescription className="text-black">
                Drag and drop the tiles!
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {(answeredQuestion ?? currentQuestion).type === 'drag_and_drop' ? (
              <DragAndDropQuestion
                pairs={[
                  { target: 'Piggy Bank A', correct: '$1' },
                  { target: 'Piggy Bank B', correct: '$0.50' },
                  { target: 'Piggy Bank C', correct: '$2' }
                ]}
                options={(answeredQuestion ?? currentQuestion).options}
                onAnswer={(assignments, isCorrect) => {
                  const snapshot = { ...currentQuestion }
                  setAnsweredQuestion(snapshot)
                  if (isCorrect) setScore(prev => prev + 1)
                  const newMastery = bktEngine.updateMastery(masteryLevel, isCorrect)
                  setMasteryLevel(newMastery)
                  setAnsweredQuestions(prev => [...prev, currentQuestionIndex!])
                  setShowResult(true)
                }}
                onNext={handleNextQuestion}
                showNext={showResult}
                disabled={showResult}
              />
              ) : (
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
              )}

            {showResult && answeredQuestion && (
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

            {(answeredQuestion ?? currentQuestion).type !== 'drag_and_drop' && (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}