import { Storage } from '@lib/storage';

const WISH_WORKER_URL: string =
  (process.env.EXPO_PUBLIC_WISH_WORKER_URL as string | undefined) ??
  'https://scream2wish.rajnishkmehta.workers.dev';

const WISH_WORKER_API: string =
  (process.env.EXPO_PUBLIC_WISH_WORKER_API as string | undefined) ?? '';

export const MAX_SEND_RETRIES = 6;
const RETRY_DELAY_MS = 3000;

let _sessionAuthBlocked = false;

export interface SendState {
  issent: boolean;
  attempts: number;
  lastError: string;
  unauthorized: boolean;
  maxed: boolean;
}

export function getSendState(): SendState {
  const attempts = Storage.getNumber('sendAttempts') ?? 0;
  return {
    issent: Storage.getBoolean('issent') === true,
    attempts,
    lastError: Storage.getString('sendLastError') ?? '',
    unauthorized: _sessionAuthBlocked,
    maxed: attempts >= MAX_SEND_RETRIES,
  };
}

export function clearSessionAuthBlock(): void {
  _sessionAuthBlocked = false;
}

async function attemptOnce(): Promise<{ ok: boolean; unauthorized: boolean; error: string }> {
  try {
    const wish = Storage.getString('mywish');
    const note = Storage.getString('mynote');
    const from = Storage.getString('name');

    if (!wish?.trim() || !note?.trim() || !from?.trim()) {
      return { ok: false, unauthorized: false, error: 'Missing wish, note, or name.' };
    }

    const res = await fetch(WISH_WORKER_URL, {
      method: 'POST',
      headers: {
        'x-api-key': WISH_WORKER_API,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'add-wish',
        client_payload: {
          wish: wish.trim(),
          note: note.trim(),
          from: from.trim(),
        },
      }),
    });

    if (res.status === 401 || res.status === 403) {
      return { ok: false, unauthorized: true, error: 'Unauthorized (server rejected the request).' };
    }

    if (res.status === 200 || res.status === 201) {
      return { ok: true, unauthorized: false, error: '' };
    }

    return { ok: false, unauthorized: false, error: `Server returned status ${res.status}.` };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Network error.';
    return { ok: false, unauthorized: false, error: msg };
  }
}

export async function trySendWish(): Promise<void> {
  if (Storage.getBoolean('issent') === true) return;
  if (_sessionAuthBlocked) return;

  const attempts = Storage.getNumber('sendAttempts') ?? 0;
  if (attempts >= MAX_SEND_RETRIES) return;

  const wish = Storage.getString('mywish');
  const note = Storage.getString('mynote');
  const from = Storage.getString('name');
  if (!wish?.trim() || !note?.trim() || !from?.trim()) return;

  const result = await attemptOnce();
  Storage.set('sendAttempts', attempts + 1);

  if (result.ok) {
    Storage.set('issent', true);
    Storage.remove('sendLastError');
  } else {
    Storage.set('sendLastError', result.error);
    if (result.unauthorized) {
      _sessionAuthBlocked = true;
    }
  }
}

export async function startSendWithRetry(onUpdate?: () => void): Promise<void> {
  let state = getSendState();

  while (!state.issent && !state.unauthorized && !state.maxed) {
    await trySendWish();
    onUpdate?.();
    state = getSendState();

    if (state.issent || state.unauthorized || state.maxed) break;

    await new Promise<void>((r) => setTimeout(r, RETRY_DELAY_MS));
    state = getSendState();
  }
}

export async function retryOnceSend(onUpdate?: () => void): Promise<void> {
  const attempts = Storage.getNumber('sendAttempts') ?? 0;
  if (attempts >= MAX_SEND_RETRIES) {
    Storage.set('sendAttempts', MAX_SEND_RETRIES - 1);
  }
  _sessionAuthBlocked = false;
  await trySendWish();
  onUpdate?.();
}
