import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CART_STORAGE_VERSION,
  parseStoredCart,
  serializeCart
} from "../services/cartStorage.ts";
import { getProductBySlug } from "../../products/services/productCatalog.ts";

const aeroLamp = getProductBySlug("aero-lamp");

if (!aeroLamp) {
  throw new Error("Expected fixture products to exist for cart storage tests.");
}

test("serializeCart stores the cart with a versioned payload", () => {
  const serializedCart = serializeCart([{ product: aeroLamp, quantity: 2 }]);

  assert.deepEqual(JSON.parse(serializedCart), {
    version: CART_STORAGE_VERSION,
    items: [{ product: aeroLamp, quantity: 2 }]
  });
});

test("parseStoredCart hydrates valid stored cart items", () => {
  const parsedCart = parseStoredCart(
    JSON.stringify({
      version: CART_STORAGE_VERSION,
      items: [{ product: aeroLamp, quantity: 2 }]
    })
  );

  assert.equal(parsedCart.length, 1);
  assert.equal(parsedCart[0].product.slug, "aero-lamp");
  assert.equal(parsedCart[0].quantity, 2);
});

test("parseStoredCart ignores invalid and outdated payloads", () => {
  assert.deepEqual(
    parseStoredCart(JSON.stringify({ version: 999, items: [{ product: aeroLamp, quantity: 1 }] })),
    []
  );
  assert.deepEqual(
    parseStoredCart(JSON.stringify({ version: CART_STORAGE_VERSION, items: [{ product: null, quantity: 1 }] })),
    []
  );
  assert.deepEqual(parseStoredCart("not-json"), []);
});
