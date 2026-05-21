import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as authApi from '../api/auth'

type Step = 'request' | 'done'

export default function ResetPassword() {
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.requestPasswordReset({ email })
      setStep('done')
    } catch (err: any) {
      setError(err.response?.data?.message ?? '요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">비밀번호 재설정</h1>

      {error && (
        <div className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <p className="text-sm text-gray-600">
            가입한 이메일을 입력하면 재설정 링크를 보내드립니다.
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '전송 중...' : '재설정 메일 보내기'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-gray-700">
            <strong>{email}</strong>으로 재설정 링크를 전송했습니다.
          </p>
          <p className="text-sm text-gray-500">메일함을 확인해주세요.</p>
        </div>
      )}

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          로그인으로 돌아가기
        </Link>
      </p>
    </div>
  )
}
