// Admin JWT storage. Uses sessionStorage (cleared when the browser tab closes),
// which is appropriate for an admin panel — never localStorage for long-lived
// secrets, and never a hardcoded token in code.
const KEY = 'tata_admin_token';

let memoryToken: string | null = null;

export function setAdminToken(token: string) {
  memoryToken = token;
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    /* sessionStorage unavailable — memory fallback still works for this tab session */
  }
}

export function getAdminToken(): string | null {
  if (memoryToken) return memoryToken;
  try {
    memoryToken = sessionStorage.getItem(KEY);
  } catch {
    memoryToken = null;
  }
  return memoryToken;
}

export function clearAdminToken() {
  memoryToken = null;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
