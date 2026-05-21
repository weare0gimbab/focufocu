import { useAuthStore } from '../store/authStore'

export default function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">대시보드</h1>
      <p className="text-gray-600">
        안녕하세요, <strong>{user?.nickname}</strong>님!
      </p>
    </div>
  )
}
