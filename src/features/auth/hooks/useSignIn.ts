import { useState } from 'react';

import { logger } from '@/utils/logger';

import { signIn, type SignInMethod } from '../services/authService';

export function useSignIn() {
  const [pending, setPending] = useState<SignInMethod | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async (method: SignInMethod) => {
    setError(null);
    setPending(method);
    try {
      await signIn(method);
    } catch (e) {
      logger.error('Giriş hatası', e);
      setError(
        method === 'google'
          ? 'Google ile giriş tamamlanamadı. İnternet bağlantını kontrol edip tekrar dene.'
          : 'Apple ile giriş tamamlanamadı. Tekrar dene.',
      );
    } finally {
      setPending(null);
    }
  };

  return { signIn: run, pending, error };
}
