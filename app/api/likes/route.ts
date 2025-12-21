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

// Find existing Gist by searching user's gists
async function findExistingGist(): Promise<string | null> {
  try {
    const response = await fetch('https://api.github.com/gists', {
      method: 'GET',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const gists = await response.json();
    // Find gist that contains our filename
    const existingGist = gists.find((gist: any) => 
      gist.files && gist.files[GIST_FILENAME]
    );
    
    return existingGist ? existingGist.id : null;
  } catch (error) {
    console.error('Error finding existing Gist:', error);
    return null;
  }
}

// Read likes from GitHub Gist
async function getLikesFromGist(): Promise<Record<string, number>> {
  try {
    // First try environment variable, then cached, then search for existing
    let gistId = GIST_ID || cachedGistId;
    
    if (!gistId) {
      // Search for existing Gist
      gistId = await findExistingGist();
      if (gistId) {
        cachedGistId = gistId;
      }
    }

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
        // Gist doesn't exist, clear cache and return empty
        cachedGistId = '';
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
    // First try environment variable, then cached, then search for existing
    let gistId = GIST_ID || cachedGistId;
    
    if (!gistId) {
      // Search for existing Gist before creating new one
      gistId = await findExistingGist();
      if (gistId) {
        cachedGistId = gistId;
      }
    }

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
        // If creation fails (maybe duplicate), try to find existing
        if (createResponse.status === 422) {
          gistId = await findExistingGist();
          if (gistId) {
            cachedGistId = gistId;
            // Retry update with found Gist ID
            return await saveLikesToGist(likes);
          }
        }
        throw new Error(`Failed to create Gist: ${createResponse.status}`);
      }

      const createData = await createResponse.json();
      gistId = createData.id;
      cachedGistId = gistId;
      // Log the Gist ID so user can add it to GIST_ID env var for persistence
      console.log(`✅ Created new Gist for likes. Gist ID: ${gistId}`);
      console.log(`💡 To persist across deployments, set GIST_ID=${gistId} in Vercel environment variables`);
      return true;
    } else {
      // Update existing Gist with retry logic for conflicts
      let retries = 3;
      while (retries > 0) {
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

        if (updateResponse.ok) {
          return true;
        }

        // Handle 409 conflict - another instance updated, retry with fresh data
        if (updateResponse.status === 409 && retries > 1) {
          // Wait a bit and retry
          await new Promise(resolve => setTimeout(resolve, 100));
          retries--;
          continue;
        }

        // Handle 404 - Gist was deleted, try to recreate or find new one
        if (updateResponse.status === 404) {
          cachedGistId = '';
          // Try to find existing or will create new one on next attempt
          return await saveLikesToGist(likes);
        }

        throw new Error(`Failed to update Gist: ${updateResponse.status}`);
      }
      
      return false;
    }
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
