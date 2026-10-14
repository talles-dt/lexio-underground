export function authDestination(next: string | null): string {
  return next === '/auth/reset' ? '/auth/reset' : '/learn';
}

export function authErrorMessage(reason: string | null): string {
  if (reason === 'session') return 'Não foi possível abrir a sessão pelo link. Se você acabou de confirmar seu e-mail, tente entrar com e-mail e senha. Abrir o link em outro navegador pode impedir a entrada automática.';
  if (reason === 'recovery') return 'Não foi possível abrir a recuperação de senha. Abra o link no mesmo navegador em que o solicitou ou peça um novo link.';
  return reason ? 'Não foi possível validar este link. Se seu e-mail já foi confirmado, entre com e-mail e senha; caso contrário, solicite um novo link.' : '';
}
