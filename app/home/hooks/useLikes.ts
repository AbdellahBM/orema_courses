'use client';

import { useState, useEffect } from 'react';

/*
  Custom hook to manage likes for class sessions.
  Stores likes in localStorage and persists across page refreshes.
*/

const STORAGE_KEY = 'class-likes';

export function useLikes(classId: string) {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Load likes from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setLikes(data[classId]?.count || 0);
        setIsLiked(data[classId]?.liked || false);
      }
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  }, [classId]);

  const toggleLike = () => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const data = stored ? JSON.parse(stored) : {};

      if (!data[classId]) {
        data[classId] = { count: 0, liked: false };
      }

      if (data[classId].liked) {
        // Unlike
        data[classId].count = Math.max(0, data[classId].count - 1);
        data[classId].liked = false;
      } else {
        // Like
        data[classId].count = (data[classId].count || 0) + 1;
        data[classId].liked = true;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setLikes(data[classId].count);
      setIsLiked(data[classId].liked);
    } catch (error) {
      console.error('Error saving likes:', error);
    }
  };

  return { likes, isLiked, toggleLike };
}

