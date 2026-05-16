import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateCartSummary } from "../services/cartSummary.ts";
import type { Product } from "../../products/types/Product.ts";

const aeroLamp: Product = {
  id: "p1",
  sortOrder: 1,
  slug: "aero-lamp",
  name: "Aero Lamp",
  category: "Lighting",
  price: 96,
  description: "Fixture product for cart summary tests.",
  image: "https://example.com/aero-lamp.jpg",
  highlights: ["Warm LED"],
  includes: ["Lamp body"]
};

const solsticeSpeaker: Product = {
  id: "p2",
  sortOrder: 2,
  slug: "solstice-speaker",
  name: "Solstice Speaker",
  category: "Audio",
  price: 148,
  description: "Fixture product for cart summary tests.",
  image: "https://example.com/solstice-speaker.jpg",
  highlights: ["Bluetooth 5.3"],
  includes: ["Speaker"]
};

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
