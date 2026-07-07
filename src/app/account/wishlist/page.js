import Wishlist from "@/commomPages/Account/Wishlist";
import React from "react";

const page = () => {
  return (
    <Wishlist
      hideTitle={false}
      gridCol={"grid md:grid-cols-3 grid-cols-2 max-[320px]:grid-cols-1"}
    />
  );
};

export default page;
