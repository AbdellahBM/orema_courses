import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

/*
  API route for handling class likes.
  
  PERSISTENCE STRATEGY:
  1. Vercel/Production: Uses Vercel KV (Redis) for persistent shared storage.
     - Requires 'Create KV Database' in Vercel Project Settings.
     - Environment variables: KV_REST_API_URL, KV_REST_API_TOKEN (auto-added by Vercel).
  
  2. Local Development: Uses local JSON file (data/likes.json).
     - Works without internet/database.
     - Data persists locally in the project folder.
*/

// Local storage configuration
const DATA_DIR = path.join(process.cwd(), 'data');
const LIKES_FILE_PATH = path.join(DATA_DIR, 'likes.json');

// --- HELPER FUNCTIONS ---

// Check if we should use Vercel KV
const shouldUseKV = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

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
      const likes = await kv.get<Record<string, number>>('class_likes');
      return likes || {};
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

// Write likes (Abstracted)
async function saveLikes(likes: Record<string, number>) {
  if (shouldUseKV) {
    try {
      await kv.set('class_likes', likes);
    } catch (error) {
      console.error('KV Write Error:', error);
    }
  } else {
    // Local Fallback
    ensureLocalStorage();
    try {
      fs.writeFileSync(LIKES_FILE_PATH, JSON.stringify(likes, null, 2), 'utf-8');
    } catch (error) {
      console.error('Local Write Error:', error);
    }
  }
}

// --- API HANDLERS ---

export async function GET() {
  try {
    const likes = await getLikes();
    return NextResponse.json({ likes });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ likes: {} });
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

    const likes = await getLikes();
    const currentCount = likes[classId] || 0;

    if (action === 'like') {
      likes[classId] = currentCount + 1;
    } else if (action === 'unlike') {
      likes[classId] = Math.max(0, currentCount - 1);
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    await saveLikes(likes);

    return NextResponse.json({ 
      success: true, 
      count: likes[classId] 
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
