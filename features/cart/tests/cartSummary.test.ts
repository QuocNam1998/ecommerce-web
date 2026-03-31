import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateCartSummary } from "../services/cartSummary.ts";
import { getProductBySlug } from "../../products/services/productCatalog.ts";

const aeroLamp = getProductBySlug("aero-lamp");
const solsticeSpeaker = getProductBySlug("solstice-speaker");

if (!aeroLamp || !solsticeSpeaker) {
  throw new Error("Expected fixture products to exist for cart summary tests.");
}

test("calculateCartSummary returns totals for populated carts", () => {
  const summary = calculateCartSummary([
    { product: aeroLamp, quantity: 1 },
    { product: solsticeSpeaker, quantity: 2 }
  ]);

  assert.equal(summary.itemCount, 3);
  assert.equal(summary.subtotal, 392);
  assert.equal(summary.shipping, 0);
  assert.equal(summary.tax, 31.36);
  assert.equal(summary.total, 423.36);
});

test("calculateCartSummary adds shipping below the free shipping threshold", () => {
  const summary = calculateCartSummary([{ product: aeroLamp, quantity: 1 }]);

  assert.equal(summary.subtotal, 96);
  assert.equal(summary.shipping, 18);
  assert.equal(summary.tax, 7.68);
  assert.equal(summary.total, 121.68);
});
