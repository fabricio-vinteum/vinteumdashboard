/**
 * Vinteum Executive Dashboard - Authentication Service
 * 
 * Arquitetura de Segurança:
 * - A senha NUNCA fica exposta em texto puro no código nem no GitHub.
 * - Utiliza criptografia unidirecional SHA-256 com Salt.
 * - As variáveis seguras são injetadas em tempo de build via Secrets do GitHub Actions
 *   ou via arquivo .env.local (que é 100% ignorado pelo .gitignore).
 */

const STORAGE_KEY = 'vinteum_dashboard_auth_token';
const STORAGE_USER = 'vinteum_dashboard_auth_user';

// Variáveis injetadas pelo Vite (via .env.local ou GitHub Secrets)
// Se não houver definição de env, utiliza fallback padrão seguro de desenvolvimento
const EXPECTED_USER = (import.meta.env.VITE_AUTH_USER || 'admin').trim().toLowerCase();
const EXPECTED_SALT = import.meta.env.VITE_AUTH_SALT || 'vinteum_dashboard_secure_salt_2026';
const EXPECTED_HASH = (import.meta.env.VITE_AUTH_HASH || '94eacec7f4c0ea5dd4092a9acd664969c6ee735c675dbe95bdd6bf65813e011d').toLowerCase();

/**
 * Calcula o hash SHA-256 usando a Web Crypto API nativa do navegador
 */
export async function computeSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  if (window.crypto && window.crypto.subtle) {
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Fallback simples para ambientes legados sem Web Crypto
    return fallbackHash(text);
  }
}

/**
 * Fallback de hash simples caso o navegador não possua window.crypto.subtle (raríssimo)
 */
function fallbackHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Valida as credenciais digitadas pelo usuário contra o Hash SHA-256
 */
export async function authenticateUser(username, password, remember = false) {
  if (!username || !password) {
    return { success: false, error: 'Por favor preencha o usuário e a senha.' };
  }

  const cleanUser = username.trim().toLowerCase();
  const cleanPass = password.trim();

  // Verifica usuário
  if (cleanUser !== EXPECTED_USER) {
    return { success: false, error: 'Credenciais inválidas. Verifique usuário e senha.' };
  }

  // Gera o hash combinado: usuario:senha:salt e também apenas senha:salt
  const combinedUserPass = `${cleanUser}:${cleanPass}:${EXPECTED_SALT}`;
  const purePass = `${cleanPass}:${EXPECTED_SALT}`;

  const hashUserPass = await computeSHA256(combinedUserPass);
  const hashPurePass = await computeSHA256(purePass);

  const isMatch = (hashUserPass.toLowerCase() === EXPECTED_HASH) || 
                  (hashPurePass.toLowerCase() === EXPECTED_HASH);

  if (isMatch) {
    // Cria token de sessão
    const sessionToken = btoa(`${cleanUser}:${Date.now()}`);
    
    if (remember) {
      localStorage.setItem(STORAGE_KEY, sessionToken);
      localStorage.setItem(STORAGE_USER, cleanUser);
    } else {
      sessionStorage.setItem(STORAGE_KEY, sessionToken);
      sessionStorage.setItem(STORAGE_USER, cleanUser);
    }

    return { success: true, user: cleanUser };
  }

  return { success: false, error: 'Credenciais inválidas. Verifique usuário e senha.' };
}

/**
 * Verifica se o usuário atual possui sessão ativa
 */
export function isUserAuthenticated() {
  const localToken = localStorage.getItem(STORAGE_KEY);
  const sessionToken = sessionStorage.getItem(STORAGE_KEY);
  return Boolean(localToken || sessionToken);
}

/**
 * Obtém o nome do usuário autenticado
 */
export function getAuthenticatedUser() {
  return localStorage.getItem(STORAGE_USER) || sessionStorage.getItem(STORAGE_USER) || 'Administrador';
}

/**
 * Realiza logout e invalida a sessão
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_USER);
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_USER);
}
