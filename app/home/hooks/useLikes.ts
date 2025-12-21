'use client';

import { useState, useEffect } from 'react';

/*
  FILE PURPOSE:
  `app/home/hooks/useLikes.ts` centralizes the client-side likes behavior used by `ScheduleCard`.

  UTILITY IN APP:
  - Keeps the like counter visible (starts from hardcoded initial values in code).
  - Persists the user's "liked" state locally (per-device) while the shared counter is stored
    on the server via `/api/likes`.

  IMPORTANT CHANGES / REASONING:
  - Uses `cache: 'no-store'` for `/api/likes` requests to avoid stale cached responses in
    production (Vercel/CDN/browser caching can otherwise make counters look inconsistent).
*/

export function useLikes(classId: string, initialLikes = 0) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load likes from server on mount
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch('/api/likes', { cache: 'no-store' });
        const data = await response.json();
        // If server has a value, it wins. Otherwise keep the hardcoded initial value.
        const serverCount = data.likes?.[classId];
        if (typeof serverCount === 'number') setLikes(serverCount);
        
        // Check if user has liked (stored in localStorage for user-specific state)
        if (typeof window !== 'undefined') {
          try {
            const userLikes = localStorage.getItem('user-likes');
            if (userLikes) {
              const userLikesData = JSON.parse(userLikes);
              setIsLiked(userLikesData[classId] || false);
            }
          } catch {
            // If localStorage is corrupted, reset it gracefully.
            localStorage.removeItem('user-likes');
            setIsLiked(false);
          }
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikes();
  }, [classId]);

  const toggleLike = async () => {
    // Optimistic update
    const previousLikes = likes;
    const previousIsLiked = isLiked;
    
    if (isLiked) {
      setLikes(Math.max(0, likes - 1));
      setIsLiked(false);
    } else {
      setLikes(likes + 1);
      setIsLiked(true);
    }

    // Update user's like state in localStorage
    if (typeof window !== 'undefined') {
      try {
        const userLikes = localStorage.getItem('user-likes');
        const userLikesData = userLikes ? JSON.parse(userLikes) : {};
        userLikesData[classId] = !isLiked;
        localStorage.setItem('user-likes', JSON.stringify(userLikesData));
      } catch {
        // If localStorage is corrupted, reset it gracefully.
        localStorage.removeItem('user-likes');
      }
    }

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId,
          action: isLiked ? 'unlike' : 'like',
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update with server response
        setLikes(data.count);
      } else {
        // Revert on error
        setLikes(previousLikes);
        setIsLiked(previousIsLiked);
      }
    } catch (error) {
      console.error('Error updating like:', error);
      // Revert on error
      setLikes(previousLikes);
      setIsLiked(previousIsLiked);
    }
  };

  return { likes, isLiked, toggleLike, isLoading };
}
