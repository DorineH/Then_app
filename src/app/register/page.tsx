'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';


export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', age: '', coupleId: '' });
  const [result, setResult] = useState<{ userId: string; coupleId: string; email: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        age: Number(form.age),
        coupleId: form.coupleId || undefined,
      };
      const res = await register(payload);
      setResult(res);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de l’inscription');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result) {
      // Redirige vers la page d'accueil après inscription
      router.push('/');
    }
  }, [result, router]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nom" value={form.name} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border p-2 rounded" />
        <input name="age" placeholder="Âge" value={form.age} onChange={handleChange} required type="number" className="w-full border p-2 rounded" />
        <input name="coupleId" placeholder="Couple ID (laisser vide pour créer)" value={form.coupleId} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded">{loading ? 'Envoi...' : 'S’inscrire'}</button>
      </form>
      {result && (
        <div className="mt-4 p-3 bg-green-100 rounded">
          <div>Inscription réussie !</div>
          <div><b>Votre userId :</b> {result.userId}</div>
          <div><b>Votre coupleId :</b> {result.coupleId}</div>
          <div><b>Email :</b> {result.email}</div>
          <div className="mt-2 text-sm text-gray-600">Partagez le coupleId à votre partenaire pour qu’il/elle rejoigne le couple.</div>
        </div>
      )}
      {error && <div className="mt-4 p-3 bg-red-100 rounded text-red-700">{error}</div>}
    </div>
  );
}
