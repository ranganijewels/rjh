import PageHeading from "@/components/ui/Heading/PageHeading";
import { POLICY_PAGES } from "@/content/policies";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// The published CMS page (Studio → Static Pages) is authoritative; the shared
// policy copy is the fallback, so the route always shows the current terms.
async function fetchCmsPage(slug) {
  try {
    const res = await fetch(`${API}/api/v1/cms/pages/${encodeURIComponent(slug)}`, {
      headers: { "x-tenant-id": TENANT },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const j = await res.json();
    const page = j?.data ?? j;
    return page?.content?.trim() ? page : null;
  } catch {
    return null;
  }
}

export async function policyMetadata(slug) {
  const page = (await fetchCmsPage(slug)) || POLICY_PAGES[slug];
  return {
    title: page?.metaTitle || page?.title,
    description: page?.metaDescription || undefined,
  };
}

export default async function PolicyPage({ slug }) {
  const fallback = POLICY_PAGES[slug];
  const cms = await fetchCmsPage(slug);
  const title = cms?.title || fallback?.title || "";
  const html = cms?.content || fallback?.html || "";
  return (
    <section>
      <PageHeading title={title} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="cms-content" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </section>
  );
}
