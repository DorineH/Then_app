'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../app/providers/auth-provider';
import { getEmojimindCombination, setEmojimindCombination, EmojimindCombination } from '../app/api/services/emojimindService';
import { postEmojimindAttempt, getEmojimindAttempts, EmojimindAttempt } from '../app/api/services/emojimindAttemptService';
import EmojiSelector from './EmojiSelector';
import AttemptRow from './AttemptRow';

const EMOJIS = ['😍', '🥲', '😴', '😂', '😡', '😱', '🥰', '🤔', '😎', '😭'];
const COMBINATION_LENGTH = 3;
const MAX_ATTEMPTS = 6;

function getFeedback(secret: string[], attempt: string[]): ('correct' | 'present' | 'absent')[] {
  const feedback: ('correct' | 'present' | 'absent')[] = Array(COMBINATION_LENGTH).fill('absent');
  const secretCopy = [...secret];
  // First pass: correct
  for (let i = 0; i < COMBINATION_LENGTH; i++) {
    if (attempt[i] === secret[i]) {
      feedback[i] = 'correct';
      secretCopy[i] = '';
    }
  }
  // Second pass: present
  for (let i = 0; i < COMBINATION_LENGTH; i++) {
    if (feedback[i] === 'correct') continue;
    const idx = secretCopy.indexOf(attempt[i]);
    if (idx !== -1 && attempt[i] !== secret[i]) {
      feedback[i] = 'present';
      secretCopy[idx] = '';
    }
  }
  return feedback;
}

