import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getFeaturedProducts,
  getNewArrivalProducts,
  getProductBySlug,
  getProductSlugs,
  getProducts
} from "../services/productCatalog.ts";

test("getFeaturedProducts returns the first three products", () => {
  const featuredProducts = getFeaturedProducts();

  assert.equal(featuredProducts.length, 3);
  assert.deepEqual(
    featuredProducts.map((product) => product.slug),
    getProducts()
      .slice(0, 3)
      .map((product) => product.slug)
  );
});

test("getNewArrivalProducts returns the remaining products", () => {
  const newArrivalProducts = getNewArrivalProducts();

  assert.equal(newArrivalProducts.length, 3);
  assert.deepEqual(
    newArrivalProducts.map((product) => product.slug),
    getProducts()
      .slice(3)
      .map((product) => product.slug)
  );
});

test("getProductBySlug returns the matching product", () => {
  const product = getProductBySlug("aero-lamp");

  assert.ok(product);
  assert.equal(product.name, "Aero Lamp");
  assert.equal(product.sortOrder, 1);
});

test("getProductSlugs includes every product slug", () => {
  assert.deepEqual(
    getProductSlugs(),
    getProducts().map((product) => product.slug)
  );
});
