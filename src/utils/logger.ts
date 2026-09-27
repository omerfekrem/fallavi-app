/** Prod'da sessiz, dev'de konuşkan logger. */
export const logger = {
  debug: (...args: unknown[]) => {
    // eslint-disable-next-line no-console
    if (__DEV__) console.log('[fallavi]', ...args);
  },
  warn: (...args: unknown[]) => console.warn('[fallavi]', ...args),
  error: (...args: unknown[]) => console.error('[fallavi]', ...args),
};
