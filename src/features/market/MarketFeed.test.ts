import { describe, expect, it, vi } from 'vitest';

import { TTrade } from '@domain/market/models/Trade';

import { MarketFeed } from './MarketFeed';

function trade(price: number, overrides: Partial<TTrade> = {}): TTrade {
  return { price, qty: 1, buy: true, time: 0, ...overrides };
}

describe('MarketFeed', () => {
  it('starts empty and connecting', () => {
    const feed = new MarketFeed(3, 5);
    const snapshot = feed.getSnapshot();

    expect(snapshot.status).toBe('connecting');
    expect(snapshot.last).toBe(0);
    expect(snapshot.changePercent).toBeNull();
    expect(snapshot.tape).toHaveLength(0);
  });

  it('records trades newest-first and tracks prev/last', () => {
    const feed = new MarketFeed(3, 5);
    feed.pushTrade(trade(100));
    feed.pushTrade(trade(110));
    const snapshot = feed.getSnapshot();

    expect(snapshot.last).toBe(110);
    expect(snapshot.prev).toBe(100);
    expect(snapshot.tape.map((entry) => entry.trade.price)).toEqual([110, 100]);
    expect(snapshot.tape[0].id).not.toBe(snapshot.tape[1].id);
  });

  it('caps the tape and history at their configured sizes', () => {
    const feed = new MarketFeed(2, 3);
    [1, 2, 3, 4].forEach((price) => feed.pushTrade(trade(price)));
    const snapshot = feed.getSnapshot();

    expect(snapshot.tape.map((entry) => entry.trade.price)).toEqual([4, 3]);
    expect(snapshot.history).toEqual([2, 3, 4]);
  });

  it('anchors change % to the first observed price', () => {
    const feed = new MarketFeed(3, 5);
    feed.pushTrade(trade(200));
    feed.pushTrade(trade(220));

    expect(feed.getSnapshot().changePercent).toBeCloseTo(10);
  });

  it('re-anchors and clears warm-up history when it goes live', () => {
    const feed = new MarketFeed(3, 5);
    feed.pushTrade(trade(9999));
    feed.setStatus('live');

    expect(feed.getSnapshot().history).toEqual([]);
    expect(feed.getSnapshot().changePercent).toBeNull();

    feed.pushTrade(trade(50));
    feed.pushTrade(trade(55));
    expect(feed.getSnapshot().changePercent).toBeCloseTo(10);
  });

  it('notifies subscribers on change and stops after unsubscribe', () => {
    const feed = new MarketFeed(3, 5);
    const listener = vi.fn();
    const unsubscribe = feed.subscribe(listener);

    feed.pushTrade(trade(100));
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    feed.pushTrade(trade(101));
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('produces a fresh snapshot reference only when it changes', () => {
    const feed = new MarketFeed(3, 5);
    const before = feed.getSnapshot();
    feed.pushTrade(trade(100));
    const after = feed.getSnapshot();

    expect(after).not.toBe(before);
    expect(feed.getSnapshot()).toBe(after);
  });
});
