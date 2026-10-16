'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { HeartPulse, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, register, error, clearError, isLoading } = useAuth();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Receptionist',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isRegister) {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
      } else {
        await login(formData.email, formData.password);
      }
      router.push('/dashboard');
    } catch {
      // Error is set in the context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-emerald-950/80 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/25 mb-4">
            <HeartPulse className="h-8 w-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Smart HMS</h1>
          <p className="text-emerald-200/70 mt-2 text-sm">Hospital Management System</p>
        </div>

        {/* Card */}
        <div className="bg-black/60 backdrop-blur-xl border border-emerald-500/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-emerald-100/90 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/70 border border-emerald-900/50 rounded-lg text-white placeholder-emerald-300/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 transition-all"
                    placeholder="Dr. John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-emerald-100/90 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/70 border border-emerald-900/50 rounded-lg text-white placeholder-emerald-300/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 transition-all"
                  placeholder="admin@hospital.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-emerald-100/90 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400/50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 bg-zinc-950/70 border border-emerald-900/50 rounded-lg text-white placeholder-emerald-300/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-300/50 hover:text-emerald-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-emerald-100/90 mb-1.5">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950/70 border border-emerald-900/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/60 transition-all appearance-none"
                >
                  <option value="Admin" className="bg-black text-white">Admin</option>
                  <option value="Doctor" className="bg-black text-white">Doctor</option>
                  <option value="Nurse" className="bg-black text-white">Nurse</option>
                  <option value="Receptionist" className="bg-black text-white">Receptionist</option>
                  <option value="Pharmacist" className="bg-black text-white">Pharmacist</option>
                  <option value="Lab Technician" className="bg-black text-white">Lab Technician</option>
                  <option value="Accountant" className="bg-black text-white">Accountant</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                clearError();
              }}
              className="text-sm text-emerald-300/70 hover:text-emerald-300 transition-colors"
            >
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-6 pt-6 border-t border-emerald-950/60">
              <p className="text-xs text-emerald-200/50 text-center mb-3">Demo Credentials</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Admin', email: 'admin@hospital.com' },
                  { label: 'Doctor', email: 'a.carter@hospital.com' },
                  { label: 'Reception', email: 'reception@hospital.com' },
                  { label: 'Pharmacist', email: 'pharmacy@hospital.com' },
                ].map((cred) => (
                  <button
                    key={cred.email}
                    type="button"
                    onClick={() => setFormData({ ...formData, email: cred.email, password: 'password123' })}
                    className="px-3 py-1.5 text-xs bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-emerald-200/70 hover:text-white hover:bg-emerald-900/40 hover:border-emerald-700/60 transition-all"
                  >
                    {cred.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-emerald-200/40 text-xs mt-6">
          © 2024 Smart Hospital Management System
        </p>
      </div>
    </div>
  );
}
