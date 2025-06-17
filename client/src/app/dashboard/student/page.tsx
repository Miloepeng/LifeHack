'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { bktEngine } from '@/lib/bkt'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  BookOpen, 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Star,
  ChevronRight,
  Lightbulb,
  Award,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

interface SkillState {
  user_id: string
  skill_id: string
  estimated_mastery: number
  opportunity: number
  last_updated: string
  skills?: {
    name: string
    description: string
  }
}

interface LearningRecommendation {
  skillId: string
  skillName: string
  mastery: number
  recommendation: string
  priority: 'high' | 'medium' | 'low'
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [skillStates, setSkillStates] = useState<SkillState[]>([])
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSkills: 0,
    masteredSkills: 0,
    averageMastery: 0,
    totalQuestions: 0
  })

  useEffect(() => {
    if (user?.id) {
      loadDashboardData()
    }
  }, [user?.id])

  const loadDashboardData = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      
      // Load skill states and recommendations in parallel
      const [skillStatesData, recommendationsData] = await Promise.all([
        bktEngine.getStudentSkillStates(user.id).catch(() => []),
        bktEngine.getLearningRecommendations(user.id).catch(() => [])
      ])

      setSkillStates(skillStatesData)
      setRecommendations(recommendationsData)

      // Calculate stats
      const totalSkills = skillStatesData.length
      const masteredSkills = skillStatesData.filter(skill => skill.estimated_mastery >= 0.8).length
      const averageMastery = totalSkills > 0 
        ? skillStatesData.reduce((sum, skill) => sum + skill.estimated_mastery, 0) / totalSkills 
        : 0
      const totalQuestions = skillStatesData.reduce((sum, skill) => sum + skill.opportunity, 0)

      setStats({
        totalSkills,
        masteredSkills,
        averageMastery,
        totalQuestions
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Set empty data on error
      setSkillStates([])
      setRecommendations([])
      setStats({
        totalSkills: 0,
        masteredSkills: 0,
        averageMastery: 0,
        totalQuestions: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 0.8) return 'text-green-600 bg-green-100'
    if (mastery >= 0.6) return 'text-blue-600 bg-blue-100'
    if (mastery >= 0.4) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 0.8) return 'Mastered'
    if (mastery >= 0.6) return 'Proficient'
    if (mastery >= 0.4) return 'Developing'
    return 'Beginner'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xl font-semibold text-gray-700">Loading your learning journey...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Learning Dashboard
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Track your progress and discover personalized learning paths
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Skills</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSkills}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Mastered Skills</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.masteredSkills}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Mastery</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(stats.averageMastery * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Recommendations */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AI Recommendations</CardTitle>
                    <CardDescription>Personalized learning suggestions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                                 {recommendations.length > 0 ? (
                   recommendations.slice(0, 5).map((rec) => (
                    <div key={rec.skillId} className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900">{rec.skillName}</h4>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(rec.priority)}`} />
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(rec.mastery * 100)}%
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{rec.recommendation}</p>
                      <Link href={`/learn/${rec.skillId}`}>
                        <Button size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          Start Learning
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Complete some questions to get personalized recommendations!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Skills Progress */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Skills Progress</CardTitle>
                    <CardDescription>Your mastery levels across different skills</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillStates.length > 0 ? (
                  skillStates.map((skill) => (
                    <div key={skill.skill_id} className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-gray-900">
                            {skill.skills?.name || 'Unknown Skill'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {skill.skills?.description || 'No description available'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getMasteryColor(skill.estimated_mastery)}>
                            {getMasteryLabel(skill.estimated_mastery)}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {Math.round(skill.estimated_mastery * 100)}%
                            </p>
                            <p className="text-xs text-gray-500">
                              {skill.opportunity} attempts
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Progress 
                          value={skill.estimated_mastery * 100} 
                          className="h-3"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              Last updated: {new Date(skill.last_updated).toLocaleDateString()}
                            </span>
                          </div>
                          <Link href={`/learn/${skill.skill_id}`}>
                            <Button size="sm" variant="outline" className="hover:bg-blue-50">
                              Practice
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      {skill !== skillStates[skillStates.length - 1] && (
                        <Separator className="mt-6" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Start Your Learning Journey
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Begin practicing questions to see your progress and get personalized recommendations
                    </p>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Star className="h-4 w-4 mr-2" />
                      Explore Skills
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 