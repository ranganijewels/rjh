import { Suspense } from "react";
import PaymentStatus from "@/commomPages/Cart/PaymentStatus";

const page = () => {
  return (
    <Suspense fallback={null}>
      <PaymentStatus />
    </Suspense>
  );
};

export default page;
