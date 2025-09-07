import React from 'react'
import { InfoPanel } from '@/components/modules/auth/login/InfoPanel'
import { SignupForm } from '@/components/modules/auth/signup/SignupForm'

export default function SignupPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#EDF8FF] font-sans">
      <div className="flex h-[800px] w-full max-w-7xl">
        <InfoPanel />
        <SignupForm />
      </div>
    </div>
  )
}
