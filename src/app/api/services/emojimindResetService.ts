import { axiosInstance, ensureToken } from './authService';
// Service pour supprimer la combinaison et les tentatives d'un couple (reset total)
export async function resetEmojimindGame(coupleId: string) {
//   const token = await ensureToken();
  try {
    await axiosInstance.delete(`/emojimind/combination?coupleId=${encodeURIComponent(coupleId)}`,
    //   { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch {
    throw new Error('Erreur lors du reset de la partie');
  }
}
