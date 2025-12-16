"use client";
import PageHeading from "@/components/ui/Heading/PageHeading";
import { useCrudApi } from "@/hooks/useCrudApi";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const pageCache = {};

export default function StaticPage() {
  const { slug } = useParams();
  const { fetchAll } = useCrudApi(`/api/static-pages/${slug}`);
  const [pageData, setPageData] = useState(pageCache[slug] || null);
  const [loading, setLoading] = useState(!pageCache[slug]);

  useEffect(() => {
    if (!slug || pageCache[slug]) return;

    fetchAll()
      .then((res) => {
        pageCache[slug] = res?.data || null;
        setPageData(pageCache[slug][0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p>Loading...</p>;
  if (!pageData) return <p>Page not found</p>;

  return (
    <section>
      <PageHeading title={pageData.page_title} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div
          className="cms-content"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </div>
    </section>
  );
}
