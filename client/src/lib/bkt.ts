import { supabase } from '@/lib/supabase'

// Bayesian Knowledge Tracing (BKT) Implementation
// Based on the pyBKT library concepts adapted for JavaScript/TypeScript

export interface BKTParameters {
  prior_knowledge: number  // P(L0) - Initial probability of knowing the skill
  learn_rate: number      // P(T) - Probability of learning when given the opportunity
  guess_rate: number      // P(G) - Probability of guessing correctly when not knowing
  slip_rate: number       // P(S) - Probability of making an error when knowing
}

export interface StudentState {
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

export interface TrainingRecord {
  user_id: string
  skill_id: string
  question_id: string
  correct: boolean
  opportunity: number
  response_time_seconds?: number
}

export interface Question {
  id: string
  skill_id: string
  question_text: string
  question_type: string
  options?: string[]
  correct_answer: string
  difficulty: string
  estimated_time_seconds?: number
}

export class BayesianKnowledgeTracing {
  private defaultParams: BKTParameters = {
    prior_knowledge: 0.1,
    learn_rate: 0.15,
    guess_rate: 0.25,
    slip_rate: 0.1
  }

  /**
   * Update student's mastery probability using BKT after answering a question
   */
  updateMastery(
    currentMastery: number,
    isCorrect: boolean,
    params: BKTParameters = this.defaultParams
  ): number {
    const { guess_rate, slip_rate, learn_rate } = params

    // Bayesian update based on student response
    let updatedMastery: number

    if (isCorrect) {
      // P(L_t | correct) = P(correct | L_t) * P(L_t) / P(correct)
      // P(correct | L_t) = (1 - slip_rate) if knowing, guess_rate if not knowing
      const evidenceCorrect = currentMastery * (1 - slip_rate) + (1 - currentMastery) * guess_rate
      updatedMastery = (currentMastery * (1 - slip_rate)) / evidenceCorrect
    } else {
      // P(L_t | incorrect) = P(incorrect | L_t) * P(L_t) / P(incorrect)
      // P(incorrect | L_t) = slip_rate if knowing, (1 - guess_rate) if not knowing
      const evidenceIncorrect = currentMastery * slip_rate + (1 - currentMastery) * (1 - guess_rate)
      updatedMastery = (currentMastery * slip_rate) / evidenceIncorrect
    }

    // Apply learning transition: P(L_t+1) = P(L_t) + (1 - P(L_t)) * learn_rate
    const finalMastery = updatedMastery + (1 - updatedMastery) * learn_rate

    // Ensure mastery is within [0, 1]
    return Math.max(0, Math.min(1, finalMastery))
  }

  /**
   * Record a student's answer and update their skill state
   */
  async recordAnswer(record: TrainingRecord): Promise<void> {
    try {
      // Get current opportunity count for this skill
      const { data: currentState } = await supabase
        .from('skill_state')
        .select('opportunity')
        .eq('user_id', record.user_id)
        .eq('skill_id', record.skill_id)
        .single()

      const opportunity = (currentState?.opportunity || 0) + 1

      // Insert training log record
      const { error: logError } = await supabase
        .from('training_log')
        .insert({
          user_id: record.user_id,
          skill_id: record.skill_id,
          question_id: record.question_id,
          correct: record.correct,
          opportunity: opportunity,
          response_time_seconds: record.response_time_seconds,
          timestamp: new Date().toISOString()
        })

      if (logError) throw logError

      console.log('Training log recorded:', { ...record, opportunity })
    } catch (error) {
      console.error('Error recording answer:', error)
      throw error
    }
  }

  /**
   * Get the next recommended question for a student based on their mastery level
   */
  async getNextQuestion(userId: string, skillId: string): Promise<Question | null> {
    try {
      // Get student's current mastery level
      const { data: skillState } = await supabase
        .from('skill_state')
        .select('estimated_mastery, opportunity')
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .single()

      const mastery = skillState?.estimated_mastery || 0.1

      // Get questions for this skill that haven't been answered recently
      const { data: answeredQuestions } = await supabase
        .from('training_log')
        .select('question_id')
        .eq('user_id', userId)
        .eq('skill_id', skillId)
        .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

      const answeredIds = answeredQuestions?.map(q => q.question_id) || []

      // Adaptive question selection based on mastery level
      let targetDifficulty: string
      if (mastery < 0.3) {
        targetDifficulty = 'easy'
      } else if (mastery < 0.7) {
        targetDifficulty = 'medium'
      } else {
        targetDifficulty = 'hard'
      }

      // Get questions of appropriate difficulty
      const { data: questions, error } = await supabase
        .from('questions')
        .select('*')
        .eq('skill_id', skillId)
        .eq('difficulty', targetDifficulty)
        .not('id', 'in', `(${answeredIds.length > 0 ? answeredIds.join(',') : 'null'})`)
        .limit(5)

      if (error) throw error

      // If no questions of target difficulty, get any available questions
      if (!questions || questions.length === 0) {
        const { data: fallbackQuestions } = await supabase
          .from('questions')
          .select('*')
          .eq('skill_id', skillId)
          .not('id', 'in', `(${answeredIds.length > 0 ? answeredIds.join(',') : 'null'})`)
          .limit(5)

        return fallbackQuestions?.[Math.floor(Math.random() * (fallbackQuestions?.length || 1))] || null
      }

      // Randomly select from available questions
      return questions[Math.floor(Math.random() * questions.length)]
    } catch (error) {
      console.error('Error getting next question:', error)
      return null
    }
  }

