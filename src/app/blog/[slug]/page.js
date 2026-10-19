import { notFound } from "next/navigation";
import Typography from "@/components/ui/Typography/Typography";
import { CalenderIcon, UserIcon } from "@/components/Icons/common";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const TENANT = process.env.NEXT_PUBLIC_TENANT_ID || "00000000-0000-0000-0000-000000000001";

// Published posts only (the public API 404s drafts). Content is sanitised by
// the API when it is saved, so it is rendered as stored.
async function fetchPost(slug) {
  try {
    const res = await fetch(`${API}/api/v1/cms/blogs/${encodeURIComponent(slug)}`, {
      headers: { "x-tenant-id": TENANT },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const j = await res.json();
    const post = j?.data ?? j;
    return post?.slug && post?.isPublished ? post : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  const description = (post.excerpt || "").replace(/\s+/g, " ").trim().slice(0, 160) || undefined;
  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      ...(post.featuredImageUrl ? { images: [{ url: post.featuredImageUrl, alt: post.title }] } : {}),
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const date = post.publishedAt || post.createdAt;
  return (
    <article className="space-y-[40px] container mx-auto xl:px-[160px] lg:px-[50px] px-[18px] pt-[100px] pb-[60px]">
      <header className="space-y-[24px]">
        <h1 className="xl:text-[54px] lg:text-[32px] text-[28px] font-[500]">{post.title}</h1>
        <div className="flex gap-[48px]">
          <div className="flex gap-[11px]">
            <UserIcon />
            <Typography variant="h5" textColor="placeholder">
              {post.author || "Rangani Jewelry House"}
            </Typography>
          </div>
          {date && (
            <div className="flex gap-[11px]">
              <CalenderIcon />
              <Typography variant="h5" textColor="placeholder">
                {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </Typography>
            </div>
          )}
        </div>
      </header>

      {post.featuredImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.featuredImageUrl}
          alt={post.title}
          className="w-full h-auto max-h-[480px] object-cover rounded-lg"
        />
      )}

      <div className="cms-content" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
    </article>
  );
}
