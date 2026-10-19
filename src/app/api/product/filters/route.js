import { NextResponse } from "next/server";

const filtersData = {
  purity: [
    { value: "10K", label: "10K" },
    { value: "14K", label: "14K" },
    { value: "18K", label: "18K" },
  ],
  // metal_color kept as string array for Details.jsx MetalSelector
  metal_color: ["YELLOW", "WHITE", "ROSE"],
  // metal_colors as objects for FilterBar (needs .value and .id for filtering/selection)
  metal_colors: [
    { id: "YELLOW", value: "YELLOW", label: "Yellow", name: "Yellow" },
    { id: "WHITE", value: "WHITE", label: "White", name: "White" },
    { id: "ROSE", value: "ROSE", label: "Rose", name: "Rose" },
  ],
  shape: [
    { id: 1, value: "Round", label: "Round", name: "Round", custom_title: null },
    { id: 2, value: "Princess", label: "Princess", name: "Princess", custom_title: null },
    { id: 3, value: "Oval", label: "Oval", name: "Oval", custom_title: null },
    { id: 4, value: "Cushion", label: "Cushion", name: "Cushion", custom_title: null },
    { id: 5, value: "Marquise", label: "Marquise", name: "Marquise", custom_title: null },
    { id: 6, value: "Pear", label: "Pear", name: "Pear", custom_title: null },
    { id: 7, value: "Emerald", label: "Emerald", name: "Emerald", custom_title: null },
    { id: 8, value: "Heart", label: "Heart", name: "Heart", custom_title: null },
  ],
  style: [
    { id: 1, value: "Solitaire", label: "Solitaire", name: "Solitaire" },
    { id: 2, value: "Halo", label: "Halo", name: "Halo" },
    { id: 3, value: "Three Stone", label: "Three Stone", name: "Three Stone" },
    { id: 4, value: "Vintage", label: "Vintage", name: "Vintage" },
    { id: 5, value: "Modern", label: "Modern", name: "Modern" },
  ],
};

export async function POST() {
  return NextResponse.json({ data: filtersData });
}

export async function GET() {
  return NextResponse.json({ data: filtersData });
}
