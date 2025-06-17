'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Play, 
  ChevronRight,
  Trophy,
  Flame,
  Brain,
  Zap,
  BarChart3,
  Award,
  Star,
  Timer,
  Activity
} from 'lucide-react'

// Advanced learning analytics
interface LearningSession {
  date: string
  skillsStudied: number
  questionsAnswered: number
  accuracy: number
  timeSpent: number
  masteryGained: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  unlocked: boolean
  progress: number
  maxProgress: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface SkillProgress {
  skillId: string
  name: string
  currentLevel: number
  masteryPercentage: number
  questionsAnswered: number
  averageAccuracy: number
  timeSpent: number
  streak: number
  lastStudied: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  trend: 'improving' | 'stable' | 'declining'
}

// Mock advanced data
const mockLearningData = {
  currentStreak: 7,
  longestStreak: 12,
  totalStudyTime: 2847, // minutes
  weeklyGoal: 300, // minutes
  weeklyProgress: 245,
  level: 15,
  xp: 2847,
  nextLevelXp: 3000,
  
  recentSessions: [
    { date: '2024-01-15', skillsStudied: 3, questionsAnswered: 15, accuracy: 87, timeSpent: 45, masteryGained: 12 },
    { date: '2024-01-14', skillsStudied: 2, questionsAnswied: 12, accuracy: 92, timeSpent: 38, masteryGained: 8 },
    { date: '2024-01-13', skillsStudied: 4, questionsAnswered: 20, accuracy: 78, timeSpent: 52, masteryGained: 15 },
    { date: '2024-01-12', skillsStudied: 1, questionsAnswered: 8, accuracy: 95, timeSpent: 25, masteryGained: 6 },
    { date: '2024-01-11', skillsStudied: 3, questionsAnswered: 18, accuracy: 83, timeSpent: 41, masteryGained: 11 },
  ] as LearningSession[],

  achievements: [
    { id: 'first_question', title: 'First Steps', description: 'Answer your first question', icon: Star, unlocked: true, progress: 1, maxProgress: 1, rarity: 'common' },
    { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day study streak', icon: Flame, unlocked: true, progress: 7, maxProgress: 7, rarity: 'rare' },
    { id: 'accuracy_90', title: 'Precision Master', description: 'Achieve 90%+ accuracy in a session', icon: Target, unlocked: true, progress: 92, maxProgress: 90, rarity: 'epic' },
    { id: 'questions_100', title: 'Century Club', description: 'Answer 100 questions', icon: Trophy, unlocked: false, progress: 73, maxProgress: 100, rarity: 'rare' },
    { id: 'mastery_skill', title: 'Skill Mastery', description: 'Fully master a skill (80%+)', icon: Brain, unlocked: false, progress: 67, maxProgress: 80, rarity: 'epic' },
    { id: 'speed_demon', title: 'Speed Demon', description: 'Answer 20 questions in under 10 minutes', icon: Zap, unlocked: false, progress: 0, maxProgress: 1, rarity: 'legendary' }
  ] as Achievement[],

  skillProgress: [
    { skillId: 'js-fundamentals', name: 'JavaScript Fundamentals', currentLevel: 3, masteryPercentage: 67, questionsAnswered: 23, averageAccuracy: 87, timeSpent: 145, streak: 3, lastStudied: '2024-01-15', difficulty: 'beginner', trend: 'improving' },
    { skillId: 'react-components', name: 'React Components', currentLevel: 2, masteryPercentage: 45, questionsAnswered: 15, averageAccuracy: 82, timeSpent: 98, streak: 2, lastStudied: '2024-01-14', difficulty: 'intermediate', trend: 'improving' },
    { skillId: 'css-flexbox', name: 'CSS Flexbox', currentLevel: 1, masteryPercentage: 23, questionsAnswered: 8, averageAccuracy: 75, timeSpent: 67, streak: 1, lastStudied: '2024-01-13', difficulty: 'beginner', trend: 'stable' }
  ] as SkillProgress[]
}

export default function DashboardPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'achievements'>('overview')
  const router = useRouter()

  const StudentDashboard = () => (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('overview')}
          className="flex-1"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('analytics')}
          className="flex-1"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </Button>
        <Button
          variant={activeTab === 'achievements' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('achievements')}
          className="flex-1"
        >
          <Award className="h-4 w-4 mr-2" />
          Achievements
        </Button>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Enhanced Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Current Level</CardTitle>
                <Star className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{mockLearningData.level}</div>
                <Progress value={(mockLearningData.xp / mockLearningData.nextLevelXp) * 100} className="mt-2" />
                <p className="text-xs text-blue-800 mt-1">{mockLearningData.xp}/{mockLearningData.nextLevelXp} XP</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Study Streak</CardTitle>
                <Flame className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{mockLearningData.currentStreak} days</div>
                <p className="text-xs text-orange-800">Best: {mockLearningData.longestStreak} days</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Weekly Goal</CardTitle>
                <Timer className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{Math.round((mockLearningData.weeklyProgress / mockLearningData.weeklyGoal) * 100)}%</div>
                <Progress value={(mockLearningData.weeklyProgress / mockLearningData.weeklyGoal) * 100} className="mt-2" />
                <p className="text-xs text-green-800 mt-1">{mockLearningData.weeklyProgress}/{mockLearningData.weeklyGoal} min</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Total Study Time</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{Math.round(mockLearningData.totalStudyTime / 60)}h</div>
                <p className="text-xs text-purple-800">{mockLearningData.totalStudyTime} minutes total</p>
              </CardContent>
            </Card>
          </div>

