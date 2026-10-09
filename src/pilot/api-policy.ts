// Legacy handlers remain unavailable until their own release gates pass.
export function legacyApiStatus(path: string): number | null {
  if (path === '/api/admin/zernio' || path.startsWith('/api/admin/zernio/')) return 410;
  if (!path.startsWith('/api/')) return null;
  if (path === '/api/health') return null;
  if (path.startsWith('/api/admin/') && path !== '/api/admin/seed') return null;
  return 503;
}
