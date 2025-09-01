import { axiosInstance, ensureToken } from './authService';

export type EmojimindAttempt = {
  coupleId: string;
  attempt: string[];
  feedback: any;
  createdAt: string;
};

export async function postEmojimindAttempt(
  coupleId: string,
  attempt: string[],
  feedback: any
): Promise<void> {
  const token = await ensureToken();
  await axiosInstance.post(
    '/emojimind/attempt',
    { coupleId, attempt, feedback },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export async function getEmojimindAttempts(coupleId: string): Promise<EmojimindAttempt[]> {
  const token = await ensureToken();
  const { data } = await axiosInstance.get(`/emojimind/attempts?coupleId=${encodeURIComponent(coupleId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data?.attempts ?? [];
}
