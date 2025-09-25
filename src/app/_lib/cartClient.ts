export type CartItemInput = {
  productId: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  quantity?: number;
};

export type CartTotals = {
  subtotal: number;
  tax?: number;
  shipping: number;
  total: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export function getOrCreateGuestId(): string {
  if (typeof window === "undefined") return "";
  const KEY = "dresscode_guest_id";
  const userRaw = localStorage.getItem("user");
  try {
    if (userRaw) {
      const parsed = JSON.parse(userRaw);
      if (parsed?.id && typeof parsed.id === "string") {
        return parsed.id as string;
      }
    }
  } catch {
    // ignore malformed user storage
  }

  let gid = localStorage.getItem(KEY);
  if (!gid) {
    const gen =
      globalThis.crypto && "randomUUID" in globalThis.crypto
        ? (globalThis.crypto as Crypto).randomUUID()
        : `${Date.now()}-${Math.random()}`;
    gid = gen;
    localStorage.setItem(KEY, gid);
  }
  return gid;
}

export async function fetchCart(userId: string) {
  const res = await fetch(`${API_BASE}/api/cart/${userId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

function emitCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cart:updated"));
  }
}

export async function addItem(userId: string, item: CartItemInput) {
  const res = await fetch(`${API_BASE}/api/cart/${userId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Failed to add item");
  const data = await res.json();
  emitCartUpdated();
  return data;
}

export async function updateQuantity(
  userId: string,
  productId: string,
  options: { size?: string; color?: string; quantity: number }
) {
  const res = await fetch(`${API_BASE}/api/cart/${userId}/items/${productId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error("Failed to update quantity");
  const data = await res.json();
  emitCartUpdated();
  return data;
}

export async function removeItem(
  userId: string,
  productId: string,
  options: { size?: string; color?: string }
) {
  const res = await fetch(`${API_BASE}/api/cart/${userId}/items/${productId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  if (!res.ok) throw new Error("Failed to remove item");
  const data = await res.json();
  emitCartUpdated();
  return data;
}

export async function clearCart(userId: string) {
  const res = await fetch(`${API_BASE}/api/cart/${userId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  const data = await res.json();
  emitCartUpdated();
  return data;
}
