import { RefObject, useEffect, useState } from 'react';

export function useIsVisible(ref: RefObject<Element | null>, rootMargin = '150px'): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return visible;
}
