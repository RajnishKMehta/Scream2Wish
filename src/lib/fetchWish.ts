import { Storage } from '@lib/storage';

const WISHES_INDEX_URL =
  'https://raw.githubusercontent.com/RajnishKMehta/Scream2Wish-wishes/refs/heads/main/wishes/index.json';

const WISH_BASE_URL =
  'https://raw.githubusercontent.com/RajnishKMehta/Scream2Wish-wishes/refs/heads/main/wishes';

interface WishData {
  wish: string;
  note: string;
  from: string;
  at: number;
}

export interface FetchWishResult {
  ok: boolean;
  errorReason?: string;
}

export async function fetchAndStoreRandomWish(): Promise<FetchWishResult> {
  try {
    const indexRes = await fetch(WISHES_INDEX_URL);
    if (!indexRes.ok) {
      return { ok: false, errorReason: `Could not reach the wishes server (status ${indexRes.status}).` };
    }

    const ids: string[] = await indexRes.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return { ok: false, errorReason: 'No wishes have been shared yet. Be the first!' };
    }

    const randomId = ids[Math.floor(Math.random() * ids.length)];
    if (!randomId) {
      return { ok: false, errorReason: 'Could not select a random wish.' };
    }

    const wishRes = await fetch(`${WISH_BASE_URL}/${randomId}.json`);
    if (!wishRes.ok) {
      return { ok: false, errorReason: `Could not load the selected wish (status ${wishRes.status}).` };
    }

    const data: WishData = await wishRes.json();

    Storage.set('rnote', data.note ?? '');
    Storage.set('rnotefrom', data.from ?? '');
    Storage.set('rnoteat', String(data.at ?? 0));

    return { ok: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown network error.';
    return { ok: false, errorReason: `Network error: ${msg}` };
  }
}
