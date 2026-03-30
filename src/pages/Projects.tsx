import { useEffect, useState } from 'react'
import { api, Project } from '../lib/supabase'
import { Plus, FolderKanban, Calendar, User, Loader2 } from 'lucide-react'

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('📂 Projects: Component mounted')
    loadProjects()
  }, [])

  async function loadProjects() {
    console.log('🔄 Projects: Starting to load projects from database...')
    try {
      setLoading(true)
      setError(null)
      
      const data = await api.getProjects()
      console.log('✅ Projects: Successfully loaded projects:', data)
      console.log('📊 Projects: Number of projects found:', data.length)
      
      // Map database field names to our interface
      const mappedProjects = data.map(project => ({
        ...project,
        name: project.title || project.name // Handle both field names
      }))
      
      console.log('🔄 Projects: Mapped projects data:', mappedProjects)
      setProjects(mappedProjects)
    } catch (err: any) {
      console.error('❌ Projects: Failed to load projects:', err)
      setError(err.message || 'Failed to load projects')
    } finally {
      setLoading(false)
      console.log('🏁 Projects: Load process completed')
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your projects
          </p>
        </div>
        
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading projects...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your projects
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            Error loading projects: {error}
          </p>
          <button 
            onClick={loadProjects}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your projects
          </p>
        </div>
        
        <button 
          onClick={() => console.log('➕ Projects: Create new project clicked')}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm text-center">
          <FolderKanban className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No projects found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Get started by creating your first project
          </p>
          <button 
            onClick={() => console.log('➕ Projects: Create project from empty state clicked')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => console.log('🎯 Projects: Project clicked:', project.name)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <FolderKanban className="w-8 h-8 text-indigo-600" />
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {project.status || 'Unknown'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {project.name}
              </h3>
              
              {project.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
              )}
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {project.progress_percentage || 0}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress_percentage || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Debug info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Debug Info:
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Total projects: {projects.length} | 
          Loading: {loading.toString()} | 
          Error: {error || 'None'}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Console logs: Check browser console for detailed debug information
        </p>
      </div>
    </div>
  )
}
