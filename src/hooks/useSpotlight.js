import { useCallback } from "react";

// Feeds --gx/--gy so a card's glow tracks the cursor, the way the reference
// capability cards do.
export function useSpotlight() {
  return useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--gx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--gy", `${event.clientY - rect.top}px`);
  }, []);
}
