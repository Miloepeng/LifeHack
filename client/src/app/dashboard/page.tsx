'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Users, BookOpen, Target, TrendingUp, Clock, Play, ChevronRight } from 'lucide-react'

export default function DashboardPage() {
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const router = useRouter()

  const StudentDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Skills Mastered</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">12</div>
            <p className="text-xs text-blue-800">+2 from last week</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Study Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">7 days</div>
            <p className="text-xs text-green-800">Keep it up!</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Time Studied</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">45h</div>
            <p className="text-xs text-purple-800">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>Recommended Skills</span>
            </CardTitle>
            <CardDescription className="text-black">AI-powered learning recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'JavaScript Fundamentals', mastery: 0.7, priority: 'High', skillId: 'js-fundamentals' },
              { name: 'React Components', mastery: 0.4, priority: 'Medium', skillId: 'react-components' },
              { name: 'CSS Flexbox', mastery: 0.2, priority: 'Low', skillId: 'css-flexbox' }
            ].map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <Badge variant={skill.priority === 'High' ? 'destructive' : skill.priority === 'Medium' ? 'default' : 'secondary'}>
                      {skill.priority}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${skill.mastery * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black">{Math.round(skill.mastery * 100)}% mastered</span>
                    <Button 
                      size="sm" 
                      onClick={() => router.push(`/learn/${skill.skillId}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Practice
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription className="text-black">Your learning progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { skill: 'JavaScript Fundamentals', action: 'Completed 5 questions', time: '2 hours ago' },
              { skill: 'React Components', action: 'Started new skill', time: '1 day ago' },
              { skill: 'CSS Flexbox', action: 'Mastery improved', time: '2 days ago' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                                  <div className="flex-1">
                    <p className="font-medium text-black">{activity.skill}</p>
                    <p className="text-sm text-black">{activity.action}</p>
                    <p className="text-xs text-black">{activity.time}</p>
                  </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Start Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-white">Ready to Learn?</CardTitle>
          <CardDescription className="text-blue-100">Jump into practice questions and improve your skills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="secondary" 
              onClick={() => router.push('/learn/js-fundamentals')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              Start JavaScript Quiz
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/learn/react-components')}
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Practice React
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
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
            <p className="text-black">AI-Powered Adaptive Learning System</p>
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