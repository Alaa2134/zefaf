// Admin auth — simple env-based for MVP
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "zefaf_admin";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "zefaf2026";
}

export async function isAdmin(): Promise<boolean> {
  const c = await cookies();
  return c.get(ADMIN_COOKIE)?.value === getAdminPassword();
}
