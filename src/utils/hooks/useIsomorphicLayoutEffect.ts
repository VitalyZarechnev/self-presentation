import { useEffect, useLayoutEffect } from 'react';

import { isBrowser } from '@utils/environment/isBrowser';

export const useIsomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect;
