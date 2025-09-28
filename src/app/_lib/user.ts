import { User } from "@/types";

async function getUser(email: string) {
  const response = await fetch(
    `${process.env.NEXT_AUTH_URL}/api/user/${email}`
  );
  return response.json();
}

async function createUser(user: User) {
  const response = await fetch(`${process.env.NEXT_AUTH_URL}/api/user`, {
    method: "POST",
    body: JSON.stringify(user),
  });
  return response.json();
}

export { getUser, createUser };
