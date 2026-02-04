"use client";
import React, { useEffect, useState, use } from "react";
import { useCrudApi } from "@/hooks/useCrudApi";
import Typography from "@/components/ui/Typography/Typography";
import { CalenderIcon, UserIcon } from "@/components/Icons/common";

const BlogDetail = ({ params }) => {
  const { slug } = use(params);

  const { fetchAll: fetchPosts } = useCrudApi(`/api/blog/blog-post`);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts()
      .then((res) => {
        const found = res?.data?.find((b) => b.slug === slug);
        setBlog(found || null);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [slug, fetchPosts]);

  if (loading) return <div>Loading...</div>;
  if (!blog) return <div>Blog not found</div>;
  return (
    <section className="space-y-[40px] container mx-auto xl:px-[160px] lg:px-[50px] px-[18px] pt-[100px]">
      <div className="space-y-[24px]">
        <h2 className="xl:text-[54px] lg:text-[32px] text-[28px] font-[500]">
          {blog?.title || ""}
        </h2>
        <div className="flex gap-[48px]">
          <div className="flex gap-[11px]">
            <UserIcon />
            <Typography variant="h5" textColor="placeholder">
              {blog?.author || "Admin"}
            </Typography>
          </div>
          <div className="flex gap-[11px]">
            <CalenderIcon />
            <Typography variant="h5" textColor="placeholder">
              {blog?.created_at
                ? new Date(blog?.created_at).toLocaleDateString()
                : "—"}
            </Typography>
          </div>
        </div>
      </div>

      <div dangerouslySetInnerHTML={{ __html: blog?.description }} />
    </section>
  );
};

export default BlogDetail;
