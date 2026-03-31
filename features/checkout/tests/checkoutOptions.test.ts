import { test } from "node:test";
import assert from "node:assert/strict";
import { CHECKOUT_QUANTITY_OPTIONS } from "../constants/checkoutOptions.ts";

test("CHECKOUT_QUANTITY_OPTIONS exposes a stable quantity list", () => {
  assert.deepEqual(CHECKOUT_QUANTITY_OPTIONS, [1, 2, 3, 4, 5]);
});