  /**
   * Get student's skill states for dashboard display
   */
  async getStudentSkillStates(userId: string): Promise<StudentState[]> {
    try {
      const { data, error } = await supabase
        .from('skill_state')
        .select(`
          user_id,
          skill_id,
          estimated_mastery,
          opportunity,
          last_updated,
          skills!inner(name, description)
        `)
        .eq('user_id', userId)
        .order('estimated_mastery', { ascending: false })

      if (error) throw error
      
      // Transform the data to match our interface
      return (data || []).map(item => ({
        user_id: item.user_id,
        skill_id: item.skill_id,
        estimated_mastery: item.estimated_mastery,
        opportunity: item.opportunity,
        last_updated: item.last_updated,
        skills: Array.isArray(item.skills) ? item.skills[0] : item.skills
      }))
    } catch (error) {
      console.error('Error fetching skill states:', error)
      return []
    }
  }

  /**
   * Calculate mastery level category for UI display
   */
  getMasteryLevel(mastery: number): { level: string; color: string; description: string } {
    if (mastery >= 0.8) {
      return {
        level: 'Mastered',
        color: 'green',
        description: 'Excellent understanding of this skill'
      }
    } else if (mastery >= 0.6) {
      return {
        level: 'Proficient',
        color: 'blue',
        description: 'Good understanding, keep practicing'
      }
    } else if (mastery >= 0.4) {
      return {
        level: 'Developing',
        color: 'yellow',
        description: 'Making progress, needs more practice'
      }
    } else {
      return {
        level: 'Beginner',
        color: 'red',
        description: 'Just starting to learn this skill'
      }
    }
  }

  /**
   * Batch update model parameters based on all student data (for teachers)
   */
  async updateModelParameters(skillId: string): Promise<void> {
    try {
      // This would typically involve more sophisticated parameter estimation
      // For now, we'll use a simple approach based on aggregate performance

      const { data: trainingData } = await supabase
        .from('training_log')
        .select('correct, opportunity')
        .eq('skill_id', skillId)
        .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last week

      if (!trainingData || trainingData.length < 10) {
        console.log('Insufficient data for parameter update')
        return
      }

      // Simple parameter estimation
      const totalResponses = trainingData.length
      const correctResponses = trainingData.filter(d => d.correct).length
      const overallAccuracy = correctResponses / totalResponses

      // Adjust parameters based on overall performance
      const updatedParams: Partial<BKTParameters> = {
        guess_rate: Math.max(0.1, Math.min(0.4, 1 - overallAccuracy)),
        slip_rate: Math.max(0.05, Math.min(0.3, 1 - overallAccuracy)),
        learn_rate: Math.max(0.1, Math.min(0.3, overallAccuracy))
      }

      // Update model state in database
      const { error } = await supabase
        .from('bkt_model_state')
        .upsert({
          skill_id: skillId,
          ...updatedParams,
          last_trained: new Date().toISOString(),
          training_samples: totalResponses,
          model_accuracy: overallAccuracy
        })

      if (error) throw error

      console.log('Model parameters updated for skill:', skillId, updatedParams)
    } catch (error) {
      console.error('Error updating model parameters:', error)
    }
  }

  /**
   * Get personalized learning recommendations for a student
   */
  async getLearningRecommendations(userId: string): Promise<{
    skillId: string
    skillName: string
    mastery: number
    recommendation: string
    priority: 'high' | 'medium' | 'low'
  }[]> {
    try {
      const skillStates = await this.getStudentSkillStates(userId)
      
      return skillStates.map(state => {
        const mastery = state.estimated_mastery
        let recommendation: string
        let priority: 'high' | 'medium' | 'low'

        if (mastery < 0.3) {
          recommendation = 'Focus on building fundamental understanding'
          priority = 'high'
        } else if (mastery < 0.6) {
          recommendation = 'Continue practicing to strengthen skills'
          priority = 'medium'
        } else if (mastery < 0.8) {
          recommendation = 'Work on advanced problems to achieve mastery'
          priority = 'medium'
        } else {
          recommendation = 'Maintain skills with periodic review'
          priority = 'low'
        }

        return {
          skillId: state.skill_id,
          skillName: state.skills?.name || 'Unknown Skill',
          mastery,
          recommendation,
          priority
        }
      }).sort((a, b) => {
        // Sort by priority and then by mastery level
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
        return priorityDiff !== 0 ? priorityDiff : a.mastery - b.mastery
      })
    } catch (error) {
      console.error('Error getting learning recommendations:', error)
      return []
    }
  }
}

// Export singleton instance
export const bktEngine = new BayesianKnowledgeTracing() 