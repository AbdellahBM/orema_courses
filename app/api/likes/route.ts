/*
  FILE PURPOSE:
  `app/api/likes/route.ts` implements the shared "likes" backend using GitHub Gist API for simple JSON storage.
  It exposes:
  - GET  /api/likes   -> returns a map of { [classId]: count }
  - POST /api/likes  -> increments/decrements a class like counter and returns the new count

  UTILITY IN APP:
  Likes must be visible to all visitors and persist across reloads. This route uses GitHub Gist API
  (free, requires GitHub token) to store likes in a simple JSON format.

  IMPORTANT CHANGES / REASONING:
  - Uses GitHub Gist API for persistent storage (free, reliable, no credit card needed).
  - Falls back to in-memory storage if Gist is not configured (development mode).
  - Responses are marked no-store to avoid caching issues.

  SETUP INSTRUCTIONS:
  1. Go to https://github.com/settings/tokens
  2. Click "Generate new token" → "Generate new token (classic)"
  3. Give it a name like "orematanger-likes"
  4. Check only "gist" permission
  5. Copy the token
  6. In Vercel: Project Settings → Environment Variables → Add GITHUB_TOKEN
  7. (Optional) Set GIST_ID if you want to use an existing gist, otherwise a new one will be created
*/

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GitHub Gist configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GIST_ID = process.env.GIST_ID || ''; // Optional: existing gist ID, otherwise creates new one
const GIST_FILENAME = 'orematanger-likes.json';

// In-memory fallback (for development or if Gist is not configured)
let inMemoryLikes: Record<string, number> = {};
let cachedGistId = GIST_ID; // Cache the Gist ID once created

// Use GitHub Gist if token is provided, otherwise use in-memory
const useGist = !!GITHUB_TOKEN;

// Read likes from GitHub Gist
async function getLikesFromGist(): Promise<Record<string, number>> {
  try {
    const gistId = cachedGistId || GIST_ID;
    if (!gistId) {
      // No Gist ID yet - will be created on first write
      return {};
    }

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Gist doesn't exist yet, return empty (will be created on first write)
        return {};
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const file = data.files[GIST_FILENAME];
    if (!file || !file.content) {
      return {};
    }

    return JSON.parse(file.content);
  } catch (error) {
    console.error('Gist Read Error:', error);
    return {};
  }
}

// Save likes to GitHub Gist
async function saveLikesToGist(likes: Record<string, number>): Promise<boolean> {
  try {
    let gistId = cachedGistId || GIST_ID;

    // Create Gist if it doesn't exist
    if (!gistId) {
      const createResponse = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: 'OreMatanger Class Likes Counter',
          public: false, // Private gist
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(likes, null, 2),
            },
          },
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create Gist: ${createResponse.status}`);
      }

      const createData = await createResponse.json();
      gistId = createData.id;
      cachedGistId = gistId;
      // Log the Gist ID so user can add it to GIST_ID env var for persistence
      console.log(`✅ Created new Gist for likes. Gist ID: ${gistId}`);
      console.log(`💡 To persist across deployments, set GIST_ID=${gistId} in Vercel environment variables`);
    } else {
      // Update existing Gist
      const updateResponse = await fetch(`https://api.github.com/gists/${gistId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          files: {
            [GIST_FILENAME]: {
              content: JSON.stringify(likes, null, 2),
            },
          },
        }),
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update Gist: ${updateResponse.status}`);
      }
    }

    return true;
  } catch (error) {
    console.error('Gist Write Error:', error);
    return false;
  }
}

// Read likes (Abstracted)
async function getLikes(): Promise<Record<string, number>> {
  if (useGist) {
    const likes = await getLikesFromGist();
    if (Object.keys(likes).length > 0) {
      // Update in-memory cache
      inMemoryLikes = { ...likes };
      return likes;
    }
    // If empty from Gist, return in-memory if available
    return Object.keys(inMemoryLikes).length > 0 ? inMemoryLikes : {};
  } else {
    // In-memory only (development mode)
    return inMemoryLikes;
  }
}

// Save likes (Abstracted)
async function saveLikes(likes: Record<string, number>): Promise<boolean> {
  // Always update in-memory cache first
  inMemoryLikes = { ...likes };

  if (useGist) {
    const success = await saveLikesToGist(likes);
    if (!success) {
      // If Gist fails, at least we have in-memory cache
      console.warn('Failed to save to Gist, using in-memory cache only');
    }
    return success;
  } else {
    // In-memory only (development mode) - always succeeds
    return true;
  }
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

    // Get current likes
    const likes = await getLikes();
    const currentCount = likes[classId] || 0;
    
    // Update count
    if (action === 'like') {
      likes[classId] = currentCount + 1;
    } else {
      likes[classId] = Math.max(0, currentCount - 1);
    }

    // Save updated likes
    await saveLikes(likes);
    const nextCount = likes[classId];

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
