import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/*
  API route for handling class likes.
  Stores likes in a JSON file for persistence across all visitors.
  Minimal server setup - just file-based storage.
*/

const LIKES_FILE_PATH = path.join(process.cwd(), 'data', 'likes.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read likes from file
function readLikes(): Record<string, number> {
  ensureDataDir();
  try {
    if (fs.existsSync(LIKES_FILE_PATH)) {
      const data = fs.readFileSync(LIKES_FILE_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading likes:', error);
  }
  return {};
}

// Write likes to file
function writeLikes(likes: Record<string, number>) {
  ensureDataDir();
  try {
    fs.writeFileSync(LIKES_FILE_PATH, JSON.stringify(likes, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing likes:', error);
  }
}

// GET - Fetch all likes
export async function GET() {
  try {
    const likes = readLikes();
    return NextResponse.json({ likes });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

// POST - Update like count
export async function POST(request: NextRequest) {
  try {
    const { classId, action } = await request.json();

    if (!classId || !action) {
      return NextResponse.json(
        { error: 'Missing classId or action' },
        { status: 400 }
      );
    }

    const likes = readLikes();
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

    writeLikes(likes);

    return NextResponse.json({ 
      success: true, 
      count: likes[classId] 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update like' },
      { status: 500 }
    );
  }
}

