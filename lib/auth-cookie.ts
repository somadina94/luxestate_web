/**
 * Client-side auth cookie helpers. Used so middleware can read the token.
 * Cookie is set on login and cleared on logout.
 */
const AUTH_COOKIE_NAME = "luxestate_access_token";
const AUTH_COOKIE_MAX_AGE_DAYS = 7;

export function setAuthCookie(accessToken: string) {
  const maxAge = AUTH_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(accessToken)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`;
}

export function getAuthCookie() {
  return (
    document.cookie.split("; ").reduce(
      (acc, cookie) => {
        const [key, value] = cookie.split("=");
        return { ...acc, [key]: value };
      },
      {} as Record<string, string>,
    ) || null
  );
}

export { AUTH_COOKIE_NAME };
