export function getRevisionItems(items) {
  const now = Date.now();
  return items.filter((it) => {
    if (!it.lastReviewed) return true;
    const diff = now - it.lastReviewed;
    const level = it.reviewLevel || 1;
    if (level === 1) return diff > 1 * 86400000;
    if (level === 2) return diff > 3 * 86400000;
    if (level === 3) return diff > 7 * 86400000;
    return false;
  });
}
