"use client";

import { CouponIcon, MinusIcon } from "@/components/Icons/common";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import { useCrudApi } from "@/hooks/useCrudApi";
import { fetchCart } from "@/store/slices/cartSlice";
import { setOrder } from "@/store/slices/orderSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { trackBeginCheckout, trackPaymentInfo } from "@/lib/analytics";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import QuantitySelector from "./QuantitySelector";
import { toTitleCase } from "@/utils/string";
import { getCurrencySymbol } from "@/utils/currencySymbol";
import { convertPrice } from "@/utils/money";
import { usePreferences } from "@/context/PreferencesContext";
import InputWithIconButton from "@/components/ui/Input/InputWithIconButton";
import { useCoupon } from "@/hooks/useCoupon";
import { load as loadCashfree } from "@cashfreepayments/cashfree-js";
import DeliveryAddress from "./checkout/DeliveryAddress";

const CheckOutDetails = () => {
  const [placingOrder, setPlacingOrder] = useState(false);
  const { customer } = useSelector((state) => state.auth);
  // Delivery address: the customer's saved addresses (default first), or the
  // one a guest enters for this order.
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [guestEmail, setGuestEmail] = useState("");
  const { fetchAll: fetchAddresses, create: createAddress } = useCrudApi("/api/address");
  const { selectedCountry } = usePreferences();
  // Online payments may be charged in a fixed currency (e.g. INR) set on the
  // API; fetched so the exact charge can be shown before paying.
  const [paymentOptions, setPaymentOptions] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/payments/options", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => !cancelled && setPaymentOptions(j?.data || null))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  const { apply, remove, setError, couponCode, setCouponCode } = useCoupon();

  useEffect(() => {
    if (!customer) {
      setAddressesLoading(false);
      return;
    }
    let cancelled = false;
    setAddressesLoading(true);
    fetchAddresses()
      .then((res) => {
        if (cancelled) return;
        const list = res?.data || [];
        setAddresses(list);
        setSelectedAddress((cur) => cur || list.find((a) => a.is_default) || list[0] || null);
      })
      .catch(() => undefined)
      .finally(() => !cancelled && setAddressesLoading(false));
    return () => {
      cancelled = true;
    };
  }, [customer, fetchAddresses]);

  const { create: updateQuantities } = useCrudApi(
    "/api/cart/update-quantities"
  );

  const handleCoupon = async () => {
    const success = await apply(couponCode);
    if (success) setCouponCode("");
  };
  const router = useRouter();
  const dispatch = useDispatch();

  const { cartItems, summary, loading, error, shipping, coupon } = useSelector(
    (state) => state.cart
  );
  const chargeCurrency = paymentOptions?.chargeCurrency || null;
  // Same rounding as the API: total (USD) × rate, to the cent.
  const chargeAmount =
    chargeCurrency && paymentOptions?.rate
      ? Math.round(Number(summary?.grand_total ?? 0) * paymentOptions.rate * 100) / 100
      : null;
  const shippingCharge = useSelector((state) => state.cart.shipping);
  const { create } = useCrudApi(`/api/cart/place-order`);

  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (checkoutTracked.current || !cartItems?.length) return;
    checkoutTracked.current = true;
    trackBeginCheckout(
      summary?.grand_total,
      cartItems.map((i) => ({ id: i.sku || i.product_id, name: i.product_name || i.title, price: i.product_price, quantity: i.quantity }))
    );
  }, [cartItems, summary?.grand_total]);

  // A new address: saved to My Address for signed-in customers, used for
  // this order only for guests. Returns true when the form can close.
  const handleAddAddress = async (values) => {
    if (!customer) {
      setGuestEmail(values.email);
      setSelectedAddress({ id: "guest", ...values });
      return true;
    }
    try {
      const res = await createAddress({
        label: values.label,
        name: values.name,
        phone: values.phone,
        address_line1: values.address_line1,
        address_line2: values.address_line2,
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        country: values.country,
      });
      if (res && res.status === false) throw new Error(res.message);
      const saved = res?.data;
      const list = (await fetchAddresses())?.data || [];
      setAddresses(list);
      setSelectedAddress(list.find((a) => a.id === saved?.id) || saved || list[0] || null);
      toast.success("Address saved to My Address");
      return true;
    } catch (err) {
      toast.error(err?.message || "Could not save the address. Please try again.");
      return false;
    }
  };

  const handlePlaceOrder = async () => {
    const addr = selectedAddress;
    if (!addr) {
      toast.error("Add a delivery address to continue.");
      return;
    }
    const email = customer?.email || guestEmail;
    if (!email) {
      toast.error("Add an email for the order confirmation.");
      return;
    }

    setPlacingOrder(true);
    try {
      // The contact person comes from the delivery address.
      const [firstName, ...rest] = String(addr.name || "").trim().split(/\s+/);
      const payload = {
        first_name: firstName || "",
        last_name: rest.join(" "),
        phone_number: addr.phone || "",
        email,
        street_address: [addr.address_line1, addr.address_line2].filter(Boolean).join(", "),
        city: addr.city || "",
        state: addr.state || "",
        zip_code: addr.pincode || "",
        country: addr.country || "",
        payment_method: "ONLINE",
        currency_code: selectedCountry?.currency || "USD",
        shipping_charge: shippingCharge,
      };

      const response = await create(payload);
      if (!response?.status) {
        toast.error(response?.message || "Failed to place order.");
        return;
      }

      const order = response.data?.order;
      dispatch(setOrder(response));
      trackPaymentInfo(
        summary?.grand_total,
        (cartItems || []).map((i) => ({ id: i.sku || i.product_id, name: i.product_name || i.title, price: i.product_price, quantity: i.quantity })),
        "online"
      );
      localStorage.setItem(
        "recentOrder",
        JSON.stringify({
          ...response,
          email,
          analyticsItems: (cartItems || []).map((i) => ({
            id: i.sku || i.product_id,
            name: i.product_name || i.title,
            price: i.product_price,
            quantity: i.quantity,
            variant: [i.metal_type, i.metal_color, i.diamond_shape].filter(Boolean).join(" "),
          })),
        })
      );

      if (!order?.payment_session_id) {
        toast.error("We couldn't start the secure payment. Please try again.");
        return;
      }
      // Hand off to Cashfree's own hosted checkout — card/UPI/netbanking
      // details are entered there, never captured on this site.
      const cashfree = await loadCashfree({
        mode: order.payment_mode || process.env.NEXT_PUBLIC_CASHFREE_MODE || "sandbox",
      });
      await cashfree.checkout({
        paymentSessionId: order.payment_session_id,
        redirectTarget: "_self",
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message ||
          "Failed to place order. Please review your information and try again."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const displayCurrency = selectedCountry?.currency || "USD";
  const payAmountLabel =
    chargeCurrency && chargeAmount != null
      ? `${getCurrencySymbol(chargeCurrency)} ${chargeAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : `${getCurrencySymbol(displayCurrency)} ${convertPrice(summary?.grand_total ?? 0, selectedCountry).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;

  return (
    <section className="flex lg:flex-row flex-col xl:gap-[64px] lg:gap-[50px]">
      <div className="lg:w-[50%] order-1 w-full space-y-[24px]">
        {!customer && (
          <Typography variant="p" className="text-[13px] text-[var(--grey-2)]">
            Have an account?{" "}
            <Link href="/login?redirect=/cart/checkout" className="underline text-[var(--teal-1)]">
              Sign in
            </Link>{" "}
            to use your saved addresses.
          </Typography>
        )}

        <DeliveryAddress
          addresses={addresses}
          selected={selectedAddress}
          onSelect={setSelectedAddress}
          onAdd={handleAddAddress}
          isGuest={!customer}
          guestEmail={guestEmail}
          defaultCountry={selectedCountry?.label || "India"}
          loading={!!customer && addressesLoading}
        />

        {/* Payment: Cashfree only */}
        <div className="border border-[var(--teal-3)] p-[16px] lg:p-[24px] space-y-[16px]">
          <Typography variant="h4" className="font-[500]">
            Payment
          </Typography>
          <div className="flex items-center justify-between gap-4 border border-[var(--teal-1)] bg-[var(--grey-00)] p-[14px]">
            <div>
              <div className="text-[14px] font-[600] text-[var(--teal-1)]">Pay online: Card / UPI / NetBanking</div>
              <div className="text-[12.5px] text-[var(--grey-2)]">
                Secure payment by Cashfree
                {chargeCurrency && chargeCurrency !== displayCurrency && chargeAmount != null
                  ? ` · charged in ${chargeCurrency} (${payAmountLabel}) at today's rate`
                  : ""}
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="4" stroke="var(--color-text)" strokeWidth="1.5" />
              <circle cx="2" cy="2" r="2" transform="matrix(1 0 0 -1 10 14)" stroke="var(--color-text)" strokeWidth="1.5" />
              <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 17 13)" fill="var(--color-text)" />
              <circle cx="1" cy="1" r="1" transform="matrix(1 0 0 -1 5 13)" fill="var(--color-text)" />
            </svg>
          </div>

          <Button
            type="button"
            variant="primary"
            className="!w-full"
            onClick={handlePlaceOrder}
            disabled={placingOrder || !selectedAddress}
            title={placingOrder ? "Opening secure payment…" : `Pay ${payAmountLabel}`}
          />
          {!selectedAddress && !addressesLoading && (
            <p className="text-[12.5px] text-[var(--grey-2)]">Add a delivery address to continue to payment.</p>
          )}

          <p className="text-[12.5px] leading-relaxed text-[var(--grey-2)]">
            Import duties and taxes charged by the destination country are not included in this total and are paid by
            the customer.{" "}
            <Link href="/shipping" className="underline">Shipping &amp; duties</Link>
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:w-[50%] order-2 w-full">
        <div className="lg:border-l lg:border-l-[var(--teal-3)] xl:pl-[64px] lg:pl-[24px] space-y-[24px] top-0 sticky">
          <Typography variant="h4" className="font-[500]">
            Order summary
          </Typography>

          <div className="h-[522px] overflow-y-auto no-scrollbar space-y-[24px] custom-scroll border-b lg:border-b-[var(--teal-3)]">
            {cartItems.length > 0 ? (
              cartItems?.map((items) => (
                <div
                  key={items.cart_item_id}
                  className="grid 2xl:grid-cols-4 grid-cols-3 gap-[30px] py-[24px] justify-items-center items-center"
                >
                  {" "}
                  <div className="px-[18px] py-[13px] bg-[var(--product-bg)] flex items-center mx-auto">
                    <img
                      src={items.image || items.media_image || items.product_image}
                      alt={toTitleCase(items?.title) || "Product"}
                      width={78}
                      height={78}
                      loading="lazy"
                      className="h-[78px] w-[78px]"
                    />
                  </div>
                  <div className="flex flex-col w-full items-start 2xl:col-span-2 md:col-span-1">
                    <Typography variant="h5" className="font-[500]">
                      {toTitleCase(items?.title)}
                    </Typography>
                    <div className="flex flex-col gap-[10px] 2xl:col-span-2 md:col-span-1">
                      <Typography variant="h6" className="md:block hidden">
                        {items?.product_description}
                      </Typography>
                      <Typography variant="h6" className="md:block hidden">
                        Metal:{" "}
                        {items?.metal_type +
                          " " +
                          toTitleCase(items?.metal_color) +
                          " Gold"}
                      </Typography>
                      <Typography variant="h6" className="md:block hidden">
                        Stone Shape: {items?.diamond_shape}
                      </Typography>
                      {items?.ring_size && (
                        <Typography variant="h6" className="md:block hidden">
                          Size: {items?.ring_size}
                        </Typography>
                      )}

                      <QuantitySelector
                        item={items}
                        handleQuantities={async (cart_item_id, newQuantity) => {
                          const payload = {
                            cart_items: [
                              { cart_item_id, quantity: newQuantity },
                            ],
                          };
                          const response = await updateQuantities(payload);
                          if (response.status) {
                            dispatch(
                              fetchCart({
                                currency: selectedCountry?.currency,
                              })
                            );
                          } else {
                            toast.error(
                              response.message || "Failed to update cart"
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                  <Typography variant="p" className="font-[600]">
                    {getCurrencySymbol(selectedCountry?.currency)}{" "}
                    {convertPrice(items.subtotal ?? 0, selectedCountry).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography variant="h5" className="text-center py-8">
                No items to display
              </Typography>
            )}
          </div>

          {/* Coupon Section */}
          <div className="pb-5 pt-6">
            <Typography variant="h5" className="font-[500]">
              Have a coupon?
            </Typography>
            <Typography
              variant="h5"
              className="font-[500]"
              textColor="customGrey"
            >
              Add your code for an instant cart discount
            </Typography>
            <InputWithIconButton
              icon={<CouponIcon className="w-5 h-5" />}
              inputProps={{
                placeholder: "Coupon Code",
                value: couponCode,
                onChange: (e) => {
                  setCouponCode(e.target.value);
                  setError("");
                },
                onKeyDown: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCoupon();
                  }
                },
              }}
              // buttonTitle="Apply"
              className=" w-full"
              onButtonClick={handleCoupon}
            />

            {summary?.coupon_code && (
              <div className="inline-flex items-center justify-between gap-2 bg-[var(--product-bg)] border border-[var(--teal-3)] rounded-[5px] px-3 py-1 mt-3">
                <span className="flex items-center gap-1 lg:text-[16px] text-[12px] font-[400]">
                  <CouponIcon className="w-4 h-4" />
                  {summary?.coupon_code}
                </span>

                <button onClick={remove} className="text-sm font-semibold">
                  ✕
                </button>
              </div>
            )}
          </div>
          <div className="space-y-[16px]">
            <div className="flex justify-between">
              <Typography variant="h5" className="font-[500]">
                No. of Products
              </Typography>
              <Typography variant="h5" className="font-[500]">
                {Number(summary?.number_of_cart_products ?? 0)}
              </Typography>
            </div>

            {/* SUBTOTAL */}
            <div className="flex justify-between">
              <Typography variant="h5" className="font-[500]">
                Subtotal
              </Typography>
              <Typography variant="h5" className="font-[500]">
                {getCurrencySymbol(selectedCountry?.currency)}{" "}
                {convertPrice(summary?.cart_total ?? 0, selectedCountry).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </Typography>
            </div>


            {/* <div className="flex justify-between">
              <Typography variant="h5" className="font-[500]">
                Shipping Chargess
              </Typography>
              <Typography variant="h5" className="font-[500]">
                {getCurrencySymbol(selectedCountry?.currency)}{" "}
                {Number(summary?.selectedShipping ?? 0)}
              </Typography>
            </div> */}

            {/* DISCOUNT ROW */}
            {summary?.coupon_code && (
              <div className="flex justify-between items-center whitespace-nowrap gap-3">
                <Typography
                  variant="h5"
                  className="font-[500] flex items-center gap-2 whitespace-nowrap)]"
                >
                  Discount
                </Typography>
                <Typography
                  variant="h5"
                  className="font-[500] flex items-center gap-1 whitespace-nowrap "
                >
                  <MinusIcon />
                  {getCurrencySymbol(selectedCountry?.currency)}{" "}
                  {convertPrice(summary?.discount ?? 0, selectedCountry).toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
                  <span
                    className="cursor-pointer text-[var(--teal-1)]"
                    onClick={remove}
                  >
                    [Remove]
                  </span>
                </Typography>
              </div>
            )}

            {/* TOTAL */}
            <div className="flex justify-between border-t pt-[16px] mb-[16px] border-t-[var(--teal-3)]">
              <Typography variant="h4" className="flex gap-2 font-[500]">
                Total
              </Typography>
              <Typography variant="h4" className="font-[600]">
                {getCurrencySymbol(selectedCountry?.currency)}{" "}
                {convertPrice(summary?.grand_total ?? 0, selectedCountry).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </Typography>
            </div>
          </div>

          {/* <div className="flex justify-between w-full">
            <Typography variant="h5" className="flex gap-2">
              Subtotal
            </Typography>
            <Typography variant="h5" className="font-[600]">
              {getCurrencySymbol(selectedCountry?.currency) + " "}
              {summary?.cart_total && summary?.cart_total}
            </Typography>
          </div>

          {summary?.coupon_code && (
            <div className="flex justify-between w-full">
              <Typography variant="h5" className="flex gap-2">
                <CouponIcon className="w-5 h-5" />{" "}
                <span>{summary?.coupon_code}</span>
              </Typography>
              <Typography
                variant="h5"
                className="font-[600] text-[var(--teal-1)]"
              >
                - {getCurrencySymbol(selectedCountry?.currency) + " "}
                {summary?.discount}{" "}
                <span className="cursor-pointer" onClick={handleRemoveCoupon}>
                  [Remove]
                </span>
              </Typography>
            </div>
          )}
          <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] pb-4">
            <Typography variant="h5" className="flex gap-2">
              Shipping
            </Typography>
            <Typography variant="h5" className="font-[600]">
              {getCurrencySymbol(selectedCountry?.currency) + " "}
              {shipping ?? shipping}
            </Typography>
          </div>

          <div className="flex justify-between w-full lg:pb-0 pb-5">
            <Typography variant="h4" className="flex gap-2 font-[500]">
              Total
            </Typography>
            <Typography variant="h4" className="font-[600]">
              {getCurrencySymbol(selectedCountry?.currency) + " "}
              {summary?.grand_total}
            </Typography>
          </div> */}
        </div>
      </div>
    </section>
  );
};
export default CheckOutDetails;
