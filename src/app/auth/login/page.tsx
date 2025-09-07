import React from 'react'
// Tái sử dụng InfoPanel từ thư mục signup
import { InfoPanel } from '@/components/modules/auth/login/InfoPanel'
import { LoginForm } from '@/components/modules/auth/login/LoginForm'
export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-4 font-sans">
      <div className="flex h-full w-full max-w-7xl overflow-hidden rounded-2xl shadow-2xl">
        <InfoPanel />
        <LoginForm />
      </div>
    </div>
  )
}
