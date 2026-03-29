"use client";

import { useState, useCallback } from "react";

export function useBearingSmoothing() {
  const [smoothedBearing, setSmoothedBearing] = useState<number>(0);

  const updateBearing = useCallback((incoming: number) => {
    setSmoothedBearing((prev) => {
      // Handle the wrapping issue (360 -> 0)
      let diff = incoming - prev;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const alpha = 0.15;
      const next = (prev + diff * alpha + 360) % 360;
      return next;
    });
  }, []);

  return { smoothedBearing, updateBearing };
}
