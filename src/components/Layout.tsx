import { ReactNode, useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen flex`}>
      <Sidebar darkMode={darkMode} />
      <div className="flex-1 flex flex-col">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode(!darkMode)} />
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
