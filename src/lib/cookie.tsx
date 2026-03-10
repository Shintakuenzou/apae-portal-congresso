export function setAuthCookie(token: string, exp: string) {
  const unixToNumber = Number(exp);
  const expData = new Date(unixToNumber * 100);

  console.log("setando token: ", token, exp);

  document.cookie = `token${token}; expires=${expData.toUTCString()}; path=/; SameSite=Strict`;
  document.cookie = `tokenExp=${exp}; expires=${expData.toUTCString()}; path=/; SameSite=Strict`;
}

export function getAuthCookie(name: string): string {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : "";
}

export function clearAuthCookies() {
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "tokenExp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export function isTokenExpired(exp: string | number): boolean {
  return Date.now() > Number(exp) * 1000;
}
