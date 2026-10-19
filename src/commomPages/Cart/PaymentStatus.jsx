"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCrudApi } from "@/hooks/useCrudApi";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";

// Cashfree redirects here after checkout. The order_id in the query string
// is just a hint for which order to look up — the actual status always
// comes from our backend (which itself re-checks with Cashfree), never
// trusted from the URL alone.
const PaymentStatus = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const { fetchById } = useCrudApi("/api/payments/cashfree/status");
  const [state, setState] = useState("checking"); // checking | paid | failed | error

  useEffect(() => {
    if (!orderId) {
      setState("error");
      return;
    }
    let cancelled = false;

    const poll = async (attempt = 0) => {
      try {
        // Guests (no account) prove the order with their checkout email.
        let email = "";
        try {
          email = JSON.parse(localStorage.getItem("recentOrder") || "{}")?.email || "";
        } catch {}
        const res = await fetchById(orderId, email ? { query: { email } } : {});
        if (cancelled) return;
        const paymentStatus = res?.data?.paymentStatus;
        if (paymentStatus === "Paid") {
          setState("paid");
          router.replace("/cart/order-complete");
          return;
        }
        if (paymentStatus === "Failed") {
          setState("failed");
          return;
        }
        // Still Pending — the webhook may not have landed yet, retry a few
        // times before giving up and telling the customer to check back.
        if (attempt < 5) {
          setTimeout(() => poll(attempt + 1), 2000);
        } else {
          setState("failed");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    };

    poll();
    return () => { cancelled = true; };
  }, [orderId]);

  if (state === "checking" || state === "paid") {
    return (
      <section className="container mx-auto py-[80px] flex flex-col items-center text-center gap-[16px]">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-[var(--teal-3)] border-t-[var(--teal-1)]" />
        <Typography variant="h4" className="font-[500]">Verifying your payment…</Typography>
        <Typography variant="p">This only takes a moment — please don't close this page.</Typography>
      </section>
    );
  }

  return (
    <section className="container mx-auto py-[80px] flex flex-col items-center text-center gap-[16px]">
      <Typography variant="h3" className="font-[500]">
        {state === "failed" ? "Payment wasn't completed" : "Something went wrong"}
      </Typography>
      <Typography variant="p" className="max-w-[480px]">
        {state === "failed"
          ? `Your order ${orderId || ""} was saved, but the payment didn't go through. You can try again or contact us for help.`
          : "We couldn't verify your payment status. If an amount was deducted, it will be refunded automatically if the order isn't confirmed."}
      </Typography>
      <div className="flex gap-[16px] mt-[8px]">
        <Button title="Contact Us" variant="outline" url="/contact-us" />
        <Button title="Back to Shop" url="/product" />
      </div>
    </section>
  );
};

export default PaymentStatus;
