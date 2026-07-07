import { NextResponse } from "next/server";

// Size CATEGORIES for the customize flow. ReferenceForm matches the `size`
// URL param against `slug` and renders the `sizes` values in the size
// dropdown (labelled with `name`); `id` travels onward as size_category_id.
// Ids mirror the customize category ids (ring=10, band=1, bracelet=3,
// necklace=6, earring=4) so the whole flow stays consistent.
// (The previous stub returned FLAT ring sizes with no slug/sizes keys, which
// crashed ReferenceForm: `s.slug.toLowerCase()` on undefined.)
const RING_SIZES = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"];
const BRACELET_LENGTHS = ['6"', '6.5"', '7"', '7.5"', '8"', '8.5"'];
const NECKLACE_LENGTHS = ['14"', '16"', '18"', '20"', '22"', '24"'];

const asOptions = (values) => values.map((v, i) => ({ id: i + 1, name: v, value: v }));

// NOTE: the form's RingSizeSelector renders labels as `${name} Size`, so keep
// names bare ("Ring" → "Ring Size").
const SIZE_CATEGORIES = [
  { id: 10, slug: "ring", name: "Ring", sizes: asOptions(RING_SIZES) },
  { id: 1, slug: "band", name: "Band", sizes: asOptions(RING_SIZES) },
  { id: 3, slug: "bracelet", name: "Bracelet", sizes: asOptions(BRACELET_LENGTHS) },
  { id: 6, slug: "necklace", name: "Necklace", sizes: asOptions(NECKLACE_LENGTHS) },
  // Earrings have no size selection — empty list hides the size dropdown.
  { id: 4, slug: "earring", name: "Earring", sizes: [] },
];

export async function GET() {
  return NextResponse.json({ data: SIZE_CATEGORIES });
}
