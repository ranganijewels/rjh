"use client";
import ImageWithContent from "@/components/common/ImageWithContent";
import React, { useEffect, useState } from "react";
import HeroSection from "@/components/common/HeroSection";
import { useCrudApi } from "@/hooks/useCrudApi";
import Typography from "@/components/ui/Typography/Typography";
import { useSearchParams, useRouter } from "next/navigation";

const BlogListing = () => {
  const [blogCategory, setBlogCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const { fetchAll: fetchCategories } = useCrudApi(`/api/blog/blog-category`);
  const { fetchAll: fetchPosts } = useCrudApi(`/api/blog/blog-post`);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetchCategories()
      .then((res) => setBlogCategory(res?.data || []))
      .catch((err) => console.error("Error fetching categories", err));

    fetchPosts()
      .then((res) => setBlogPosts(res?.data || []))
      .catch((err) => console.error("Error fetching posts", err));
  }, [fetchCategories, fetchPosts]);

  // Sync categoryId with query param
  useEffect(() => {
    if (blogCategory.length > 0) {
      const catSlug = searchParams.get("cat"); // e.g. "education"
      if (catSlug) {
        const matched = blogCategory.find(
          (cat) =>
            cat?.title?.toLowerCase().replace(/\s+/g, "-") ===
            catSlug.toLowerCase()
        );
        setCategoryId(matched?.id || null);
      } else {
        setCategoryId(null); // "All"
      }
    }
  }, [searchParams, blogCategory]);

  // Click handler → updates URL
  const handleCategoryClick = (cat) => {
    if (!cat) {
      router.push("/blog"); // Reset to "All"
    } else {
      const slug = cat.title.toLowerCase().replace(/\s+/g, "-");
      router.push(`/blog?cat=${slug}`);
    }
  };

  // Filter posts
  const filteredPosts = categoryId
    ? blogPosts.filter(
        (post) => post?.blog_category_id === categoryId && post?.is_active === 1
      )
    : blogPosts.filter((post) => post?.is_active === 1);

  return (
    <section>
      {/* Hero */}
      <HeroSection
        backgroundUrl="images/about-us-banner.png"
        title="Explore, Learn, and Celebrate Jewelry"
        description="Stay inspired with the latest trends, styling tips, diamond education, and craftsmanship stories."
        imageClass="!h-[475px]"
        containerClass="!h-[475px]"
      />

      {/* Categories */}
      <div className="xl:pt-[100px] lg:pt-[80px] pt-[40px]">
        <div className="flex items-center justify-center gap-[40px] pb-[40px]">
          {/* All Tab */}
          <Typography
            variant="h5"
            className={`font-[500] cursor-pointer relative pb-2 ${
              categoryId === null
                ? "text-[var(--grey-2)] border-b"
                : "text-[var(--placeholder)]"
            }`}
            onClick={() => handleCategoryClick(null)}
          >
            All
            {categoryId === null && (
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary" />
            )}
          </Typography>

          {/* Dynamic Categories */}
          {blogCategory?.map((cat) => (
            <Typography
              key={cat?.id}
              variant="h5"
              className={`font-[500] cursor-pointer relative pb-2 ${
                categoryId === cat?.id
                  ? "text-[var(--grey-2)] border-b"
                  : "text-[var(--placeholder)]"
              }`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat?.title}
              {categoryId === cat?.id && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-primary" />
              )}
            </Typography>
          ))}
        </div>

        {/* Blog Posts */}
        {filteredPosts?.length > 0 ? (
          <ImageWithContent
            redirectUrl="/blog"
            data={filteredPosts}
            containerClass="container mx-auto grid !grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6"
          />
        ) : (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-[var(--teal-1)] rounded-full animate-spin" />
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogListing;
