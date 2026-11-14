(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AdlModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function positive(n) {
    if (!Number.isFinite(n) || n <= 0) throw new RangeError('价格和名义价值必须大于零');
    return n;
  }
  function afterAdl(notional, entry, close) {
    positive(notional); positive(entry); positive(close);
    const initialCoins = notional / entry;
    const pnlCoins = notional * (1 / close - 1 / entry);
    return { initialCoins, pnlCoins, coins: initialCoins + pnlCoins };
  }
  function value(coins, notional, open, price) {
    positive(price); positive(open);
    if (!Number.isFinite(coins) || !Number.isFinite(notional) || notional < 0) throw new RangeError('无效仓位');
    return (coins + notional * (1 / price - 1 / open)) * price;
  }
  function deltaCoins(coins, notional, open) {
    positive(open);
    return coins - notional / open;
  }
  function fillSell(bids, target, minPrice = 0) {
    if (!Array.isArray(bids) || !Number.isFinite(target) || target < 0 || !Number.isFinite(minPrice) || minPrice < 0) throw new RangeError('盘口参数无效');
    let remaining = target, inverse = 0, worst = null;
    for (const [price, size] of bids) {
      if (price < minPrice) break;
      if (!(price > 0 && size > 0)) continue;
      const fill = Math.min(remaining, size);
      inverse += fill * 10 / price;
      remaining -= fill;
      if (fill) worst = price;
      if (remaining <= 0) break;
    }
    const filled = target - remaining;
    return { filled, remaining, inverse, worst, avgPrice: filled ? filled * 10 / inverse : null };
  }
  return { afterAdl, value, deltaCoins, fillSell };
});
