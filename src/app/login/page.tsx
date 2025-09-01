'use client'


import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ userId: '', coupleId: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      await login({
        userId: form.userId,
        coupleId: form.coupleId,
        email: form.email,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      // Redirige vers la page d'accueil après connexion
      router.push('/');
    }
  }, [success, router]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Connexion</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="userId" placeholder="Votre userId" value={form.userId} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="coupleId" placeholder="Votre coupleId" value={form.coupleId} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="email" placeholder="Votre email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">{loading ? 'Connexion...' : 'Se connecter'}</button>
      </form>
      {success && <div className="mt-4 p-3 bg-green-100 rounded">Connexion réussie !</div>}
      {error && <div className="mt-4 p-3 bg-red-100 rounded text-red-700">{error}</div>}
    </div>
  );
}
