// "use client";

// import React from "react";
// import Button from "@/components/ui/Button/Button";
// import Typography from "@/components/ui/Typography/Typography";

// const FailedOrder = ({
//   title = "Payment Failed",
//   description = "We couldn’t process your payment for your subscription",
//   reason = "Your card has insufficient funds or was declined by your bank",
//   onRetry,
//   onSupport,
// }) => {
//   return (
//     <div className="w-full flex items-center justify-center bg-white px-4">
//       <div className="max-w-xl w-full flex flex-col items-center text-center gap-10">
//         {/* Icon */}
//         <div className="w-28 h-28 rounded-full bg-red-100 flex items-center justify-center">
//           <div className="w-16 h-16 rounded-full border-[5px] border-red-500 flex items-center justify-center">
//             <svg
//               className="w-8 h-8 text-red-500"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 d="M18 6L6 18M6 6L18 18"
//                 stroke="currentColor"
//                 strokeWidth="3"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </div>
//         </div>

//         {/* Title + Description */}
//         <div className="flex flex-col gap-3">
//           <Typography variant="h4" color="grey">
//             {title}
//           </Typography>

//           <Typography variant="p" color="customGrey">
//             {description}
//           </Typography>
//         </div>

//         {/* Details box */}
//         <div className="w-full border border-gray-200 rounded-md p-4 flex items-start gap-3 text-left">
//           <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm text-gray-600">
//             !
//           </div>

//           <div className="flex flex-col gap-1">
//             <Typography variant="h6" color="grey">
//               Checkout details
//             </Typography>

//             <Typography variant="h6" color="customGrey">
//               {reason}
//             </Typography>
//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-4">
//           <Button
//             title="Try Again"
//             variant="primary"
//             onClick={onRetry}
//             className="w-[281px]"
//           />

//           <Button
//             title="Contact Support"
//             variant="outlineTeal"
//             url="/contact-us"
//             className="w-[281px]"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FailedOrder;

"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";

const FailedOrderPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Expecting order_id in URL: /payment-failed?order_id=123
  const orderId = searchParams.get("order_id");

  const onRetry = () => {
    if (!orderId) {
      console.error("Missing order_id for retry");
      return;
    }

    router.push(`/cart/order-complete?order_id=${orderId}&status=failed`);
  };

  return (
    <div className="min-h-150 w-full flex items-center justify-center bg-white px-4">
      <div className="max-w-xl w-full flex flex-col items-center text-center gap-10">
        {/* Icon */}
        <div className="w-28 h-28 rounded-full bg-red-100 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-[5px] border-red-500 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Title + Description */}
        <div className="flex flex-col gap-3">
          <Typography variant="h4" color="grey">
            Payment Failed
          </Typography>

          <Typography variant="p" color="customGrey">
            We couldn’t process your payment for your subscription
          </Typography>
        </div>

        {/* Details box */}
        <div className="w-full border border-gray-200 rounded-md p-4 flex items-start gap-3 text-left">
          <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-sm text-gray-600">
            !
          </div>

          <div className="flex flex-col gap-1">
            <Typography variant="h6" color="grey">
              Checkout details
            </Typography>

            <Typography variant="h6" color="customGrey">
              Your card has insufficient funds or was declined by your bank
            </Typography>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          <Button
            title="Try Again"
            variant="primary"
            onClick={onRetry}
            className="w-full sm:w-[281px]"
          />

          <Button
            title="Contact Support"
            variant="outlineTeal"
            url="/contact-us"
            className="w-full sm:w-[281px]"
          />
        </div>
      </div>
    </div>
  );
};

export default FailedOrderPage;
