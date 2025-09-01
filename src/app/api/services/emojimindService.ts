import { axiosInstance, ensureToken } from './authService';


export async function setEmojimindCombination(coupleId: string, combination: string[], creatorUserId?: string): Promise<void> {
  const token = await ensureToken();
  await axiosInstance.post(
    '/emojimind/combination',
    { coupleId, combination, creatorUserId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}


export type EmojimindCombination = {
  combination: string[];
  creatorUserId: string | null;
};

export async function getEmojimindCombination(coupleId: string): Promise<EmojimindCombination> {
  const token = await ensureToken();
  const { data } = await axiosInstance.get(`/emojimind/combination?coupleId=${encodeURIComponent(coupleId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return {
    combination: data?.combination ?? [],
    creatorUserId: data?.creatorUserId ?? null,
  };
}
