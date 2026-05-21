import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function AppLayout() {
  const { user, logout } = useAuthStore()

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <span className="text-lg font-semibold">pocupocu</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user?.nickname}</span>
          <button
            onClick={logout}
            className="rounded px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            로그아웃
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
