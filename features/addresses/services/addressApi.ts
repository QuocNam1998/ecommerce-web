import { buildPublicCommerceServiceUrl } from "@/lib/commerceService";
import type { Address } from "../types/Address";

type AddressResponse = {
  data: Address;
};

type AddressListResponse = {
  data: Address[];
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildPublicCommerceServiceUrl(path), {
    credentials: "include",
    ...init,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    const status = response.status;
    const error = new Error(body.message ?? `Request failed with status ${status}.`);
    (error as Error & { status: number }).status = status;
    throw error;
  }

  return response.json() as Promise<T>;
}

export async function fetchAddresses(): Promise<Address[]> {
  const json = await request<AddressListResponse>("/api/v1/addresses");
  return json.data;
}

export async function createAddress(data: Omit<Address, "id">): Promise<Address> {
  const json = await request<AddressResponse>("/api/v1/addresses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return json.data;
}

export async function updateAddress(
  id: string,
  data: Partial<Omit<Address, "id">>
): Promise<Address> {
  const json = await request<AddressResponse>(`/api/v1/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return json.data;
}

export async function deleteAddress(id: string): Promise<void> {
  await request<unknown>(`/api/v1/addresses/${id}`, {
    method: "DELETE",
  });
}
