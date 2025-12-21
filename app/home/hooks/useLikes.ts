'use client';

import { useState, useEffect } from 'react';

/*
  Custom hook to manage likes for class sessions.
  Fetches likes from server API and updates them persistently.
  Uses optimistic updates for better UX.
*/

export function useLikes(classId: string) {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load likes from server on mount
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch('/api/likes');
        const data = await response.json();
        const count = data.likes?.[classId] || 0;
        setLikes(count);
        
        // Check if user has liked (stored in localStorage for user-specific state)
        if (typeof window !== 'undefined') {
          const userLikes = localStorage.getItem('user-likes');
          if (userLikes) {
            const userLikesData = JSON.parse(userLikes);
            setIsLiked(userLikesData[classId] || false);
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
      const userLikes = localStorage.getItem('user-likes');
      const userLikesData = userLikes ? JSON.parse(userLikes) : {};
      userLikesData[classId] = !isLiked;
      localStorage.setItem('user-likes', JSON.stringify(userLikesData));
    }

    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
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
