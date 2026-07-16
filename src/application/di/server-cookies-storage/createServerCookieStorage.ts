import { cache } from 'react';

import { ServerCookieStorage } from '@data/storage/ServerCookieStorageImpl';

export const getServerCookieStorage = cache((): ServerCookieStorage => new ServerCookieStorage());
