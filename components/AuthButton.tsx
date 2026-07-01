'use client';

import React from 'react';
import { useAuth } from './FirebaseProvider';

export function AuthButton() {
  const { user, loading, signIn, logOut } = useAuth();

  if (loading) {
    return <div className="w-20 h-8 bg-slate-200 animate-pulse rounded-full"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <img src={user.photoURL || 'https://via.placeholder.com/150'} alt="User Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
        <button onClick={logOut} className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition">
          Sair
        </button>
      </div>
    );
  }

  return (
    <button onClick={signIn} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm transition-colors border border-indigo-200">
      Entrar
    </button>
  );
}
