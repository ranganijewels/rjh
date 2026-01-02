"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckIcon } from "@/components/Icons/CheckIcon";
import Button from "@/components/ui/Button/Button";
import Typography from "@/components/ui/Typography/Typography";
import useIsMobile from "@/utils/useIsMobile";
import { useCrudApi } from "@/hooks/useCrudApi";
import { format } from "date-fns";
import { CouponIcon } from "@/components/Icons/common";
import { ReturnRepair } from "./ReturnRepair";

const Orders = () => {
  const { isMobile } = useIsMobile();
  const [orders, setOrders] = useState([]);
  const { fetchAll } = useCrudApi(`/api/orders`);
  const { fetchById } = useCrudApi(`/api/orders`);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [summary, setSummary] = useState({});
  const [shipping, setShipping] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [isReturnSidebarOpen, setIsReturnSidebarOpen] = useState(false);
  const [returnOrder, setReturnOrder] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAll();
        setOrders(data?.data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);

  const getPriceTotal = (price, quantity) => {
    const numericPrice =
      parseFloat(
        typeof price === "string" ? price.replace(/[^0-9.-]+/g, "") : price
      ) || 0;
    return (numericPrice * quantity).toFixed(2);
  };

  // const handleViewInvoice = async (id, download = false) => {
  //   try {
  //     const blob = await fetchById(id);

  //     const url = window.URL.createObjectURL(blob);
  //     window.open(url, "_blank");

  //     if (download) {
  //       const link = document.createElement("a");
  //       link.href = url;
  //       link.download = `invoice-${id}.pdf`;
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     } else {
  //       window.open(url, "_blank");
  //     }
  //   } catch (err) {
  //     console.error("Error fetching invoice:", err);
  //   }
  // };

  const handleViewInvoice = async (id, download = false) => {
    try {
      const res = await fetchById(id, { raw: true });

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice-${id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(url, "_blank");
      }

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error("Error fetching invoice:", err);
    }
  };

  const OrderActions = ({ order }) => {
    const handleViewOrder = () => {
      setSelectedOrder(order);

      setSummary({
        cart_total: parseFloat(order.total) || 0,
        coupon_code: order?.coupon?.code || null,
        discount: order?.coupon?.discount || 0,
      });

      setShipping(parseFloat(order?.shipping_cost) || 0);

      setIsSidebarOpen(true);
    };

    return (
      <div className="space-x-[20px]">
        <Button title="View order" onClick={handleViewOrder} />
        <Button
          title="View invoice"
          variant="outlineTeal"
          onClick={() => handleViewInvoice(order.id)}
        />
      </div>
    );
  };

  const ProductActions = ({ productId, order }) => (
    <div className="flex justify-between">
      <div className="flex flex-row gap-[14px]">
        <CheckIcon />
        <Typography variant="h6">
          Order Placed {format(new Date(order.created_at), "MMMM dd, yyyy")}
        </Typography>
      </div>
      <div className="flex gap-[32px] justify-end">
        <Link href={`/product/${productId}`}>
          <Typography variant="p" className="font-[500]">
            View Product
          </Typography>
        </Link>
        <div className="w-0 h-5 origin-top-left outline outline-offset-[-0.50px] outline-[var(--teal-2)]" />
        <Link href={`/product/${productId}`}>
          <Typography variant="p" className="font-[500]">
            Buy Again
          </Typography>
        </Link>
      </div>
    </div>
  );

  return (
    <div>
      <p className="xl:text-[40px] text-[26px] font-[400] text-[var(--grey-2)] xl:mb-[50px] mb-[30px]">
        Orders
      </p>
      {orders?.data?.length > 0 ? (
        <div className="space-y-[30px]">
          {orders?.data?.map((order, orderIdx) => {
            return (
              <div key={orderIdx} className="bg-[var(--grey-0)]">
                <div className="flex justify-between py-[30px] xl:px-[40px] px-[20px]">
                  <div className="flex md:flex-nowrap flex-wrap gap-[22px]">
                    {[
                      { label: "Order Number", value: order.id },
                      {
                        label: "Date Placed",
                        value: format(
                          new Date(order.created_at),
                          "MMMM dd, yyyy"
                        ),
                      },
                      {
                        label: "Total Amount",
                        value: `$${parseFloat(order.total).toFixed(2)}`,
                      },
                    ].map((item, i) => (
                      <div key={i}>
                        <Typography variant="h5" className="font-[500]">
                          {item.label}
                        </Typography>
                        <Typography variant="h6">{item.value}</Typography>
                      </div>
                    ))}
                  </div>
                  {!isMobile && <OrderActions order={order} />}
                </div>

                <hr className="hr-teal-3" />

                {Array.isArray(order.items) &&
                  order?.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col xl:py-[30px] py-[20px] xl:px-[40px] px-[20px]"
                    >
                      <div className="flex md:flex-row flex-col justify-between">
                        <div className="flex md:gap-[30px] gap-[13px]">
                          <div className="lg:p-[43px_21px] p-[35px_10px] bg-[var(--product-bg)] w-[164px] h-[209px] max-[340px]:h-[154px]">
                            <img
                              className="w-[122px] h-[122px] object-cover"
                              src={item?.product?.image}
                              alt="product"
                            />
                          </div>

                          <div className="space-y-[10px] md:max-w-[357px] max-w-[180px]">
                            <Typography variant="h5" className="font-[500]">
                              {item?.product?.title}
                            </Typography>
                            <Typography variant="h6">
                              {item?.product?.description}
                            </Typography>
                            {isMobile && (
                              <Typography
                                variant="h5"
                                className="text-[14px] font-[600] text-[var(--teal-1)]"
                              >
                                $
                                {getPriceTotal(
                                  item.productPrice,
                                  item.quantity
                                )}
                              </Typography>
                            )}
                            <Typography variant="h6" className="font-[500]">
                              Shape:{" "}
                              <span className="font-[400] text-[var(--teal-1)]">
                                {item?.product?.occasion?.custom_title}
                              </span>
                            </Typography>
                            <Typography variant="h6" className="font-[500]">
                              Carat :{" "}
                              <span className="font-[400] text-[var(--teal-1)]">
                                {parseFloat(item?.center_diamond_weight) +
                                  " ctw"}
                              </span>
                            </Typography>
                            <Typography variant="h6" className="font-[500]">
                              Metal :{" "}
                              <span className="font-[400] text-[var(--teal-1)]">
                                {item?.product?.quality?.value}
                              </span>
                            </Typography>
                            <Typography variant="h6" className="font-[500]">
                              Size :{" "}
                              <span className="font-[400] text-[var(--teal-1)]">
                                {item?.ring_size}
                              </span>
                            </Typography>
                            <Typography variant="h6" className="font-[500]">
                              Qty:{" "}
                              <span className="font-[400] text-[var(--teal-1)]">
                                {item?.quantity}
                              </span>
                            </Typography>
                          </div>
                        </div>
                        {!isMobile && (
                          <Typography
                            variant="h5"
                            className="text-[14px] font-[600] text-[var(--teal-1)]"
                          >
                            ${getPriceTotal(item?.price, item?.quantity)}
                          </Typography>
                        )}
                      </div>
                      <div className="mt-[20px]">
                        <ProductActions
                          productId={item?.product_id}
                          // designno={item.designno}
                          order={order}
                          // color={item.color}
                        />
                      </div>
                    </div>
                  ))}

                {isMobile && (
                  <div className="px-[10px] py-[20px] flex flex-col gap-[20px] items-center">
                    <OrderActions order={order} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          You haven't placed any orders yet.
        </p>
      )}
      {/* Sidebar Order Details */}
      {isSidebarOpen && selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-[700px] bg-white shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky -top-6 bg-white border-b border-b-[var(--teal-3)] py-4 z-10">
              <Typography variant="h4">Order #{selectedOrder.id}</Typography>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <img
                  src="/icons/close.svg"
                  className="w-[12px] h-[12px] cursor-pointer"
                  alt="close icon"
                />
              </button>
            </div>
            <div className="space-y-[20px]">
              {Array.isArray(selectedOrder.items) &&
                selectedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex md:flex-row flex-col justify-between gap-[30px] items-start"
                  >
                    {/* Image container */}
                    <div className="lg:p-[43px_21px] p-[35px_10px] bg-[var(--product-bg)] w-[164px] h-[209px] max-[340px]:h-[154px] flex items-center justify-center">
                      <img
                        className="w-[122px] h-[122px] object-cover"
                        src={item?.product?.image}
                        alt="product"
                      />
                    </div>

                    <div className="space-y-[10px] md:max-w-[357px] max-w-[180px] flex-1">
                      <Typography variant="h5" className="font-[500]">
                        {item?.product?.title}
                      </Typography>
                      <Typography variant="h6">
                        {item?.product?.description}
                      </Typography>

                      <Typography variant="h6" className="font-[500]">
                        Shape:{" "}
                        <span className="font-[400] text-[var(--teal-1)]">
                          {item?.product?.occasion?.custom_title}
                        </span>
                      </Typography>
                      <Typography variant="h6" className="font-[500]">
                        Carat:{" "}
                        <span className="font-[400] text-[var(--teal-1)]">
                          {parseFloat(item?.center_diamond_weight)} ctw
                        </span>
                      </Typography>
                      <Typography variant="h6" className="font-[500]">
                        Metal:{" "}
                        <span className="font-[400] text-[var(--teal-1)]">
                          {item?.product?.quality?.value}
                        </span>
                      </Typography>
                      <Typography variant="h6" className="font-[500]">
                        Size:{" "}
                        <span className="font-[400] text-[var(--teal-1)]">
                          {item?.ring_size}
                        </span>
                      </Typography>
                      <Typography variant="h6" className="font-[500]">
                        Qty:{" "}
                        <span className="font-[400] text-[var(--teal-1)]">
                          {item?.quantity}
                        </span>
                      </Typography>
                    </div>

                    <div className="self-center md:self-start">
                      <button className="bg-[var(--teal-3)] text-black text-sm font-medium px-4 py-2 rounded-lg shadow">
                        In Progress
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="w-[620px]">
              <div className="flex md:flex-nowrap flex-wrap justify-between gap-[22px] mt-6">
                {[
                  { label: "Order Number", value: selectedOrder.id },
                  {
                    label: "Date Placed",
                    value: format(
                      new Date(selectedOrder?.created_at),
                      "MMMM dd, yyyy"
                    ),
                  },
                  {
                    label: "Total Amount",
                    value: `$${parseFloat(selectedOrder?.total).toFixed(2)}`,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col min-w-[150px]">
                    <span className="text-gray-500 text-sm">{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <Typography variant="p" className="font-semibold mb-4">
                Shipping Order
              </Typography>

              <div className="relative pl-6 border-l-2 border-[var(--teal-2)] space-y-8">
                <div className="relative">
                  <img
                    src="/icons/Ellipse.svg"
                    className="absolute -left-[32px] top-0 w-3.5 h-3.5"
                  />
                  <Typography variant="h5" className="font-[600]">
                    Order Placed
                  </Typography>
                  <Typography variant="h6" className="text-gray-500">
                    {format(
                      new Date(selectedOrder.created_at),
                      "MMMM dd, yyyy hh:mm a"
                    )}
                  </Typography>
                </div>

                <div className="relative">
                  <img
                    src="/icons/Ellipse.svg"
                    className="absolute -left-[32px] top-1 w-3.5 h-3.5"
                  />
                  <Typography variant="h5" className="font-[600]">
                    Order Confirmed
                  </Typography>
                  <Typography variant="h6" className="text-gray-500">
                    {format(
                      new Date(selectedOrder.created_at),
                      "MMMM dd, yyyy hh:mm a"
                    )}
                  </Typography>
                </div>

                <div className="relative">
                  <img
                    src="/icons/Ellipse.svg"
                    className="absolute -left-[32px] top-1 w-3.5 h-3.5"
                  />
                  <Typography variant="h5" className="font-[600]">
                    Product Shipped
                  </Typography>
                  <Typography variant="h6" className="text-gray-500">
                    March 16, 2025 5:23 pm
                  </Typography>
                  <div className="mt-2 space-y-1">
                    <Typography variant="h6" className="font-[500]">
                      Courier Service:{" "}
                      <span className="text-[var(--teal-1)]">
                        UPS. R. Gosling
                      </span>
                    </Typography>
                    <Typography variant="h6" className="font-[500]">
                      Estimated Delivery Date:{" "}
                      <span className="text-[var(--teal-1)]">
                        March 22, 2025
                      </span>
                    </Typography>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src="/icons/Ellipse.svg"
                    className="absolute -left-[32px] top-1 w-3.5 h-3.5"
                  />
                  <Typography variant="h5" className="font-[600]">
                    Product Packaging
                  </Typography>
                  <Typography variant="h6" className="text-gray-500">
                    March 16, 2025 5:23 pm
                  </Typography>
                  <div className="mt-2 space-y-1">
                    <Typography variant="h6" className="font-[500]">
                      Tracking Number:{" "}
                      <span className="text-[var(--teal-1)]">
                        3409-4934-4253
                      </span>
                    </Typography>
                    <Typography variant="h6" className="font-[500]">
                      Warehouse:{" "}
                      <span className="text-[var(--teal-1)]">Lorem Ipsum</span>
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex md:flex-nowrap flex-wrap gap-[23px] mt-6 font-[18px]">
              <Typography variant="p" className="font-semibold">
                Payment Summary
              </Typography>
            </div>
            {!summary?.coupon_code && (
              <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
                <Typography variant="h5" className="flex gap-2">
                  <CouponIcon className="w-5 h-5" />{" "}
                  <span>{!summary?.coupon_code}</span>
                </Typography>
                <Typography
                  variant="h5"
                  className="font-[600] text-[var(--teal-1)]"
                >
                  -${summary?.discount?.toFixed(2)}
                </Typography>
              </div>
            )}

            <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
              <Typography variant="h5" className="flex gap-2">
                Shipping
              </Typography>
              <Typography variant="h5" className="font-[600]">
                ${shipping?.toFixed(2) ?? "0.00"}
              </Typography>
            </div>

            <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
              <Typography variant="h5" className="flex gap-2">
                Subtotal
              </Typography>
              <Typography variant="h5" className="font-[600]">
                ${summary?.cart_total?.toFixed(2) ?? "0.00"}
              </Typography>
            </div>

            <div className="flex justify-between w-full  border-b-[var(--teal-3)] py-[13px]">
              <Typography variant="h4" className="flex gap-2 font-[500]">
                Total
              </Typography>
              <Typography variant="h4" className="font-[600]">
                $
                {(
                  summary?.cart_total -
                  (summary?.discount || 0) +
                  shipping
                ).toFixed(2)}
              </Typography>
            </div>

            <div>
              <div className="flex flex-col gap-[7px]">
                <Typography variant="h5" className="font-semibold">
                  Payment Method
                </Typography>
                <Typography variant="h6">MasterCard ***********4321</Typography>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[92px] my-6">
              <div>
                <Typography variant="h6" className="font-semibold">
                  Shipping Address
                </Typography>
                <Typography variant="h6">
                  4517 Washington Ave, Manchester, USA 569874
                </Typography>
              </div>
              <div>
                <Typography variant="h6" className="font-semibold">
                  Billing Address
                </Typography>
                <Typography variant="h6">Same as Shipping Address</Typography>
              </div>
            </div>

            <div className="flex gap-[20px] mt-6">
              <Button
                title="Download Invoice"
                onClick={() => handleViewInvoice(selectedOrder.id, true)}
              />
              <Button
                title="Return / Exchange Product"
                variant="outlineTeal"
                onClick={() => {
                  setReturnOrder(selectedOrder);
                  setIsReturnSidebarOpen(true);
                }}
              />
            </div>
          </div>
        </div>
      )}
      {isReturnSidebarOpen && returnOrder && (
        <div className="fixed inset-0 z-[9999] flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsReturnSidebarOpen(false)}
          />

          {/* Right Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-[700px] bg-white shadow-lg p-6 overflow-y-auto hide-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 sticky -top-6 bg-white border-b border-b-[var(--teal-3)] py-4 z-10">
              <p className="text-[22px] font-[600]">
                Return / Repair – Order #{returnOrder?.id}
              </p>

              <button
                onClick={() => setIsReturnSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <img
                  src="/icons/close.svg"
                  className="w-[12px] h-[12px]"
                  alt="close"
                />
              </button>
            </div>

            <ReturnRepair order={returnOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