          {/* Skills with Advanced Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>Skill Progress</span>
                </CardTitle>
                <CardDescription className="text-black">Advanced mastery tracking with BKT</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockLearningData.skillProgress.map((skill, index) => (
                  <div key={index} className="space-y-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          skill.trend === 'improving' ? 'bg-green-500' : 
                          skill.trend === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <span className="font-medium text-black">{skill.name}</span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Level {skill.currentLevel}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {skill.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          <span className="text-sm text-black">{skill.streak}</span>
                        </div>
                        <span className="text-xs text-black">{skill.averageAccuracy}% accuracy</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-black">Mastery Progress</span>
                        <span className="text-black">{skill.masteryPercentage}%</span>
                      </div>
                      <Progress value={skill.masteryPercentage} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-black">
                      <span>{skill.questionsAnswered} questions • {Math.round(skill.timeSpent / 60)}h studied</span>
                      <Button 
                        size="sm" 
                        onClick={() => router.push(`/learn/${skill.skillId}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-8"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription className="text-black">Your learning journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockLearningData.recentSessions.map((session, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-black">{session.date}</p>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs">
                            {session.accuracy}% accuracy
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            +{session.masteryGained}% mastery
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-black">
                        {session.questionsAnswered} questions across {session.skillsStudied} skills
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-black">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.timeSpent} min
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{session.masteryGained}% mastery
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Start Section */}
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader>
              <CardTitle className="text-white">Ready to Level Up?</CardTitle>
              <CardDescription className="text-blue-100">Continue your learning journey with AI-powered adaptive questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => router.push('/learn/js-fundamentals')}
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Continue JavaScript
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/learn/react-components')}
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Master React
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Learning Analytics</span>
              </CardTitle>
              <CardDescription className="text-black">Detailed performance insights powered by BKT</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Weekly Performance Chart */}
              <div className="space-y-4">
                <h4 className="font-semibold text-black">Weekly Performance</h4>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                    <div key={day} className="text-center">
                      <div className="text-xs text-black mb-1">{day}</div>
                      <div className={`h-16 rounded ${
                        index < 5 ? 'bg-blue-500' : 'bg-gray-200'
                      } flex items-end justify-center`}>
                        <div className={`w-full rounded ${
                          index < 5 ? 'bg-blue-600' : 'bg-gray-300'
                        }`} style={{ height: `${Math.random() * 80 + 20}%` }} />
                      </div>
                      <div className="text-xs text-black mt-1">
                        {index < 5 ? Math.floor(Math.random() * 60 + 20) : 0}min
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mastery Trends */}
              <div className="space-y-4">
                <h4 className="font-semibold text-black">Mastery Progression</h4>
                <div className="space-y-3">
                  {mockLearningData.skillProgress.map((skill, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-black">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <Activity className={`h-4 w-4 ${
                            skill.trend === 'improving' ? 'text-green-500' : 
                            skill.trend === 'declining' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                          <span className="text-sm text-black">{skill.trend}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-black">Mastery</div>
                          <div className="font-semibold text-black">{skill.masteryPercentage}%</div>
                        </div>
                        <div>
                          <div className="text-black">Accuracy</div>
                          <div className="font-semibold text-black">{skill.averageAccuracy}%</div>
                        </div>
                        <div>
                          <div className="text-black">Questions</div>
                          <div className="font-semibold text-black">{skill.questionsAnswered}</div>
                        </div>
                        <div>
                          <div className="text-black">Time</div>
                          <div className="font-semibold text-black">{Math.round(skill.timeSpent / 60)}h</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Achievements</span>
              </CardTitle>
              <CardDescription className="text-black">Unlock rewards as you progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockLearningData.achievements.map((achievement, index) => {
                  const Icon = achievement.icon
                  return (
                    <div key={index} className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked 
                        ? 'border-yellow-300 bg-yellow-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          achievement.unlocked 
                            ? 'bg-yellow-200 text-yellow-800' 
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className={`font-semibold ${
                              achievement.unlocked ? 'text-black' : 'text-black'
                            }`}>
                              {achievement.title}
                            </h4>
                            <Badge variant={
                              achievement.rarity === 'legendary' ? 'destructive' :
                              achievement.rarity === 'epic' ? 'default' :
                              achievement.rarity === 'rare' ? 'secondary' : 'outline'
                            } className="text-xs">
                              {achievement.rarity}
                            </Badge>
                          </div>
                          <p className={`text-sm ${
                            achievement.unlocked ? 'text-black' : 'text-black'
                          }`}>
                            {achievement.description}
                          </p>
                          {!achievement.unlocked && (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-black mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                          {achievement.unlocked && (
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                ✓ Unlocked
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )

  const TeacherDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">156</div>
            <p className="text-xs text-blue-800">+12 this month</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Active Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">89</div>
            <p className="text-xs text-green-800">57% of students</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Avg. Progress</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">73%</div>
            <p className="text-xs text-purple-800">+5% this week</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Skills Created</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">24</div>
            <p className="text-xs text-orange-800">Across 7 subjects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription className="text-black">Top performing students this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Alice Johnson', skills: 8, progress: 92 },
              { name: 'Bob Smith', skills: 6, progress: 87 },
              { name: 'Carol Davis', skills: 7, progress: 84 }
            ].map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-black">{student.name}</p>
                    <p className="text-sm text-black">{student.skills} skills mastered</p>
                  </div>
                </div>
                <Badge variant="secondary">{student.progress}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="text-black">Classroom updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { event: 'New skill "Advanced React" created', time: '1 hour ago' },
              { event: '15 students completed JavaScript quiz', time: '3 hours ago' },
              { event: 'Updated CSS Flexbox questions', time: '1 day ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-black">{activity.event}</p>
                  <p className="text-xs text-black">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Role Switcher */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">Learning Platform</h1>
            <p className="text-black">AI-Powered Adaptive Learning System with Advanced Analytics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-black">View as:</span>
            <div className="flex bg-white rounded-lg p-1 shadow-md">
              <Button
                variant={role === 'student' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRole('student')}
                className={`flex items-center space-x-2 ${
                  role === 'student' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-black hover:text-gray-900'
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                <span>Student</span>
              </Button>
              <Button
                variant={role === 'teacher' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setRole('teacher')}
                className={`flex items-center space-x-2 ${
                  role === 'teacher' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-black hover:text-gray-900'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Teacher</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {role === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
      </div>
    </div>
  )
} 