"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { buildPublicCommerceServiceUrl } from "@/lib/commerceService";

export type ProductFormState = {
  errors: Record<string, string>;
  success: boolean;
};

export const INITIAL_PRODUCT_FORM_STATE: ProductFormState = {
  errors: {},
  success: false,
};

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

function parseLines(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function validateProductFields(formData: FormData): {
  errors: Record<string, string>;
  fields: {
    name: string;
    slug: string;
    category: string;
    price: number;
    description: string;
    image: string;
    highlights: string[];
    includes: string[];
  } | null;
} {
  const name = formData.get("name");
  const slug = formData.get("slug");
  const category = formData.get("category");
  const priceRaw = formData.get("price");
  const description = formData.get("description");
  const image = formData.get("image");

  const errors: Record<string, string> = {};

  if (typeof name !== "string" || !name.trim()) {
    errors.name = "Name is required.";
  }
  if (typeof slug !== "string" || !slug.trim()) {
    errors.slug = "Slug is required.";
  }
  if (typeof category !== "string" || !category.trim()) {
    errors.category = "Category is required.";
  }
  if (typeof priceRaw !== "string" || !priceRaw.trim()) {
    errors.price = "Price is required.";
  } else if (isNaN(parseFloat(priceRaw)) || parseFloat(priceRaw) < 0) {
    errors.price = "Price must be a valid positive number.";
  }
  if (typeof description !== "string" || !description.trim()) {
    errors.description = "Description is required.";
  }
  if (typeof image !== "string" || !image.trim()) {
    errors.image = "Image URL is required.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors, fields: null };
  }

  return {
    errors: {},
    fields: {
      name: (name as string).trim(),
      slug: (slug as string).trim(),
      category: (category as string).trim(),
      price: Math.round(parseFloat(priceRaw as string) * 100),
      description: (description as string).trim(),
      image: (image as string).trim(),
      highlights: parseLines(formData.get("highlights")),
      includes: parseLines(formData.get("includes")),
    },
  };
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const { errors, fields } = validateProductFields(formData);

  if (!fields) {
    return { errors, success: false };
  }

  const cookieHeader = await getCookieHeader();

  const response = await fetch(buildPublicCommerceServiceUrl("/products"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify(fields),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    return {
      errors: { form: body.message ?? "Failed to create product." },
      success: false,
    };
  }

  revalidatePath("/admin/products");
  return { errors: {}, success: true };
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const { errors, fields } = validateProductFields(formData);

  if (!fields) {
    return { errors, success: false };
  }

  const cookieHeader = await getCookieHeader();

  const response = await fetch(
    buildPublicCommerceServiceUrl(`/products/${id}`),
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(fields),
    }
  );

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    return {
      errors: { form: body.message ?? "Failed to update product." },
      success: false,
    };
  }

  revalidatePath("/admin/products");
  return { errors: {}, success: true };
}
