'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Home, PawPrint, Heart, User, Plus, ClipboardCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const BottomNavigation = () => {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      icon: Home,
      label: 'Accueil',
      path: '/',
      id: 'home'
    },
    {
      icon: PawPrint,
      label: 'Animal',
      path: '/animal',
      id: 'animal'
    },
    {
      icon: Plus,
      label: 'Ajouter',
      path: '/emotions',
      id: 'create'
    },
    {
      icon: Heart,
      label: 'Favoris',
      path: '/favorites',
      id: 'favorites'
    },
    {
      icon: ClipboardCheck,
      label: 'To-Do',
      path: '/tasks',
      id: 'tasks'
    }
  ]

  const handleNavigation = (path) => {
    router.push(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center justify-center min-w-0 px-2 py-2 h-auto ${
                isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <Icon size={20} className="mb-1" />
              <span className="text-xs font-medium truncate">
                {item.label}
              </span>
            </Button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation