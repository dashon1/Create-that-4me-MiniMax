import { useState, useEffect } from 'react'
import { UserPlus, Mail } from 'lucide-react'
import { api, TeamMember } from '../lib/supabase'

export function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', role: '', email: '' })
  const [inviting, setInviting] = useState(false)

  useEffect(() => {
    loadTeamMembers()
  }, [])

  async function loadTeamMembers() {
    try {
      const members = await api.getTeamMembers()
      setTeamMembers(members)
    } catch (error) {
      console.error('Failed to load team members:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleInvite() {
    if (!inviteForm.name || !inviteForm.role) {
      alert('Please fill in name and role')
      return
    }

    setInviting(true)
    try {
      const initials = inviteForm.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

      await api.createTeamMember({
        name: inviteForm.name,
        role: inviteForm.role,
        email: inviteForm.email || null,
        avatar: initials,
        status: 'offline'
      })

      setInviteForm({ name: '', role: '', email: '' })
      setShowInviteModal(false)
      await loadTeamMembers()
    } catch (error) {
      console.error('Failed to invite member:', error)
      alert('Failed to invite member')
    } finally {
      setInviting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your team members and collaborators
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span className="font-medium">Invite Member</span>
        </button>
      </div>

      {/* Team Members Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse h-48" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {member.avatar}
                  </div>
                  {/* Status Indicator */}
                  <div
                    className={`absolute bottom-0 right-0 w-5 h-5 ${getStatusColor(
                      member.status
                    )} rounded-full border-4 border-white dark:border-gray-800`}
                  ></div>
                </div>

                {/* Name & Role */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{member.role}</p>

                {/* Status Badge */}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    member.status === 'online'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : member.status === 'away'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {getStatusText(member.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Invite Team Member
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  placeholder="Developer"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={inviting}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>{inviting ? 'Inviting...' : 'Send Invite'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
