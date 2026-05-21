import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth'
import { useAuthStore } from '../store/authStore'

type Step = 'email' | 'verify' | 'form'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.requestEmailVerify({ email })
      setStep('verify')
    } catch (err: any) {
      setError(err.response?.data?.message ?? '인증 메일 전송에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.confirmEmailVerify({ email, code })
      setStep('form')
    } catch (err: any) {
      setError(err.response?.data?.message ?? '인증 코드가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.register({ email, password, nickname, emailVerificationCode: code })
      await login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message ?? '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">회원가입</h1>

      {error && (
        <div className="mb-4 rounded bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>
      )}

      {step === 'email' && (
        <form onSubmit={handleRequestCode} className="space-y-4">
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
            {loading ? '전송 중...' : '인증 코드 받기'}
          </button>
        </form>
      )}

      {step === 'verify' && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <p className="text-sm text-gray-600">
            <strong>{email}</strong>으로 전송된 6자리 코드를 입력하세요.
          </p>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">인증 코드</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm tracking-widest focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '확인 중...' : '인증 확인'}
          </button>
        </form>
      )}

      {step === 'form' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '가입 중...' : '가입 완료'}
          </button>
        </form>
      )}

      <p className="mt-4 text-center text-sm text-gray-500">
        이미 계정이 있나요?{' '}
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          로그인
        </Link>
      </p>
    </div>
  )
}
