import { expect, it } from 'vitest';
import { readAdminPages } from './admin-data';
it('includes every page in administrator totals beyond the per-response limit', async () => {
  const rows = Array.from({ length: 1201 }, (_, id) => ({ id }));
  const loaded = await readAdminPages((from, to) => Promise.resolve({ data: rows.slice(from, to + 1), error: null }));
  expect(loaded.length).toBe(1201);
  expect(loaded[1200]?.id).toBe(1200);
});
it('rejects partial financial reads instead of reporting incomplete totals', async () => {
  await expect(readAdminPages(() => Promise.resolve({ data: null, error: { message: 'unavailable' } }))).rejects.toThrow('unavailable');
});