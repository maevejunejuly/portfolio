"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LEAVE_DELAY = 150;

export default function useHover() {
  const [on, setOn] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const enter = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setOn(true);
  }, []);

  const leave = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      setOn(false);
    }, LEAVE_DELAY);
  }, []);

  return {
    on,
    props: {
      onMouseEnter: enter,
      onMouseLeave: leave,
      onFocus: enter,
      onBlur: leave,
    },
  };
}
