export function authDestination(next: string | null): string {
  return next === '/auth/reset' ? '/auth/reset' : '/learn';
}
