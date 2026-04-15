import { Storage } from '@lib/storage';

const WISH_WORKER_URL: string =
  (process.env.EXPO_PUBLIC_WISH_WORKER_URL as string | undefined) ??
  'https://scream2wish.rajnishkmehta.workers.dev';

const WISH_WORKER_API: string =
  (process.env.EXPO_PUBLIC_WISH_WORKER_API as string | undefined) ?? '';

export const MAX_SEND_RETRIES = 6;

let _attempts    = 0;
let _lastError   = '';
let _authBlocked = false;
let _sending     = false;

export interface SendState {
  issent:       boolean;
  attempts:     number;
  lastError:    string;
  unauthorized: boolean;
  maxed:        boolean;
}

export function getSendState(): SendState {
  return {
    issent:       Storage.getBoolean('issent') === true,
    attempts:     _attempts,
    lastError:    _lastError,
    unauthorized: _authBlocked,
    maxed:        _attempts >= MAX_SEND_RETRIES,
  };
}

export function clearSessionAuthBlock(): void {
  _authBlocked = false;
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
      return { ok: false, unauthorized: true, error: 'Server rejected the request (unauthorized).' };
    }

    if (res.status === 200 || res.status === 201) {
      return { ok: true, unauthorized: false, error: '' };
    }

    return { ok: false, unauthorized: false, error: `Server returned status ${res.status}.` };
  } catch (e: unknown) {
    if (e instanceof TypeError) {
      return {
        ok: false,
        unauthorized: false,
        error: 'No internet connection. Check your network and try again.',
      };
    }
    const msg = e instanceof Error ? e.message : 'Unknown error.';
    return { ok: false, unauthorized: false, error: msg };
  }
}

export async function trySendWish(): Promise<void> {
  if (_sending) return;
  if (Storage.getBoolean('issent') === true) return;
  if (_authBlocked) return;
  if (_attempts >= MAX_SEND_RETRIES) return;

  const wish = Storage.getString('mywish');
  const note = Storage.getString('mynote');
  const from = Storage.getString('name');
  if (!wish?.trim() || !note?.trim() || !from?.trim()) return;

  _sending = true;
  try {
    const result = await attemptOnce();
    _attempts += 1;

    if (result.ok) {
      Storage.set('issent', true);
      _lastError = '';
    } else {
      _lastError = result.error;
      if (result.unauthorized) {
        _authBlocked = true;
      }
    }
  } finally {
    _sending = false;
  }
}

export async function startSendWithRetry(onUpdate?: () => void): Promise<void> {
  let loopCount = 0;

  while (
    !Storage.getBoolean('issent') &&
    !_authBlocked &&
    _attempts < MAX_SEND_RETRIES
  ) {
    if (loopCount === 1) {
      await new Promise<void>((r) => setTimeout(r, 3000));
    } else if (loopCount > 1) {
      await new Promise<void>((r) => setTimeout(r, 5000));
    }

    if (Storage.getBoolean('issent') || _authBlocked || _attempts >= MAX_SEND_RETRIES) break;

    await trySendWish();
    onUpdate?.();
    loopCount++;
  }
}

export async function retryOnceSend(onUpdate?: () => void): Promise<void> {
  if (_attempts >= MAX_SEND_RETRIES) {
    _attempts = MAX_SEND_RETRIES - 1;
  }
  _authBlocked = false;
  await trySendWish();
  onUpdate?.();
}
