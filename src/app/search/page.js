import { Suspense } from "react";
import SearchResults from "@/components/search/SearchResults";

export const dynamic = "force-dynamic";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
          <p style={{ color: "var(--placeholder)", fontFamily: "var(--font-montserrat)" }}>
            Loading search…
          </p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
