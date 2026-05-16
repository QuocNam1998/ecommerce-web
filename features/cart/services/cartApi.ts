import { buildPublicCommerceServiceUrl } from "../../../lib/commerceService";

export type ServerCartItem = {
  itemId: string;
  productId: string;
  quantity: number;
};

export type ServerCart = {
  items: ServerCartItem[];
};

async function handleResponse(response: Response): Promise<void> {
  if (!response.ok) {
    throw new Error(`Cart API error: ${response.status}`);
  }
}

export async function fetchServerCart(): Promise<ServerCart> {
  const response = await fetch(buildPublicCommerceServiceUrl("/cart"), {
    credentials: "include"
  });

  if (response.status === 401) {
    return { items: [] };
  }

  if (!response.ok) {
    throw new Error(`Cart API error: ${response.status}`);
  }

  return response.json() as Promise<ServerCart>;
}

export async function addServerCartItem(
  productId: string,
  quantity: number
): Promise<void> {
  try {
    const response = await fetch(
      buildPublicCommerceServiceUrl("/cart/items"),
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
      }
    );

    if (response.status === 401) return;
    await handleResponse(response);
  } catch (error) {
    console.error("Failed to add item to server cart:", error);
  }
}

export async function updateServerCartItem(
  itemId: string,
  quantity: number
): Promise<void> {
  try {
    const response = await fetch(
      buildPublicCommerceServiceUrl(`/cart/items/${itemId}`),
      {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
      }
    );

    if (response.status === 401) return;
    await handleResponse(response);
  } catch (error) {
    console.error("Failed to update server cart item:", error);
  }
}

export async function removeServerCartItem(itemId: string): Promise<void> {
  try {
    const response = await fetch(
      buildPublicCommerceServiceUrl(`/cart/items/${itemId}`),
      {
        method: "DELETE",
        credentials: "include"
      }
    );

    if (response.status === 401) return;
    await handleResponse(response);
  } catch (error) {
    console.error("Failed to remove server cart item:", error);
  }
}

export async function clearServerCart(): Promise<void> {
  try {
    const response = await fetch(
      buildPublicCommerceServiceUrl("/cart"),
      {
        method: "DELETE",
        credentials: "include"
      }
    );

    if (response.status === 401) return;
    await handleResponse(response);
  } catch (error) {
    console.error("Failed to clear server cart:", error);
  }
}
