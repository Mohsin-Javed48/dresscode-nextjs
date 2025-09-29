import { User } from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function getUser(email: string) {
  const response = await fetch(`${API_BASE}/api/user/email/${email}`);
  return response.json();
}

async function createUser(user: User) {
  const response = await fetch(`${API_BASE}/api/user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  return response.json();
}

export { getUser, createUser };