const GameBoard: React.FC = () => {
  const { user } = useAuth();
  const coupleId = user?.coupleId;
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'creator' | 'guesser' | null>(null);
  const [creatorChoice, setCreatorChoice] = useState<'wait' | 'guesser' | 'follow' | null>(null);
  const [secret, setSecret] = useState<string[] | null>(null);
  const [creatorUserId, setCreatorUserId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<string[][]>([]);
  const [feedbacks, setFeedbacks] = useState<(('correct' | 'present' | 'absent')[])[]>([]);

  // Pour le créateur : liste des tentatives du partenaire
  const [remoteAttempts, setRemoteAttempts] = useState<EmojimindAttempt[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Rafraîchir les tentatives du partenaire (hook stable, à la racine)
  const fetchAttempts = useCallback(async () => {
    if (!coupleId) return;
    setRefreshing(true);
    try {
      const atts = await getEmojimindAttempts(coupleId);
      setRemoteAttempts(atts);
    } catch {
      // ignore
    } finally {
      setRefreshing(false);
    }
  }, [coupleId]);

  useEffect(() => {
    if (mode === 'creator' && secret && creatorChoice === 'follow') {
      fetchAttempts();
    }
  }, [mode, secret, creatorChoice, fetchAttempts]);
  const [current, setCurrent] = useState<string[]>(Array(COMBINATION_LENGTH).fill(''));
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coupleId || !user?.userId) return;
    setLoading(true);
    getEmojimindCombination(coupleId)
      .then((comb: EmojimindCombination) => {
        setCreatorUserId(comb.creatorUserId ?? null);
        if (comb && comb.combination && comb.combination.length === COMBINATION_LENGTH) {
          setSecret(comb.combination);
          if (comb.creatorUserId && user.userId === comb.creatorUserId) {
            setMode('creator');
            setCreatorChoice('wait');
          } else {
            setMode('guesser');
          }
        } else {
          setMode('creator');
        }
      })
      .catch(() => setError("Erreur lors de la récupération de la combinaison."))
      .finally(() => setLoading(false));
  }, [coupleId, user?.userId]);

  // Créateur : choisit la combinaison et la sauvegarde
  const handleCreateCombination = async () => {
    if (!coupleId || !user?.userId || current.some((e: string) => !e)) return;
    setLoading(true);
    try {
      await setEmojimindCombination(coupleId, current, user.userId);
      setSecret(current);
      setMode('creator');
      setCreatorChoice('wait');
      setCreatorUserId(user.userId);
      setCurrent(Array(COMBINATION_LENGTH).fill(''));
    } catch {
      setError("Erreur lors de l'enregistrement de la combinaison.");
    } finally {
      setLoading(false);
    }
  };

  // Devineur : joue normalement
  const handleSelect = (idx: number, emoji: string) => {
    if (gameStatus !== 'playing') return;
    setCurrent((prev: string[]) => {
      const next = [...prev];
      next[idx] = emoji;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!secret || current.some((e: string) => !e) || gameStatus !== 'playing' || !coupleId) return;
    const feedback = getFeedback(secret, current);
    const newAttempts = [...attempts, current];
    const newFeedbacks = [...feedbacks, feedback];
    setAttempts(newAttempts);
    setFeedbacks(newFeedbacks);
    setCurrent(Array(COMBINATION_LENGTH).fill(''));
    // Enregistre la tentative côté backend
    try {
      await postEmojimindAttempt(coupleId, current, feedback);
    } catch {
      // Optionnel : afficher une erreur
    }
    if (feedback.every((f) => f === 'correct')) {
      setGameStatus('won');
    } else if (newAttempts.length >= MAX_ATTEMPTS) {
      setGameStatus('lost');
    }
  };

  // Réinitialise l'état local pour une nouvelle partie
  const handleNewGame = async () => {
    if (coupleId) {
      try {
        // Supprime la partie côté backend (combinaison + tentatives)
        const { resetEmojimindGame } = await import('../app/api/services/emojimindResetService');
        await resetEmojimindGame(coupleId);
      } catch {
        // ignore erreur reset
      }
    }
    setSecret(null);
    setCreatorChoice(null);
    setAttempts([]);
    setFeedbacks([]);
    setCurrent(Array(COMBINATION_LENGTH).fill(''));
    setGameStatus('playing');
    setRemoteAttempts([]);
    setError(null);
    setMode(null);
    setCreatorUserId(null);

    // Recharge la combinaison depuis l'API pour afficher le bon écran
    if (coupleId) {
      setLoading(true);
      try {
        const { getEmojimindCombination } = await import('../app/api/services/emojimindService');
        const comb = await getEmojimindCombination(coupleId);
        setSecret(comb.combination && comb.combination.length > 0 ? comb.combination : null);
        setCreatorUserId(comb.creatorUserId ?? null);
        // Détermine le mode selon la présence d'une combinaison
        if (comb.combination && comb.combination.length > 0) {
          setMode('guesser');
        } else {
          setMode(null);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
  }

  if (loading) {
    return <div className="text-center text-gray-500 py-10">Chargement…</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }
  if (!coupleId) {
    return <div className="text-center text-gray-500 py-10">Aucun coupleId trouvé.</div>;
  }



  // Mode créateur : choisir la combinaison puis choix explicite
  // (fetchAttempts et useEffect sont déjà définis à la racine)

  if (mode === 'creator') {
    // Choix après création
    if (secret && creatorChoice === 'wait') {
      return (
        <div className="max-w-md mx-auto p-4 bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl shadow-lg min-h-[60vh] flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">Combinaison enregistrée !</h2>
          <div className="mb-4 text-center text-blue-700">Que veux-tu faire ?</div>
          <button
            className="mb-2 px-4 py-2 rounded bg-blue-400 text-white font-semibold shadow hover:bg-blue-500"
            onClick={() => setCreatorChoice('follow')}
            type="button"
          >
            Voir l&apos;avancement de mon/ma partenaire
          </button>
          <button
            className="mb-2 px-4 py-2 rounded bg-pink-500 text-white font-semibold shadow hover:bg-pink-600"
            onClick={() => setCreatorChoice('guesser')}
            type="button"
          >
            Je veux deviner moi-même
          </button>
        </div>
      );
    }

    // Suivi de l'avancement
    if (secret && creatorChoice === 'follow') {
      return (
        <div className="max-w-md mx-auto p-4 bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl shadow-lg min-h-[60vh] flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">Avancement de ton/ta partenaire</h2>
          <button
            className="mb-2 px-4 py-1 rounded bg-blue-400 text-white font-semibold shadow hover:bg-blue-500 disabled:opacity-50"
            onClick={fetchAttempts}
            disabled={refreshing}
            type="button"
          >
            {refreshing ? 'Rafraîchissement…' : 'Rafraîchir'}
          </button>
          <div className="w-full flex flex-col gap-2 mt-2">
            {remoteAttempts.length === 0 && <div className="text-gray-400 text-center">Aucune tentative pour l&apos;instant.</div>}
            {remoteAttempts.map((att, idx) => (
              <AttemptRow
                key={att.createdAt + idx}
                attempt={att.attempt}
                feedback={att.feedback}
                attemptNumber={idx}
              />
            ))}
          </div>
        </div>
      );
    }

    // Le créateur veut deviner lui-même
    if (secret && creatorChoice === 'guesser') {
      setMode('guesser');
      setCreatorChoice(null);
      // On laisse le render passer au mode devineur
    }

    // Choix de la combinaison (état initial)
    return (
      <div className="max-w-md mx-auto p-4 bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl shadow-lg min-h-[60vh] flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">Choisis la combinaison secrète</h2>
        <EmojiSelector
          emojis={EMOJIS}
          selected={current}
          onSelect={handleSelect}
          disabled={loading}
        />
        <button
          className="mt-4 w-full py-2 rounded-lg bg-pink-500 text-white font-semibold text-lg shadow hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleCreateCombination}
          disabled={current.some((e) => !e) || loading}
          type="button"
        >
          Valider la combinaison
        </button>
      </div>
    );
  }

  // Mode devineur : jeu classique
  return (
    <div className="max-w-md mx-auto p-4 bg-gradient-to-br from-blue-50 to-pink-50 rounded-2xl shadow-lg min-h-[80vh] flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">Emojimind</h2>
      <div className="w-full flex flex-col gap-2 mb-4">
        {attempts.map((attempt, idx) => (
          <AttemptRow
            key={idx}
            attempt={attempt}
            feedback={feedbacks[idx]}
            attemptNumber={idx}
          />
        ))}
      </div>
      {gameStatus === 'playing' && (
        <>
          <EmojiSelector
            emojis={EMOJIS}
            selected={current}
            onSelect={handleSelect}
            disabled={gameStatus !== 'playing'}
          />
          <button
            className="mt-4 w-full py-2 rounded-lg bg-pink-500 text-white font-semibold text-lg shadow hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={current.some((e) => !e)}
            type="button"
          >
            Valider
          </button>
        </>
      )}
      {gameStatus === 'won' && (
        <div className="mt-6 text-center">
          <div className="text-3xl mb-2">🎉 Bravo ! Tu as trouvé la combinaison !</div>
          <div className="flex justify-center gap-2 mb-2">
            {secret && secret.map((e, i) => (
              <span key={i} className="text-3xl">{e}</span>
            ))}
          </div>
          <button
            className="mt-2 px-4 py-2 rounded bg-blue-400 text-white font-semibold shadow hover:bg-blue-500"
            onClick={handleNewGame}
            type="button"
          >
            Nouvelle partie
          </button>
        </div>
      )}
      {gameStatus === 'lost' && (
        <div className="mt-6 text-center">
          <div className="text-2xl mb-2">😢 Dommage, la combinaison était :</div>
          <div className="flex justify-center gap-2 mb-2">
            {secret && secret.map((e, i) => (
              <span key={i} className="text-3xl">{e}</span>
            ))}
          </div>
          <button
            className="mt-2 px-4 py-2 rounded bg-blue-400 text-white font-semibold shadow hover:bg-blue-500"
            onClick={handleNewGame}
            type="button"
          >
            Nouvelle partie
          </button>
        </div>
      )}
      <div className="mt-8 text-xs text-gray-400 text-center">Inspiré de Mastermind, version couple 💑</div>
    </div>
  );
};

export default GameBoard;
