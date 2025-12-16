import { ORDER_DATA } from "@/commomPages/Account/constant";
import Orders from "@/commomPages/Account/Orders";
import React from "react";

const page = () => {
  return <Orders orderData={ORDER_DATA} />;
};

export default page;
