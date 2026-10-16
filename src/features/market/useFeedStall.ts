import { useEffect, useState } from 'react';

type TParams = {
  active: boolean;
  hasData: boolean;
  timeout: number;
};

export default function useFeedStall(params: TParams): boolean {
  const { active, hasData, timeout } = params;
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!active || hasData) return undefined;
    const timer = setTimeout(() => setTimedOut(true), timeout);
    return () => clearTimeout(timer);
  }, [active, hasData, timeout]);

  return active && timedOut && !hasData;
}
