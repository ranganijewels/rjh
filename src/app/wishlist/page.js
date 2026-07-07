import Wishlist from "@/commomPages/Account/Wishlist";
import Collection from "@/commomPages/Collection";
import PageHeading from "@/components/ui/Heading/PageHeading";
import React from "react";

const page = () => {
  return (
    <section className="">
      <PageHeading title={"My WishList"} />
      <div className="2xl:py-[100px] lg:py-[54px] py-[40px]">
        <div className="gap-[40px] flex flex-col mb-[40px] xl:px-[218px] lg:px-[60px] md:px-[30px] px-[18px]">
          <Wishlist
            hideTitle={true}
            gridCol={
              "grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 max-[320px]:grid-cols-1"
            }
          />
        </div>

        <Collection
          collectionName="Most Loved"
          title="You May Also Like"
          apiPath="/api/product/get-collection"
        />
      </div>
    </section>
  );
};

export default page;
