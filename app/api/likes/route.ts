/*
  FILE PURPOSE:
  `app/api/likes/route.ts` implements the shared "likes" backend used by the calendar UI.
  It exposes:
  - GET  /api/likes   -> returns a map of { [classId]: count }
  - POST /api/likes  -> increments/decrements a class like counter and returns the new count

  UTILITY IN APP:
  Likes must be visible to all visitors and persist across reloads. This route provides that
  persistence in both local development and production (Vercel).

  IMPORTANT CHANGES / REASONING:
  - Production (Vercel KV) now uses atomic Redis hash increments (HINCRBY) instead of
    read-modify-write of a single JSON blob. This prevents lost updates when multiple users
    like at the same time.
  - Responses are marked no-store and the route is forced dynamic to avoid caching issues
    that can make counters appear "stale" or inconsistent in production.
*/

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Local storage configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const LIKES_FILE_PATH = path.join(DATA_DIR, 'likes.json');

// --- HELPER FUNCTIONS ---

// Check if we should use Vercel KV
const shouldUseKV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

// KV storage key (versioned to avoid Redis "wrong type" errors if an older deployment
// stored a JSON blob at the previous key name).
const KV_LIKES_HASH_KEY = 'class_likes_v2';
const KV_LEGACY_JSON_KEY = 'class_likes';

// Local: Ensure data directory exists and file is valid
function ensureLocalStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LIKES_FILE_PATH)) {
      fs.writeFileSync(LIKES_FILE_PATH, '{}', 'utf-8');
    } else {
      // Validate existing file - reset if invalid
      try {
        const content = fs.readFileSync(LIKES_FILE_PATH, 'utf-8').trim();
        if (!content || content === '') {
          fs.writeFileSync(LIKES_FILE_PATH, '{}', 'utf-8');
        } else {
          // Try to parse to validate JSON
          JSON.parse(content);
        }
      } catch (error) {
        // File is corrupted, reset it
        console.warn('Invalid JSON file detected, resetting to empty object');
        fs.writeFileSync(LIKES_FILE_PATH, '{}', 'utf-8');
      }
    }
  } catch (error) {
    console.error('Local storage init error:', error);
  }
}

// Read likes (Abstracted)
async function getLikes(): Promise<Record<string, number>> {
  if (shouldUseKV) {
    try {
      const likes = await kv.hgetall<Record<string, string | number>>(KV_LIKES_HASH_KEY);
      if (!likes) {
        // Backward compatibility: migrate from legacy JSON blob key if present.
        const legacy = await kv.get<Record<string, number>>(KV_LEGACY_JSON_KEY);
        if (legacy && typeof legacy === 'object') {
          try {
            await kv.hset(KV_LIKES_HASH_KEY, legacy);
          } catch (migrateError) {
            console.error('KV Migration Error:', migrateError);
          }
          return legacy;
        }
        return {};
      }
      const parsed: Record<string, number> = {};
      for (const [classId, raw] of Object.entries(likes)) {
        const n = typeof raw === 'number' ? raw : Number(raw);
        parsed[classId] = Number.isFinite(n) && n >= 0 ? n : 0;
      }
      return parsed;
    } catch (error) {
      console.error('KV Read Error:', error);
      return {};
    }
  } else {
    // Local Fallback
    ensureLocalStorage();
    try {
      const data = fs.readFileSync(LIKES_FILE_PATH, 'utf-8').trim();
      if (!data || data === '') {
        return {};
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Local Read Error:', error);
      // Reset file if corrupted
      try {
        fs.writeFileSync(LIKES_FILE_PATH, '{}', 'utf-8');
      } catch (writeError) {
        console.error('Failed to reset file:', writeError);
      }
      return {};
    }
  }
}

// Local: Write likes
async function saveLikesLocal(likes: Record<string, number>) {
  ensureLocalStorage();
  try {
    fs.writeFileSync(LIKES_FILE_PATH, JSON.stringify(likes, null, 2), 'utf-8');
  } catch (error) {
    console.error('Local Write Error:', error);
  }
}

// KV: Atomic increment/decrement for a single class
async function mutateLikeKV(classId: string, action: 'like' | 'unlike'): Promise<number> {
  const delta = action === 'like' ? 1 : -1;
  let nextCount = await kv.hincrby(KV_LIKES_HASH_KEY, classId, delta);
  // Clamp to 0 to avoid negatives if "unlike" is called too many times.
  if (nextCount < 0) {
    await kv.hset(KV_LIKES_HASH_KEY, { [classId]: 0 });
    nextCount = 0;
  }
  return nextCount;
}

// --- API HANDLERS ---

export async function GET() {
  try {
    const likes = await getLikes();
    const res = NextResponse.json({ likes });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  } catch (error) {
    console.error('GET Error:', error);
    const res = NextResponse.json({ likes: {} });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { classId, action } = body;

    if (!classId || !action) {
      return NextResponse.json(
        { error: 'Missing classId or action' },
        { status: 400 }
      );
    }

    if (action !== 'like' && action !== 'unlike') {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    let nextCount: number;

    if (shouldUseKV) {
      nextCount = await mutateLikeKV(classId, action);
    } else {
      const likes = await getLikes();
      const currentCount = likes[classId] || 0;
      likes[classId] = action === 'like' ? currentCount + 1 : Math.max(0, currentCount - 1);
      await saveLikesLocal(likes);
      nextCount = likes[classId];
    }

    const res = NextResponse.json({
      success: true,
      count: nextCount,
    });
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  } catch (error) {
    console.error('POST Error:', error);
    const res = NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  }
}
