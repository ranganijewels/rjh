export async function getProduct(id, currency = "CAD") {
  const res = await fetch(
    `https://api.jewellabel.in/api/store-web/customer/product-detail/${id}`,
    {
      headers: {
        "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID,
        currency,
      },
      cache: "no-store",
    }
  );

  return res.json();
}
