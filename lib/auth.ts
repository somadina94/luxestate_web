import { cookies } from "next/headers";

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("luxestate_access_token")?.value;
  return token || "";
}
