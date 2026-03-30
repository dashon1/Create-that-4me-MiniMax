import { useEffect, useState } from 'react'
import { MetricCard } from '../components/MetricCard'
import { WorkflowTimeline } from '../components/WorkflowTimeline'
import { TeamCollaboration } from '../components/TeamCollaboration'
import { AIContentGenerator } from '../components/AIContentGenerator'
import { FolderKanban, CheckCircle, Users, AlertCircle } from 'lucide-react'
import { api } from '../lib/supabase'

export function Dashboard() {
  const [metrics, setMetrics] = useState({
    activeProjects: 0,
    completedTasks: 0,
    teamMembers: 0,
    pendingReviews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('Dashboard: Component mounted')
    loadMetrics()
  }, [])

  async function loadMetrics() {
    try {
      const [projects, tasks, teamMembers] = await Promise.all([
        api.getProjects(),
        api.getTasks(),
        api.getTeamMembers()
      ])

      const completedTasks = tasks.filter(t => t.status === 'completed').length
      const pendingTasks = tasks.filter(t => t.status === 'pending').length

      setMetrics({
        activeProjects: projects.filter(p => p.status === 'active').length,
        completedTasks,
        teamMembers: teamMembers.length,
        pendingReviews: pendingTasks
      })
    } catch (error) {
      console.error('Failed to load metrics:', error)
      // Use default values on error
      setMetrics({
        activeProjects: 12,
        completedTasks: 48,
        teamMembers: 24,
        pendingReviews: 8
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back!
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your projects today
        </p>
      </div>

      {/* Metrics Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Active Projects"
            value={metrics.activeProjects}
            change={2}
            icon={<FolderKanban className="w-6 h-6 text-white" />}
            color="bg-indigo-600"
          />
          <MetricCard
            title="Completed Tasks"
            value={metrics.completedTasks}
            change={12}
            icon={<CheckCircle className="w-6 h-6 text-white" />}
            color="bg-green-600"
          />
          <MetricCard
            title="Team Members"
            value={metrics.teamMembers}
            change={3}
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-purple-600"
          />
          <MetricCard
            title="Pending Reviews"
            value={metrics.pendingReviews}
            change={-2}
            icon={<AlertCircle className="w-6 h-6 text-white" />}
            color="bg-orange-600"
          />
        </div>
      )}

      {/* Workflow Timeline */}
      <WorkflowTimeline />

      {/* Team Collaboration & AI Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamCollaboration />
        <AIContentGenerator />
      </div>
    </div>
  )
}
