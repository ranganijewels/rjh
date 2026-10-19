"use client";
import ImageWithContent from "@/components/common/ImageWithContent";
import React, { useEffect, useState } from "react";
import HeroSection from "@/components/common/HeroSection";
import { useCrudApi } from "@/hooks/useCrudApi";
import Typography from "@/components/ui/Typography/Typography";
import { useSearchParams, useRouter } from "next/navigation";
import { usePageHero } from "@/hooks/usePageHero";

const BlogListing = () => {
  const hero = usePageHero("blog");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchAll: fetchPosts } = useCrudApi(`/api/blog/blog-post`);
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get("cat"); // e.g. "engagement" — matches a post's tag

  useEffect(() => {
    fetchPosts()
      .then((res) => setBlogPosts(res?.data || []))
      .catch((err) => console.error("Error fetching posts", err))
      .finally(() => setLoading(false));
  }, [fetchPosts]);

  // Category tabs are derived straight from the tags actually present on
  // published posts — no separate categories list to keep in sync, and a
  // tab never points at content that doesn't exist.
  const blogCategory = Array.from(
    new Set(blogPosts.flatMap((p) => p?.tags || []))
  ).sort();

  // Click handler → updates URL
  const handleCategoryClick = (tag) => {
    if (!tag) {
      router.push("/blog"); // Reset to "All"
    } else {
      router.push(`/blog?cat=${encodeURIComponent(tag)}`);
    }
  };

  // Filter posts by tag (case-insensitive match against the "cat" query param)
  const filteredPosts = activeTag
    ? blogPosts.filter((post) =>
        (post?.tags || []).some(
          (t) => t.toLowerCase() === activeTag.toLowerCase()
        )
      )
    : blogPosts;

  // ImageWithContent is a generic card component (file/image + title +
  // description) — map each post into that shape rather than changing the
  // shared component to know about blog-specific field names.
  const cardData = filteredPosts.map((post) => ({
    ...post,
    image: post.featured_image || "",
    description: post.excerpt || "",
  }));

  return (
    <section>
      {/* Hero */}
      <HeroSection
        backgroundUrl={hero?.file || "images/about-us-banner.png"}
        mobileFile={hero?.mobileFile}
        title={hero?.title || "Explore, Learn, and Celebrate Jewelry"}
        description={hero?.description || "Stay inspired with the latest trends, styling tips, diamond education, and craftsmanship stories."}
        buttons={hero?.buttons?.length ? hero.buttons : undefined}
        imageClass="!h-[475px]"
        containerClass="!h-[475px]"
      />

      {/* Categories */}
      <div className="xl:pt-[100px] lg:pt-[80px] pt-[40px]">
        <div className="flex flex-wrap items-center justify-center gap-[10px] sm:gap-[20px] lg:gap-[40px] pb-[40px]">
          {/* All Tab */}
          <Typography
            variant="h5"
            role="button"
            tabIndex={0}
            className={`font-[500] cursor-pointer relative pb-2 hover:text-[var(--grey-2)] active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal-1)] ${
              !activeTag
                ? "text-[var(--grey-2)] border-b"
                : "text-[var(--grey-2)]"
            }`}
            onClick={() => handleCategoryClick(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCategoryClick(null);
              }
            }}
          >
            All
            {!activeTag && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary" />
            )}
          </Typography>

          {/* Dynamic Categories (real tags from published posts) */}
          {blogCategory?.map((tag) => (
            <Typography
              key={tag}
              variant="h5"
              role="button"
              tabIndex={0}
              className={`font-[500] cursor-pointer relative pb-2 hover:text-[var(--grey-2)] active:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--teal-1)] ${
                activeTag?.toLowerCase() === tag.toLowerCase()
                  ? "text-[var(--grey-2)] border-b"
                  : "text-[var(--grey-2)]"
              }`}
              onClick={() => handleCategoryClick(tag)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCategoryClick(tag);
                }
              }}
            >
              {tag}
              {activeTag?.toLowerCase() === tag.toLowerCase() && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary" />
              )}
            </Typography>
          ))}
        </div>

        {/* Blog Posts */}
        {loading ? (
          <div
            className="min-h-[60vh] flex items-center justify-center"
            role="status"
            aria-label="Loading blog posts"
            aria-busy="true"
          >
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[var(--teal-1)] rounded-full animate-spin" />
          </div>
        ) : cardData?.length > 0 ? (
          <ImageWithContent
            redirectUrl="/blog"
            data={cardData}
            containerClass="container mx-auto grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6"
          />
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <Typography variant="h5" className="text-[var(--grey-2)]">
              {blogPosts?.length > 0
                ? "No articles found in this category."
                : "No articles published yet."}
            </Typography>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogListing;
