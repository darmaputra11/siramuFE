// src/utils/authStorage.ts
const LS_TOKEN_KEY = "token";
const LS_USER_KEY = "user";
const SS_TOKEN_KEY = "token";
const SS_USER_KEY = "user";
const REMEMBER_KEY = "remember_me";

function getRemember(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === "1";
}

export function setRemember(flag: boolean) {
  if (flag) localStorage.setItem(REMEMBER_KEY, "1");
  else localStorage.removeItem(REMEMBER_KEY);
}

export function setAuth(token: string, user?: any) {
  if (getRemember()) {
    localStorage.setItem(LS_TOKEN_KEY, token);
    if (user) localStorage.setItem(LS_USER_KEY, JSON.stringify(user));
    sessionStorage.removeItem(SS_TOKEN_KEY);
    sessionStorage.removeItem(SS_USER_KEY);
  } else {
    sessionStorage.setItem(SS_TOKEN_KEY, token);
    if (user) sessionStorage.setItem(SS_USER_KEY, JSON.stringify(user));
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_USER_KEY);
  }
}

export function clearAuth() {
  localStorage.removeItem(LS_TOKEN_KEY);
  localStorage.removeItem(LS_USER_KEY);
  sessionStorage.removeItem(SS_TOKEN_KEY);
  sessionStorage.removeItem(SS_USER_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

export function getToken(): string | null {
  const remember = getRemember();
  return remember
    ? localStorage.getItem(LS_TOKEN_KEY)
    : sessionStorage.getItem(SS_TOKEN_KEY) || localStorage.getItem(LS_TOKEN_KEY);
}

export function setToken(token: string) {
  if (getRemember()) localStorage.setItem(LS_TOKEN_KEY, token);
  else sessionStorage.setItem(SS_TOKEN_KEY, token);
}

export function getUser<T = any>(): T | null {
  const remember = getRemember();
  const raw = remember
    ? localStorage.getItem(LS_USER_KEY)
    : sessionStorage.getItem(SS_USER_KEY) || localStorage.getItem(LS_USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}
