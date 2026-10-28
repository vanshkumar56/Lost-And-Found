/* Email kept between the signup form and the OTP verification screen. */
export const PENDING_EMAIL_KEY = "findback-pending-email";

export function getPendingEmail(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(PENDING_EMAIL_KEY) ?? "";
}

export function setPendingEmail(email: string) {
  sessionStorage.setItem(PENDING_EMAIL_KEY, email);
}

export function clearPendingEmail() {
  sessionStorage.removeItem(PENDING_EMAIL_KEY);
}
