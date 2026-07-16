import { useEffect, useMemo, useSyncExternalStore } from 'react';

import { registry } from '@application/di/AppRegistry';

import { MarketFeed, TMarketSnapshot } from './MarketFeed';

export function useMarketFeed(tapeSize: number, historySize: number, active: boolean): TMarketSnapshot {
  const feed = useMemo(() => new MarketFeed(tapeSize, historySize), [tapeSize, historySize]);

  useEffect(() => {
    if (!active) return undefined;

    const unsubscribe = registry.marketDatasource.subscribe({
      onTrade: (trade) => feed.pushTrade(trade),
      onStatus: (status) => feed.setStatus(status),
    });
    return unsubscribe;
  }, [feed, active]);

  return useSyncExternalStore(feed.subscribe, feed.getSnapshot, feed.getServerSnapshot);
}
