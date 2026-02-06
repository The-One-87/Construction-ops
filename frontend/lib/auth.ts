import { api } from "./api";

export type MeResponse = {
  user: { id: string; username: string; role: string; clientId?: string };
  client: any | null;
};

export async function login(username: string, password: string) {
  const data = await api("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) });
  localStorage.setItem("token", data.token);
  return data;
}

export async function me(): Promise<MeResponse> {
  return api("/api/auth/me");
}

export function logout() {
  localStorage.removeItem("token");
}
