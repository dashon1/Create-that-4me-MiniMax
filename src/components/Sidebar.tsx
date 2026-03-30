import { NavLink } from 'react-router-dom'
import { LayoutDashboard, FolderKanban, Image, Users, BarChart3, Settings, LogOut } from 'lucide-react'

interface SidebarProps {
  darkMode: boolean
}

export function Sidebar({ darkMode }: SidebarProps) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Assets', path: '/assets', icon: Image },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  ]

  return (
    <aside className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
      <div className="p-6">
        <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Create DAT 4ME
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => console.log(`Navigation clicked: ${item.name} -> ${item.path}`)}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <NavLink
          to="/settings"
          onClick={() => console.log('Navigation clicked: Settings -> /settings')}
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-indigo-600 text-white'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
        <button
          onClick={() => {
            console.log('Sign out button clicked')
            // Clear any stored auth data
            localStorage.removeItem('auth-token')
            // Redirect to login or refresh page
            window.location.reload()
          }}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
            darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  )
}
