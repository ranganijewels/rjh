import { Suspense } from "react";
import Orders from "@/commomPages/Account/Orders";

// Orders reads ?order= (deep link from the dashboard), which needs Suspense.
const page = () => (
  <Suspense fallback={null}>
    <Orders />
  </Suspense>
);

export default page;
