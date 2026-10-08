# FreshOMill product import guide

This guide accompanies `data/freshomill-product-import-template.csv`. The included rows are a development specification only. They are deliberately unpublished, priced at zero, stocked at zero, and marked for replacement. Do not import them unchanged into production.

## Required preparation

1. Duplicate the template and keep the original unchanged.
2. Replace every `Replace` value and every `DEV-REPLACE` identifier.
3. Use UTF-8 encoding and comma-separated values.
4. Keep the header row unchanged unless Shopify's exported product CSV from the target store uses newer header names. Shopify maintains backward compatibility with older product CSV headers, but an export from the target store is the safest source for an update import.
5. Define the product metafields listed below before expecting those columns to populate typed values.
6. Keep every new product as `draft` and `Published` as `FALSE` until its content, pricing, inventory, tax behavior, images, and claims are approved.

## Product-level rules

- Handle: lowercase letters, numbers, and hyphens only; unique per product.
- Title: required on the first row of every product.
- Description: approved HTML only; no medical or unsupported health claims.
- Vendor: use the approved vendor name consistently.
- Type: use one controlled product type rather than spelling variants.
- Category metafield: use one of the approved FreshOMill category values.
- Tags: comma-separated controlled tags; do not use tags as unverified claims.
- Status: `draft`, `active`, or `archived`. New records should remain `draft` during preparation.
- Published: `FALSE` until the product is ready for the Online Store channel.

## Variant rules

- Repeat the same handle for every variant row.
- Option names must remain in the same positions across all variants of a product.
- Option values must be unique within their option combination.
- SKU: required by the FreshOMill data standard and unique across the catalog.
- Barcode: leave blank unless a real barcode has been assigned.
- Variant Grams: whole-number shipping weight in grams.
- Variant Price: numeric INR amount without `₹` or comma separators.
- Compare-at price: leave blank unless a genuine prior/reference price is approved; when used, it must exceed the selling price.
- Inventory tracker: use `shopify` when Shopify tracks stock.
- Inventory policy: use `deny` unless continued selling after zero stock is intentionally approved.
- Inventory quantity: this product CSV field is suitable only for a single-location store. Use Shopify's inventory CSV for multiple locations.
- Fulfillment service: use `manual` unless a configured fulfillment service requires another value.
- Requires shipping and taxable: confirm each value instead of copying defaults blindly.

## Image rules

- Image URLs must be publicly reachable HTTPS URLs at import time.
- The first image row should use image position `1`.
- Every image requires useful alt text describing the product, not marketing keywords.
- Additional image-only rows may repeat the handle and leave variant fields blank.
- Follow `documentation/PRODUCT-IMAGE-STANDARDS.md` before preparing image URLs.

## Metafield definitions to create later in Shopify Admin

Namespace and key recommendations:

- `custom.category`: single-line text or controlled metaobject/reference selected during Admin planning
- `custom.ingredients`: rich text
- `custom.storage_instructions`: rich text
- `custom.shelf_life`: single-line text
- `custom.origin`: single-line text
- `custom.product_highlights`: rich text
- `custom.sourcing_process`: rich text
- `custom.nutrition`: rich text

The theme omits empty metafield tabs automatically. Only verified values should be entered.

## Pre-import validation rules

- No development handles, titles, tags, or SKUs remain.
- Every first product row has a title, handle, vendor, type, status, and publication value.
- Every variant has a unique SKU and valid option combination.
- Prices are numeric and compare-at prices are either blank or higher than prices.
- Weights are non-negative whole grams.
- Inventory policies and fulfillment services are populated when inventory tracking is enabled.
- Image URLs use HTTPS and every image has alt text.
- Product claims, ingredients, nutrition, origin, shelf life, and storage information have been approved.
- No product is active or published prematurely.
- A backup export is taken before any overwrite import.

## Deferred Shopify Admin import

When the Admin phase begins, first export one existing product from the target store and compare its headers with this template. Then import a small draft-only batch, review Shopify's import summary, inspect every product and variant, and only then prepare the complete catalog import. Inventory for multiple locations must be handled through Shopify's inventory CSV workflow.
