import ProductCard from "@/components/ui/Cards/ProductCard";
import ProductCardSkeleton from "@/components/ui/Cards/ProductCardSkeleton";
import SearchInput from "@/components/ui/Input/SearchInput";
import { useCrudApi } from "@/hooks/useCrudApi";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const SearchPanel = ({ showSearchbar, closeSearchBar }) => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { create } = useCrudApi(`/api/product`);
  const tabClasses = (tab) =>
    `text-[16px] font-[500] cursor-pointer ${
      activeTab === tab
        ? "text-[var(--grey-2)] border-b-2 border-[var(--teal-1)] pb-[20px]"
        : "text-[var(--grey-2)] opacity-60"
    }`;

  const filteredSuggestions = inputValue
    ? suggestions.filter((item) =>
        item.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const payload = { search: inputValue };
        const response = await create(payload);
        const data = response?.data || [];

        setProducts(data);
        const productTitles = data.map((item) => item?.title).filter(Boolean);

        const collectionTitles =
          data.map((item) => item?.collection_name).filter(Boolean) || [];

        const allTitles = [...productTitles, ...collectionTitles];

        const matched = allTitles.filter((title) =>
          title.toLowerCase().includes(inputValue.toLowerCase())
        );

        setSuggestions([...new Set(matched)]);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (inputValue.trim()) {
      loadProducts();
    } else {
      setProducts([]);
      setSuggestions([]);
    }
  }, [inputValue]);

  return (
    <>
      {showSearchbar && (
        <div className="absolute w-full">
          <div>
            <SearchInput
              onClear={() => closeSearchBar(false)}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>

          {filteredSuggestions.length > 0 && (
            <div className="md:p-[22px_44px] p-[16px_20px] flex md:flex-row flex-col xl:gap-[104px] gap-[40px] bg-[var(--grey-00)]">
              <div className="md:w-[30%] w-full">
                <div className="text-[var(--placeholder)] pt-[10px] pb-[20px] text-[16px] font-[500] cursor-pointer border-b-2 border-[var(--placeholder)]">
                  Suggestions
                </div>

                <div className="flex md:flex-col flex-row gap-[19px] mt-[19px] overflow-auto lg:h-[546px] custom-scroll">
                  {filteredSuggestions.map((text) => {
                    const i = text
                      .toLowerCase()
                      .indexOf(inputValue.toLowerCase());
                    return (
                      <label
                        key={text}
                        onClick={() => setInputValue(text)}
                        className="shrink-0 text-[16px] font-[400] cursor-pointer text-[var(--grey-2)] "
                      >
                        {i >= 0 ? (
                          <>
                            {text.slice(0, i)}
                            <span className="font-[600]">
                              {text.slice(i, i + inputValue.length)}
                            </span>
                            {text.slice(i + inputValue.length)}
                          </>
                        ) : (
                          text
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="w-full">
                {/* Tabs */}
                <div className="pt-[10px] border-b border-[var(--placeholder)] inline-flex gap-[60px] w-full">
                  <div
                    onClick={() => setActiveTab("products")}
                    className={tabClasses("products")}
                  >
                    Products
                  </div>
                  <div
                    onClick={() => setActiveTab("collections")}
                    className={tabClasses("collections")}
                  >
                    Collections
                  </div>
                  <div
                    onClick={() => setActiveTab("pages")}
                    className={tabClasses("pages")}
                  >
                    Pages
                  </div>
                </div>

                {/* Tab Content */}
                <div className="pt-[16px] pb-[87px]">
                  {activeTab === "products" && (
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-x-[30px] gap-x-[5px] md:gap-y-[49px] gap-y-[20px] max-[320px]:grid-cols-1">
                      {loading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                          <ProductCardSkeleton key={idx} />
                        ))
                      ) : products.length > 0 ? (
                        products
                          .slice(0, 4)
                          // ?.filter((item) => item?.product_image != null)
                          .map((item) => (
                            <ProductCard
                              key={item?.product_id}
                              categoryId={item?.category_id}
                              productId={item?.product_id}
                              productName={item?.title}
                              price={item?.product_price}
                              productImg={item?.product_image}
                              colorsPalettes={item?.metal_color}
                              // gridLayout={gridLayout}
                              designNo={item?.design_no}
                              hoverImage={item?.rollover_image}
                              metalColor={item?.product_color}
                              wishlistStatus={item?.wishlist}
                            />
                          ))
                      ) : (
                        <div className="col-span-full text-center py-8">
                          <p className="text-[var(--grey-2)] mb-4">
                            No products found for &quot;{inputValue}&quot;
                          </p>
                          <Link
                            href="/product"
                            className="text-[var(--teal-1)] underline"
                          >
                            Browse all products
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "collections" && (
                    <div> Show collections here</div>
                  )}
                  {activeTab === "pages" && <div> Show pages here</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SearchPanel;
