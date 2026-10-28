'use strict';

function nextMarker(current, date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('date must use YYYY-MM-DD');
  if (current?.date === date) return null;
  const total = Number.isSafeInteger(current?.total) && current.total > 0 ? current.total + 1 : 1;
  return { date, total };
}

module.exports = { nextMarker };
