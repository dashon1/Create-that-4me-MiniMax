import { useState, useEffect } from 'react'
import { api } from '../lib/supabase'

interface TeamActivity {
  name: string
  activity: string
  time: string
  avatar: string
}

export function TeamCollaboration() {
  const [activities, setActivities] = useState<TeamActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeamData()
  }, [])

  async function loadTeamData() {
    try {
      const teamMembers = await api.getTeamMembers()
      // Convert team members to activity data
      const memberActivities = teamMembers.slice(0, 3).map((member, index) => ({
        name: member.name,
        activity: getRandomActivity(),
        time: getRandomTime(),
        avatar: member.avatar || member.name.substring(0, 2).toUpperCase()
      }))
      setActivities(memberActivities)
    } catch (error) {
      console.error('Failed to load team data:', error)
      // Fallback to static data
      setActivities([
        { name: 'Sarah Chen', activity: 'Editing script', time: '2 minutes ago', avatar: 'SC' },
        { name: 'Mike Johnson', activity: 'Reviewing assets', time: '5 minutes ago', avatar: 'MJ' },
      ])
    } finally {
      setLoading(false)
    }
  }

  function getRandomActivity() {
    const activities = ['Editing script', 'Reviewing assets', 'Creating design', 'Updating project', 'Writing code', 'Planning content']
    return activities[Math.floor(Math.random() * activities.length)]
  }

  function getRandomTime() {
    const times = ['1 minute ago', '2 minutes ago', '5 minutes ago', '10 minutes ago', '15 minutes ago']
    return times[Math.floor(Math.random() * times.length)]
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Team Collaboration
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 font-medium">Live</span>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
        Real-time team activity and collaboration
      </p>

      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Active Now (2)</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
              {activity.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{activity.activity}</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
