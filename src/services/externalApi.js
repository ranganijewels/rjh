export const fetchMarqueeData = async () => {
  const res = await fetch(`${apiBaseUrl}/marquee`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch marquee");
  return res.json();
};

export const fetchSocialLinks = async () => {
  const res = await fetch(`${apiBaseUrl}/social-links`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch social-links");
  return res.json();
};
