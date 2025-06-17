'use client'

import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Eye,
  UserCheck,
  Clock,
  BarChart3,
  GraduationCap
} from 'lucide-react'

// Mock data for teacher dashboard
const mockStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    totalSkills: 4,
    masteredSkills: 2,
    averageMastery: 0.72,
    lastActive: '2024-01-15'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    totalSkills: 3,
    masteredSkills: 1,
    averageMastery: 0.58,
    lastActive: '2024-01-14'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    totalSkills: 5,
    masteredSkills: 4,
    averageMastery: 0.89,
    lastActive: '2024-01-16'
  }
]

const mockSkills = [
  {
    id: '1',
    name: 'JavaScript Fundamentals',
    studentsEnrolled: 3,
    averageMastery: 0.73,
    questionsAnswered: 45
  },
  {
    id: '2',
    name: 'React Components',
    studentsEnrolled: 2,
    averageMastery: 0.61,
    questionsAnswered: 28
  },
  {
    id: '3',
    name: 'TypeScript Basics',
    studentsEnrolled: 1,
    averageMastery: 0.34,
    questionsAnswered: 12
  }
]

export default function TeacherDashboard() {
  const { user } = useAuth()

  const overallStats = {
    totalStudents: mockStudents.length,
    activeStudents: mockStudents.filter(s => new Date(s.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length,
    totalSkills: mockSkills.length,
    averageClassMastery: mockStudents.reduce((sum, student) => sum + student.averageMastery, 0) / mockStudents.length
  }

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 0.8) return 'text-green-600 bg-green-100'
    if (mastery >= 0.6) return 'text-blue-600 bg-blue-100'
    if (mastery >= 0.4) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getMasteryLabel = (mastery: number) => {
    if (mastery >= 0.8) return 'Excellent'
    if (mastery >= 0.6) return 'Good'
    if (mastery >= 0.4) return 'Fair'
    return 'Needs Help'
  }

  return (
    <ProtectedRoute requiredRole="teacher">
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl shadow-xl">
                <GraduationCap className="h-12 w-12 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Welcome, {user?.user_metadata?.full_name || 'Teacher'}!
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                Monitor student progress and guide their learning journey
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{overallStats.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <UserCheck className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Students</p>
                    <p className="text-2xl font-bold text-gray-900">{overallStats.activeStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Skills Available</p>
                    <p className="text-2xl font-bold text-gray-900">{overallStats.totalSkills}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Class Average</p>
                    <p className="text-2xl font-bold text-gray-900">{Math.round(overallStats.averageClassMastery * 100)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Progress */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Student Progress</span>
                </CardTitle>
                <CardDescription>
                  Monitor individual student performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockStudents.map((student) => (
                  <div key={student.id} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <Badge className={getMasteryColor(student.averageMastery)}>
                        {getMasteryLabel(student.averageMastery)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Skills</p>
                        <p className="font-medium">{student.totalSkills}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Mastered</p>
                        <p className="font-medium">{student.masteredSkills}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Average</p>
                        <p className="font-medium">{Math.round(student.averageMastery * 100)}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>Last active: {new Date(student.lastActive).toLocaleDateString()}</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span>Skills Overview</span>
                </CardTitle>
                <CardDescription>
                  Track skill performance across all students
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockSkills.map((skill) => (
                  <div key={skill.id} className="p-4 border border-gray-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                        <p className="text-sm text-gray-600">{skill.studentsEnrolled} students enrolled</p>
                      </div>
                      <Badge className={getMasteryColor(skill.averageMastery)}>
                        {Math.round(skill.averageMastery * 100)}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Students</p>
                        <p className="font-medium">{skill.studentsEnrolled}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Questions</p>
                        <p className="font-medium">{skill.questionsAnswered}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <Button size="sm" variant="outline" className="w-full">
                        Manage Skill
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Manage Skills</h3>
                    <p className="text-sm opacity-90">Add or edit learning skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">View Students</h3>
                    <p className="text-sm opacity-90">Monitor student progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Analytics</h3>
                    <p className="text-sm opacity-90">View detailed reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 