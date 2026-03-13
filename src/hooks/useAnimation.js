'use client';
import { useEffect, useRef, useCallback } from 'react';

export function useAnimation(callback, isPlaying, speed) {
  const rafRef = useRef(null);
  const lastTimeRef = useRef(0);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const getDelay = useCallback(() => {
    return Math.max(50, 1000 - (speed * 9));
  }, [speed]);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      const delay = getDelay();

      if (elapsed >= delay) {
        lastTimeRef.current = timestamp;
        callbackRef.current();
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = 0;
    };
  }, [isPlaying, getDelay]);
}
