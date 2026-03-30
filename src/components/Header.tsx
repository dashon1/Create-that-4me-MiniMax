import { Bell, Moon, Sun, RefreshCw } from 'lucide-react'

interface HeaderProps {
  darkMode: boolean
  onToggleDarkMode: () => void
}

export function Header({ darkMode, onToggleDarkMode }: HeaderProps) {
  const handleRefresh = () => {
    console.log('Refresh button clicked')
    window.location.reload()
  }

  const handleNotifications = () => {
    console.log('Notifications button clicked')
    alert('Notifications feature coming soon!')
  }

  const handleGetStarted = () => {
    console.log('Get Started button clicked')
    // Could open a modal, navigate to setup, etc.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleGetStarted}
            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            Get Started
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              console.log('Dark mode toggle clicked')
              onToggleDarkMode()
            }}
            className={`p-2 rounded-lg transition-colors ${
              darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={handleRefresh}
            className={`p-2 rounded-lg transition-colors relative ${
              darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Refresh page"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          <button
            onClick={handleNotifications}
            className={`p-2 rounded-lg transition-colors relative ${
              darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
              D
            </div>
            <div className={darkMode ? 'text-gray-200' : 'text-gray-900'}>
              <p className="text-sm font-medium">Dashon</p>
              <p className="text-xs text-gray-500">Team Member</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
