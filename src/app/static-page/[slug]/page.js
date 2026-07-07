"use client";
import PageHeading from "@/components/ui/Heading/PageHeading";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StaticPage() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const storeId = process.env.NEXT_PUBLIC_TENANT_ID;

  useEffect(() => {
    if (!slug) return;

    setLoading(true);

    // CMS pages come from our own backend via the local proxy
    fetch(`/api/static-pages/${slug}`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        const page = json?.data;
        // Treat pages with no content as missing
        setPageData(page?.content ? page : null);
      })
      .catch(() => {
        setPageData(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-[var(--teal-1)] rounded-full animate-spin" />
      </div>
    );
  if (!pageData) return <p>Page not found</p>;

  return (
    <section>
      <PageHeading title={pageData.title || pageData.page_title || ""} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div
          className="cms-content"
          dangerouslySetInnerHTML={{
            __html: pageData.content || "",
          }}
        />
      </div>
    </section>
  );
}
