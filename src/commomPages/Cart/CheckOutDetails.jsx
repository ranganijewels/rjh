// "use client";

// import { CouponIcon } from "@/components/Icons/common";
// import Button from "@/components/ui/Button/Button";
// import RadioButton from "@/components/ui/Button/RadioButton";
// import Checkbox from "@/components/ui/Checkbox/Checkbox";
// import Input from "@/components/ui/Input/Input";
// import Typography from "@/components/ui/Typography/Typography";
// import { useCrudApi } from "@/hooks/useCrudApi";
// import { clearCoupon, fetchCart } from "@/store/slices/cartSlice";
// import { setOrder } from "@/store/slices/orderSlice";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import QuantitySelector from "./QuantitySelector";
// import { toTitleCase } from "@/utils/string";
// import Dropdown from "@/components/ui/Dropdown/Dropdown";
// import { getCurrencySymbol } from "@/utils/currencySymbol";
// import { usePreferences } from "@/context/PreferencesContext";

// const CheckOutDetails = () => {
//   const [isDifferentBilling, setIsDifferentBilling] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const { customer } = useSelector((state) => state.auth);
//   const [fetchAddressesData, setFetchAddressesData] = useState([]);
//   const { fetchAll } = useCrudApi("/api/address");
//   const { selectedCountry } = usePreferences();

//   useEffect(() => {
//     fetchAll()
//       .then((res) => setFetchAddressesData(res.data || []))
//       .catch((err) => console.error("Error fetching addresses", err));
//   }, [fetchAll]);

//   const { create: updateQuantities } = useCrudApi(
//     "/api/cart/update-quantities"
//   );

//   // Contact info
//   const [contactInfo, setContactInfo] = useState({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: "",
//   });
//   const [address, setAddress] = useState({
//     street: "",
//     country: "",
//     city: "",
//     state: "",
//     zipCode: "",
//     billingStreetAddress: "",
//     billingCountry: "",
//     billingCity: "",
//     billingState: "",
//     billingZipcode: "",
//     addressType: "",
//   });

//   useEffect(() => {
//     if (customer) {
//       setContactInfo({
//         firstName: customer.first_name || "",
//         lastName: customer.last_name || "",
//         phone: customer.phone_number || "",
//         email: customer.email || "",
//       });

//       setAddress((prev) => ({
//         ...prev,
//         street: customer.street_address || "",
//         city: customer.city || "",
//         state: customer.state || "",
//         zipCode: customer.zip_code || "",
//       }));
//     }
//   }, [customer]);

//   const [paymentDetails, setPaymentDetails] = useState({
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//   });

//   const router = useRouter();
//   const dispatch = useDispatch();

//   const { cartItems, summary, loading, error, shipping, coupon } = useSelector(
//     (state) => state.cart
//   );

//   const shippingCharge = useSelector((state) => state.cart.shipping);
//   const { create } = useCrudApi(`/api/cart/place-order`);
//   const { create: removeCouponApi } = useCrudApi(`/api/cart/remove-coupon`);

//   const handlePaymentChange = (value) => {
//     setSelectedPayment(value);
//   };

//   const handlePlaceOrder = async () => {
//     const validationErrors = validateForm();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length > 0) {
//       return;
//     }

//     setPlacingOrder(true); // start loading

//     try {
//       const payload = {
//         first_name: contactInfo.firstName,
//         last_name: contactInfo.lastName,
//         phone_number: contactInfo.phone,
//         email: contactInfo.email,
//         street_address: address.street,
//         city: address.city,
//         state: address.state,
//         zip_code: address.zipCode,
//         payment_method: selectedPayment,
//         use_different_billing: isDifferentBilling,
//         shipping_charge: shippingCharge,
//         card_number: paymentDetails.cardNumber.replace(/\s/g, ""),
//         expiry_date: paymentDetails.expiryDate,
//         cvv: paymentDetails.cvv,
//         ...(isDifferentBilling && {
//           billing_street_address: address.billingStreetAddress,
//           billing_city: address.billingCity,
//           billing_state: address.billingState,
//           billing_zip_code: address.billingZipcode,
//         }),
//       };

//       const response = await create(payload);
//       if (response.status) {
//         dispatch(setOrder(response));
//         router.push("/cart/order-complete");
//       }
//     } catch (error) {
//       console.error("Error placing order:", error);
//       toast.error("Failed to place order");
//     } finally {
//       setPlacingOrder(false); // stop loading
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Contact Info
//     if (!contactInfo.firstName.trim()) {
//       newErrors.firstName = "First name is required.";
//     }

//     if (!contactInfo.lastName.trim()) {
//       newErrors.lastName = "Last name is required.";
//     }

//     if (!contactInfo.phone.trim()) {
//       newErrors.phone = "Phone number is required.";
//     } else if (!/^\d{10}$/.test(contactInfo.phone)) {
//       newErrors.phone = "Phone number must be 10 digits.";
//     }

//     if (!contactInfo.email.trim()) {
//       newErrors.email = "Email is required.";
//     } else if (!/^\S+@\S+\.\S+$/.test(contactInfo.email)) {
//       newErrors.email = "Invalid email format.";
//     }

//     // Shipping Address
//     if (!address.street.trim()) {
//       newErrors.street = "Street address is required.";
//     }

//     if (!address.city.trim()) {
//       newErrors.city = "City is required.";
//     }

//     if (!address.state.trim()) {
//       newErrors.state = "State is required.";
//     }

//     if (!address.zipCode.trim()) {
//       newErrors.zipCode = "Zip Code is required.";
//     }

//     // Billing Address
//     if (isDifferentBilling) {
//       if (!address.billingStreetAddress.trim()) {
//         newErrors.billingStreetAddress = "Billing street is required.";
//       }

//       if (!address.billingCity.trim()) {
//         newErrors.billingCity = "Billing city is required.";
//       }

//       if (!address.billingState.trim()) {
//         newErrors.billingState = "Billing state is required.";
//       }

//       if (!address.billingZipcode.trim()) {
//         newErrors.billingZipcode = "Billing zip code is required.";
//       }

//       if (!address.addressType.trim()) {
//         newErrors.addressType = "Address type is required.";
//       }
//     }

//     // Payment
//     if (!selectedPayment) {
//       newErrors.selectedPayment = "Select a payment method.";
//     }

//     if (!paymentDetails.cardNumber.trim()) {
//       newErrors.cardNumber = "Card number is required.";
//     }

//     if (!paymentDetails.expiryDate.trim()) {
//       newErrors.expiryDate = "Expiry date is required.";
//     }

//     if (!paymentDetails.cvv.trim()) {
//       newErrors.cvv = "CVV is required.";
//     }

//     return newErrors;
//   };

//   const handleContactChange = (e) => {
//     const { name, value } = e.target;
//     setContactInfo((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleRemoveCoupon = async () => {
//     try {
//       const res = await removeCouponApi();

//       if (res.status) {
//         dispatch(clearCoupon());
//         dispatch(fetchCart());
//         toast.success("Coupon removed successfully");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to remove coupon");
//     }
//   };

//   const addressOptions = [
//     ...fetchAddressesData.map((addr) => ({
//       label: addr.address_type,
//       value: addr.id, // better to use id instead of type
//     })),
//     { label: "+ Add New Address", value: "add_new" },
//   ];

//   const handleAddressSelect = (value) => {
//     if (value === "add_new") {
//       resetForm();
//       setIsModalOpen(true);
//     } else {
//       const selectedAddr = fetchAddressesData.find(
//         (addr) => addr.id === value?.value
//       );

//       if (selectedAddr) {
//         setAddress({
//           street: selectedAddr.street_address || "",
//           city: selectedAddr.city || "",
//           state: selectedAddr.state || "",
//           zipCode: selectedAddr.zip_code || "",
//           addressType: selectedAddr.address_type || "",
//         });
//       } else {
//         setAddress({
//           street: "",
//           city: "",
//           state: "",
//           zipCode: "",
//           addressType: "",
//         });
//       }
//     }
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setAddress((prev) => ({ ...prev, [name]: value }));
//   };

//   const handlePaymentDetailsChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "expiryDate") {
//       let cleanValue = value.replace(/\D/g, "");

//       cleanValue = cleanValue.slice(0, 4);

//       if (cleanValue.length >= 3) {
//         cleanValue = cleanValue.slice(0, 2) + "/" + cleanValue.slice(2);
//       }

//       setPaymentDetails((prev) => ({ ...prev, [name]: cleanValue }));
//     } else {
//       if (/^\d*$/.test(value)) {
//         setPaymentDetails((prev) => ({ ...prev, [name]: value }));
//       }
//     }
//   };

//   return (
//     <section className="flex lg:flex-row flex-col xl:gap-[64px] lg:gap-[50px]">
//       <div className="lg:w-[50%] lg:order-1 order-2 w-full space-y-[24px]">
//         {/* Contact Information */}
//         <div className="border border-[var(--teal-3)] py-[40px] px-[24px]">
//           <div className="space-y-[24px]">
//             <Typography variant="h4" className="font-[500]">
//               Contact Information
//             </Typography>
//             <div className="flex gap-[24px]">
//               <div className="w-full">
//                 <Input
//                   label="First Name"
//                   placeholder="First Name"
//                   borderBottom
//                   containerClass="w-full"
//                   name="firstName"
//                   value={contactInfo.firstName}
//                   onChange={handleContactChange}
//                 />
//                 {errors.firstName && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>
//               <div className="w-full">
//                 <Input
//                   label="Last Name"
//                   placeholder="Last Name"
//                   borderBottom
//                   containerClass="w-full"
//                   name="lastName"
//                   value={contactInfo.lastName}
//                   onChange={handleContactChange}
//                 />
//                 {errors.lastName && (
//                   <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
//                 )}
//               </div>
//             </div>
//             <Input
//               label="Phone Number"
//               placeholder="Phone Number"
//               borderBottom
//               type="tel"
//               pattern="[0-9]{10}"
//               name="phone"
//               value={contactInfo.phone}
//               onChange={handleContactChange}
//             />
//             {errors.phone && (
//               <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
//             )}
//             <Input
//               label="Email address"
//               placeholder="Your Email"
//               borderBottom
//               type="email"
//               name="email"
//               value={contactInfo.email}
//               onChange={handleContactChange}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>
//         </div>

//         {/* Shipping Address */}
//         <div className="border border-[var(--teal-3)] py-[40px] px-[24px]">
//           <div className="space-y-[24px]">
//             <Typography variant="h4" className="font-[500]">
//               Shipping Address
//             </Typography>
//             <div className="flex flex-col gap-1 w-full">
//               <span>Address Type</span>
//               <Dropdown
//                 placeholder="Select Address Type"
//                 borderBottom
//                 options={addressOptions.map((addr) => ({
//                   label: addr.label,
//                   value: addr.value,
//                 }))}
//                 fullWidth
//                 customWidth={"w-full"}
//                 containerClass="flex-col"
//                 name="addressType"
//                 value={address.addressType}
//                 onChange={handleAddressSelect}
//               />
//             </div>
//             {errors.addressType && (
//               <p className="text-red-500 text-sm mt-1">{errors.addressType}</p>
//             )}{" "}
//             <Input
//               label="Street Address *"
//               placeholder="Street Address"
//               borderBottom
//               name="street"
//               value={address.street}
//               onChange={handleAddressChange}
//             />
//             {errors.street && (
//               <p className="text-red-500 text-sm mt-1">{errors.street}</p>
//             )}
//             {/* <Dropdown
//               label="Country *"
//               placeholder="Country"
//               borderBottom
//               options={["india", "us"]}
//               fullWidth
//               containerClass="flex-col"
//               name="country"
//               value={address.country}
//               onChange={(e) =>
//                 setAddress((prev) => ({ ...prev, country: e.target.value }))
//               }
//             /> */}
//             <Input
//               label="Town / City *"
//               placeholder="Town / City"
//               borderBottom
//               name="city"
//               value={address.city}
//               onChange={handleAddressChange}
//             />
//             {errors.city && (
//               <p className="text-red-500 text-sm">{errors.city}</p>
//             )}
//             <div className="flex gap-[24px]">
//               <div className="w-full">
//                 <Input
//                   label="State"
//                   placeholder="State"
//                   borderBottom
//                   containerClass="w-full"
//                   name="state"
//                   value={address.state}
//                   onChange={handleAddressChange}
//                 />
//                 {errors.state && (
//                   <p className="text-red-500 text-sm mt-1">{errors.state}</p>
//                 )}
//               </div>

//               <div className="w-full">
//                 <Input
//                   label="Zip Code"
//                   placeholder="Zip Code"
//                   borderBottom
//                   containerClass="w-full"
//                   name="zipCode"
//                   value={address.zipCode}
//                   onChange={handleAddressChange}
//                 />
//                 {errors.zipCode && (
//                   <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
//                 )}
//               </div>
//             </div>
//             <Checkbox
//               name="default"
//               label="Use a different billing address (optional)"
//               checked={isDifferentBilling}
//               onChange={(e) => setIsDifferentBilling(e.target.checked)}
//               inputClass="w-5 h-5"
//             />
//             {isDifferentBilling && (
//               <>
//                 {" "}
//                 <Input
//                   label="Street Address *"
//                   placeholder="Street Address"
//                   borderBottom
//                   name="billingStreetAddress"
//                   value={address.billingStreetAddress}
//                   onChange={handleAddressChange}
//                 />
//                 {errors.billingStreetAddress && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.billingStreetAddress}
//                   </p>
//                 )}
//                 <Input
//                   label="Town / City *"
//                   placeholder="Town / City"
//                   borderBottom
//                   name="billingCity"
//                   value={address.billingCity}
//                   onChange={handleAddressChange}
//                 />
//                 {errors.billingCity && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.billingCity}
//                   </p>
//                 )}
//                 <div className="flex gap-[24px]">
//                   <Input
//                     label="State"
//                     placeholder="State"
//                     borderBottom
//                     containerClass="w-full"
//                     name="billingState"
//                     value={address.billingState}
//                     onChange={handleAddressChange}
//                   />
//                   {errors.billingState && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.billingState}
//                     </p>
//                   )}
//                   <Input
//                     label="Zip Code"
//                     placeholder="Zip Code"
//                     borderBottom
//                     containerClass="w-full"
//                     name="billingZipcode"
//                     value={address.billingZipcode}
//                     onChange={handleAddressChange}
//                   />
//                   {errors.billingZipcode && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.billingZipcode}
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Payment Methods */}
//         <div className="border border-[var(--teal-3)] py-[40px] px-[24px]">
//           <div className="space-y-[24px]">
//             <Typography variant="h4" className="font-[500]">
//               Payment method
//             </Typography>
//             <div className="space-y-[12px]">
//               <RadioButton
//                 name="payment"
//                 value="credit-card"
//                 checked={selectedPayment === "card"}
//                 onChange={() => handlePaymentChange("card")}
//               >
//                 <div className="flex justify-between w-full">
//                   <span>Pay by Card Credit</span>
//                   <span>
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                     >
//                       <rect
//                         x="2"
//                         y="4"
//                         width="20"
//                         height="16"
//                         rx="4"
//                         stroke="#141718"
//                         strokeWidth="1.5"
//                       />
//                       <circle
//                         cx="2"
//                         cy="2"
//                         r="2"
//                         transform="matrix(1 0 0 -1 10 14)"
//                         stroke="#141718"
//                         strokeWidth="1.5"
//                       />
//                       <circle
//                         cx="1"
//                         cy="1"
//                         r="1"
//                         transform="matrix(1 0 0 -1 17 13)"
//                         fill="#141718"
//                       />
//                       <circle
//                         cx="1"
//                         cy="1"
//                         r="1"
//                         transform="matrix(1 0 0 -1 5 13)"
//                         fill="#141718"
//                       />
//                     </svg>
//                   </span>
//                 </div>
//               </RadioButton>

//               {/* <RadioButton
//                 name="payment"
//                 value="paypal"
//                 checked={selectedPayment === "paypal"}
//                 onChange={() => handlePaymentChange("paypal")}
//               >
//                 <div className="flex justify-between w-full">
//                   <span>Paypal</span>
//                 </div>
//               </RadioButton> */}

//               {/* <RadioButton
//                 name="payment"
//                 value="cod"
//                 checked={selectedPayment === "cod"}
//                 onChange={() => handlePaymentChange("cod")}
//               >
//                 <div className="flex justify-between w-full">
//                   <span>Cash On Delivery</span>
//                 </div>
//               </RadioButton> */}
//             </div>

//             {/* Add your payment input fields here... */}
//             <Input
//               label="Card Number"
//               placeholder="1234 1234 1234 1234"
//               borderBottom
//               type="text"
//               name="cardNumber"
//               value={paymentDetails.cardNumber}
//               onChange={(e) => {
//                 let value = e.target.value.replace(/\D/g, ""); // remove non-digits
//                 value = value.slice(0, 16); // max 16 digits
//                 // format into groups of 4
//                 value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
//                 setPaymentDetails((prev) => ({ ...prev, cardNumber: value }));
//               }}
//               // errorMessage={errors.cardNumber}
//             />
//             {errors.cardNumber && (
//               <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
//             )}

//             <div className="flex gap-[24px]">
//               <div className="w-full">
//                 <Input
//                   label="Expiration date"
//                   placeholder="MM/YY"
//                   borderBottom
//                   type="text"
//                   containerClass="w-full"
//                   name="expiryDate"
//                   value={paymentDetails.expiryDate}
//                   onChange={handlePaymentDetailsChange}
//                 />
//                 {errors.expiryDate && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.expiryDate}
//                   </p>
//                 )}
//               </div>

//               <div className="w-full">
//                 <Input
//                   label="CVV"
//                   placeholder="CVV code"
//                   borderBottom
//                   containerClass="w-full"
//                   name="cvv"
//                   value={paymentDetails.cvv}
//                   onChange={handlePaymentDetailsChange}
//                   type="password"
//                   inputMode="numeric"
//                   pattern="[0-9]*"
//                   maxLength={3}
//                 />
//                 {errors.cvv && (
//                   <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
//                 )}
//               </div>
//             </div>
//             <Button
//               title={placingOrder ? "Placing Order..." : "Place Order"}
//               className="!w-full"
//               onClick={handlePlaceOrder}
//               disabled={placingOrder}
//             >
//               {placingOrder && (
//                 <svg
//                   className="animate-spin mr-2 h-5 w-5 text-white inline"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                   ></path>
//                 </svg>
//               )}
//               {placingOrder ? "Placing Order..." : "Place Order"}
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Order Summary - unchanged */}
//       <div className="lg:w-[50%] lg:order-2 order-1 w-full">
//         <div className="lg:border-l lg:border-l-[var(--teal-3)] xl:pl-[64px] lg:pl-[24px] space-y-[24px] top-0 sticky">
//           <h2 className="font-[500] md:text-[20px] text-[16px]">
//             Order summary
//           </h2>

//           {cartItems.length > 0 &&
//             cartItems?.map((items) => (
//               <div
//                 key={items.cart_item_id}
//                 className="grid 2xl:grid-cols-4 grid-cols-3 gap-[30px] py-[24px] justify-items-center items-center border-b border-b-[var(--teal-3)]"
//               >
//                 {" "}
//                 <div className="px-[18px] py-[13px] bg-[var(--product-bg)] flex items-center mx-auto">
//                   <img src={items.image} className="h-[78px] w-[78px]" />
//                 </div>
//                 <div className="flex flex-col w-full items-start gap-[10px] 2xl:col-span-2 md:col-span-1">
//                   <Typography variant="h5" className="font-[500]">
//                     {toTitleCase(items.title)}
//                   </Typography>

//                   <QuantitySelector
//                     item={items}
//                     handleQuantities={async (cart_item_id, newQuantity) => {
//                       const payload = {
//                         cart_items: [{ cart_item_id, quantity: newQuantity }],
//                       };
//                       const response = await updateQuantities(payload);
//                       if (response.status) {
//                         toast.success("Cart updated");
//                         dispatch(fetchCart());
//                       } else {
//                         toast.error(
//                           response.message || "Failed to update cart"
//                         );
//                       }
//                     }}
//                   />
//                 </div>
//                 <Typography variant="p" className="font-[600]">
//                   {getCurrencySymbol(selectedCountry?.currency)}{" "}
//                   {(items.subtotal ?? 0)}
//                 </Typography>
//               </div>
//             ))}

//           {summary?.coupon_code && (
//             <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
//               <Typography variant="h5" className="flex gap-2">
//                 <CouponIcon className="w-5 h-5" />{" "}
//                 <span>{summary?.coupon_code}</span>
//               </Typography>
//               <Typography
//                 variant="h5"
//                 className="font-[600] text-[var(--teal-1)]"
//               >
//                 - {getCurrencySymbol(selectedCountry?.currency)}
//                 {summary?.discount}{" "}
//                 <span className="cursor-pointer" onClick={handleRemoveCoupon}>
//                   [Remove]
//                 </span>
//               </Typography>
//             </div>
//           )}
//           <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
//             <Typography variant="h5" className="flex gap-2">
//               Shipping
//             </Typography>
//             <Typography variant="h5" className="font-[600]">
//               {getCurrencySymbol(selectedCountry?.currency)}
//               {shipping ?? shipping}
//             </Typography>
//           </div>
//           <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
//             <Typography variant="h5" className="flex gap-2">
//               Subtotal
//             </Typography>
//             <Typography variant="h5" className="font-[600]">
//               {getCurrencySymbol(selectedCountry?.currency)}
//               {summary?.cart_total && summary?.cart_total}
//             </Typography>
//           </div>
//           <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
//             <Typography variant="h4" className="flex gap-2 font-[500]">
//               Total
//             </Typography>
//             <Typography variant="h4" className="font-[600]">
//               {getCurrencySymbol(selectedCountry?.currency)}
//               {summary?.cart_total ?? summary?.cart_total}
//             </Typography>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };
// export default CheckOutDetails;

//urvil code revised

"use client";

import { CouponIcon } from "@/components/Icons/common";
import Button from "@/components/ui/Button/Button";
import RadioButton from "@/components/ui/Button/RadioButton";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Input from "@/components/ui/Input/Input";
import Typography from "@/components/ui/Typography/Typography";
import { useCrudApi } from "@/hooks/useCrudApi";
import { clearCoupon, fetchCart } from "@/store/slices/cartSlice";
import { setOrder } from "@/store/slices/orderSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import QuantitySelector from "./QuantitySelector";
import { toTitleCase } from "@/utils/string";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import { getCurrencySymbol } from "@/utils/currencySymbol";
import { usePreferences } from "@/context/PreferencesContext";

const CheckOutDetails = () => {
  const [isDifferentBilling, setIsDifferentBilling] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [errors, setErrors] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const { customer } = useSelector((state) => state.auth);
  const [fetchAddressesData, setFetchAddressesData] = useState([]);
  const { fetchAll } = useCrudApi("/api/address");
  const { selectedCountry } = usePreferences();

  useEffect(() => {
    fetchAll()
      .then((res) => setFetchAddressesData(res.data || []))
      .catch((err) => console.error("Error fetching addresses", err));
  }, [fetchAll]);

  const { create: updateQuantities } = useCrudApi(
    "/api/cart/update-quantities"
  );

  // Contact info
  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [address, setAddress] = useState({
    street: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    billingStreetAddress: "",
    billingCountry: "",
    billingCity: "",
    billingState: "",
    billingZipcode: "",
    addressType: "",
  });

  useEffect(() => {
    if (customer) {
      setContactInfo({
        firstName: customer.first_name || "",
        lastName: customer.last_name || "",
        phone: customer.phone_number || "",
        email: customer.email || "",
      });

      setAddress((prev) => ({
        ...prev,
        street: customer.street_address || "",
        city: customer.city || "",
        state: customer.state || "",
        zipCode: customer.zip_code || "",
      }));
    }
  }, [customer]);

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();

  const { cartItems, summary, loading, error, shipping, coupon } = useSelector(
    (state) => state.cart
  );
  const shippingCharge = useSelector((state) => state.cart.shipping);
  const { create } = useCrudApi(`/api/cart/place-order`);
  const { create: removeCouponApi } = useCrudApi(`/api/cart/remove-coupon`);

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
  };

  const handlePlaceOrder = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setPlacingOrder(true); // start loading

    try {
      const payload = {
        first_name: contactInfo.firstName,
        last_name: contactInfo.lastName,
        phone_number: contactInfo.phone,
        email: contactInfo.email,
        street_address: address.street,
        city: address.city,
        state: address.state,
        zip_code: address.zipCode,
        payment_method: selectedPayment,
        use_different_billing: isDifferentBilling,
        shipping_charge: shippingCharge,
        card_number: paymentDetails.cardNumber.replace(/\s/g, ""),
        expiry_date: paymentDetails.expiryDate,
        cvv: paymentDetails.cvv,
        ...(isDifferentBilling && {
          billing_street_address: address.billingStreetAddress,
          billing_city: address.billingCity,
          billing_state: address.billingState,
          billing_zip_code: address.billingZipcode,
        }),
      };

      const response = await create(payload);
      if (response.status) {
        dispatch(setOrder(response));
        localStorage.setItem("recentOrder", JSON.stringify(response));
        router.push("/cart/order-complete");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Contact Info
    if (!contactInfo.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!contactInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!contactInfo.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(contactInfo.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!contactInfo.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(contactInfo.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Shipping Address
    if (!address.street.trim()) {
      newErrors.street = "Street address is required.";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!address.zipCode.trim()) {
      newErrors.zipCode = "Zip Code is required.";
    }

    // Billing Address
    if (isDifferentBilling) {
      if (!address.billingStreetAddress.trim()) {
        newErrors.billingStreetAddress = "Billing street is required.";
      }

      if (!address.billingCity.trim()) {
        newErrors.billingCity = "Billing city is required.";
      }

      if (!address.billingState.trim()) {
        newErrors.billingState = "Billing state is required.";
      }

      if (!address.billingZipcode.trim()) {
        newErrors.billingZipcode = "Billing zip code is required.";
      }

      if (!address.addressType.trim()) {
        newErrors.addressType = "Address type is required.";
      }
    }

    // Payment
    if (!selectedPayment) {
      newErrors.selectedPayment = "Select a payment method.";
    }

    if (!paymentDetails.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required.";
    }

    if (!paymentDetails.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required.";
    }

    if (!paymentDetails.cvv.trim()) {
      newErrors.cvv = "CVV is required.";
    }

    return newErrors;
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveCoupon = async () => {
    try {
      const res = await removeCouponApi();

      if (res.status) {
        dispatch(clearCoupon());
        dispatch(fetchCart());
        toast.success("Coupon removed successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove coupon");
    }
  };

  const addressOptions = [
    ...fetchAddressesData.map((addr) => ({
      label: addr.address_type,
      value: addr.id, // better to use id instead of type
    })),
    { label: "+ Add New Address", value: "add_new" },
  ];

  const handleAddressSelect = (value) => {
    if (value === "add_new") {
      resetForm();
      setIsModalOpen(true);
    } else {
      const selectedAddr = fetchAddressesData.find(
        (addr) => addr.id === value?.value
      );

      if (selectedAddr) {
        setAddress({
          street: selectedAddr.street_address || "",
          city: selectedAddr.city || "",
          state: selectedAddr.state || "",
          zipCode: selectedAddr.zip_code || "",
          addressType: selectedAddr.address_type || "",
        });
      } else {
        setAddress({
          street: "",
          city: "",
          state: "",
          zipCode: "",
          addressType: "",
        });
      }
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentDetailsChange = (e) => {
    const { name, value } = e.target;

    if (name === "expiryDate") {
      let cleanValue = value.replace(/\D/g, "");

      cleanValue = cleanValue.slice(0, 4);

      if (cleanValue.length >= 3) {
        cleanValue = cleanValue.slice(0, 2) + "/" + cleanValue.slice(2);
      }

      setPaymentDetails((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      if (/^\d*$/.test(value)) {
        setPaymentDetails((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  return (
    <section className="flex lg:flex-row flex-col xl:gap-[64px] lg:gap-[50px]">
      <div className="lg:w-[50%] lg:order-1 order-2 w-full space-y-[24px]">
        {/* Contact Information */}
        <div className="border border-[var(--teal-3)] py-[40px] px-[24px]">
          <div className="space-y-[24px]">
            <Typography variant="h4" className="font-[500]">
              Contact Information
            </Typography>
            <div className="flex gap-[24px]">
              <div className="w-full">
                <Input
                  label="First Name"
                  placeholder="First Name"
                  borderBottom
                  containerClass="w-full"
                  name="firstName"
                  value={contactInfo.firstName}
                  onChange={handleContactChange}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  label="Last Name"
                  placeholder="Last Name"
                  borderBottom
                  containerClass="w-full"
                  name="lastName"
                  value={contactInfo.lastName}
                  onChange={handleContactChange}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>
            <Input
              label="Phone Number"
              placeholder="Phone Number"
              borderBottom
              type="tel"
              pattern="[0-9]{10}"
              name="phone"
              value={contactInfo.phone}
              onChange={handleContactChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
            <Input
              label="Email address"
              placeholder="Your Email"
              borderBottom
              type="email"
              name="email"
              value={contactInfo.email}
              onChange={handleContactChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="border border-[var(--teal-3)] py-[40px] px-[24px]">
          <div className="space-y-[24px]">
            <Typography variant="h4" className="font-[500]">
              Shipping Address
            </Typography>
            <div className="flex flex-col gap-1 w-full">
              <span>Address Type</span>
              <Dropdown
                placeholder="Select Address Type"
                borderBottom
                options={addressOptions.map((addr) => ({
                  label: addr.label,
                  value: addr.value,
                }))}
                fullWidth
                customWidth={"w-full"}
                containerClass="flex-col"
                name="addressType"
                value={address.addressType}
                onChange={handleAddressSelect}
              />
            </div>
            {errors.addressType && (
              <p className="text-red-500 text-sm mt-1">{errors.addressType}</p>
            )}{" "}
            <Input
              label="Street Address *"
              placeholder="Street Address"
              borderBottom
              name="street"
              value={address.street}
              onChange={handleAddressChange}
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">{errors.street}</p>
            )}
            {/* <Dropdown
              label="Country *"
              placeholder="Country"
              borderBottom
              options={["india", "us"]}
              fullWidth
              containerClass="flex-col"
              name="country"
              value={address.country}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, country: e.target.value }))
              }
            /> */}
            <Input
              label="Town / City *"
              placeholder="Town / City"
              borderBottom
              name="city"
              value={address.city}
              onChange={handleAddressChange}
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
            <div className="flex gap-[24px]">
              <div className="w-full">
                <Input
                  label="State"
                  placeholder="State"
                  borderBottom
                  containerClass="w-full"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>

              <div className="w-full">
                <Input
                  label="Zip Code"
                  placeholder="Zip Code"
                  borderBottom
                  containerClass="w-full"
                  name="zipCode"
                  value={address.zipCode}
                  onChange={handleAddressChange}
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                )}
              </div>
            </div>
            <Checkbox
              name="default"
              label="Use a different billing address (optional)"
              checked={isDifferentBilling}
              onChange={(e) => setIsDifferentBilling(e.target.checked)}
              inputClass="w-5 h-5"
            />
            {isDifferentBilling && (
              <>
                {" "}
                <Input
                  label="Street Address *"
                  placeholder="Street Address"
                  borderBottom
                  name="billingStreetAddress"
                  value={address.billingStreetAddress}
                  onChange={handleAddressChange}
                />
                {errors.billingStreetAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billingStreetAddress}
                  </p>
                )}
                <Input
                  label="Town / City *"
                  placeholder="Town / City"
                  borderBottom
                  name="billingCity"
                  value={address.billingCity}
                  onChange={handleAddressChange}
                />
                {errors.billingCity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.billingCity}
                  </p>
                )}
                <div className="flex gap-[24px]">
                  <Input
                    label="State"
                    placeholder="State"
                    borderBottom
                    containerClass="w-full"
                    name="billingState"
                    value={address.billingState}
                    onChange={handleAddressChange}
                  />
                  {errors.billingState && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.billingState}
                    </p>
                  )}
                  <Input
                    label="Zip Code"
                    placeholder="Zip Code"
                    borderBottom
                    containerClass="w-full"
                    name="billingZipcode"
                    value={address.billingZipcode}
                    onChange={handleAddressChange}
                  />
                  {errors.billingZipcode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.billingZipcode}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border border-[var(--teal-3)] py-[40px] px-[24px]">
          <div className="space-y-[24px]">
            <Typography variant="h4" className="font-[500]">
              Payment method
            </Typography>
            <div className="space-y-[12px]">
              <RadioButton
                name="payment"
                value="credit-card"
                checked={selectedPayment === "card"}
                onChange={() => handlePaymentChange("card")}
              >
                <div className="flex justify-between w-full">
                  <span>Pay by Card Credit</span>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect
                        x="2"
                        y="4"
                        width="20"
                        height="16"
                        rx="4"
                        stroke="#141718"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="2"
                        cy="2"
                        r="2"
                        transform="matrix(1 0 0 -1 10 14)"
                        stroke="#141718"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="1"
                        cy="1"
                        r="1"
                        transform="matrix(1 0 0 -1 17 13)"
                        fill="#141718"
                      />
                      <circle
                        cx="1"
                        cy="1"
                        r="1"
                        transform="matrix(1 0 0 -1 5 13)"
                        fill="#141718"
                      />
                    </svg>
                  </span>
                </div>
              </RadioButton>

              {/* <RadioButton
                name="payment"
                value="paypal"
                checked={selectedPayment === "paypal"}
                onChange={() => handlePaymentChange("paypal")}
              >
                <div className="flex justify-between w-full">
                  <span>Paypal</span>
                </div>
              </RadioButton> */}

              {/* <RadioButton
                name="payment"
                value="cod"
                checked={selectedPayment === "cod"}
                onChange={() => handlePaymentChange("cod")}
              >
                <div className="flex justify-between w-full">
                  <span>Cash On Delivery</span>
                </div>
              </RadioButton> */}
            </div>

            {/* Add your payment input fields here... */}
            <Input
              label="Card Number"
              placeholder="1234 1234 1234 1234"
              borderBottom
              type="text"
              name="cardNumber"
              value={paymentDetails.cardNumber}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ""); // remove non-digits
                value = value.slice(0, 16); // max 16 digits
                // format into groups of 4
                value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                setPaymentDetails((prev) => ({ ...prev, cardNumber: value }));
              }}
              // errorMessage={errors.cardNumber}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
            )}

            <div className="flex gap-[24px]">
              <div className="w-full">
                <Input
                  label="Expiration date"
                  placeholder="MM/YY"
                  borderBottom
                  type="text"
                  containerClass="w-full"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handlePaymentDetailsChange}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>

              <div className="w-full">
                <Input
                  label="CVV"
                  placeholder="CVV code"
                  borderBottom
                  containerClass="w-full"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handlePaymentDetailsChange}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={3}
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>
            <Button
              title={placingOrder ? "Placing Order..." : "Place Order"}
              className="!w-full"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder && (
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
              )}
              {placingOrder ? "Placing Order..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>

      {/* Order Summary - unchanged */}
      <div className="lg:w-[50%] lg:order-2 order-1 w-full">
        <div className="lg:border-l lg:border-l-[var(--teal-3)] xl:pl-[64px] lg:pl-[24px] space-y-[24px] top-0 sticky">
          <h2 className="font-[500] md:text-[20px] text-[16px]">
            Order summary
          </h2>

          {cartItems.length > 0 &&
            cartItems?.map((items) => (
              <div
                key={items.cart_item_id}
                className="grid 2xl:grid-cols-4 grid-cols-3 gap-[30px] py-[24px] justify-items-center items-center border-b border-b-[var(--teal-3)]"
              >
                {" "}
                <div className="px-[18px] py-[13px] bg-[var(--product-bg)] flex items-center mx-auto">
                  <img src={items.image} className="h-[78px] w-[78px]" />
                </div>
                <div className="flex flex-col w-full items-start gap-[10px] 2xl:col-span-2 md:col-span-1">
                  <Typography variant="h5" className="font-[500]">
                    {toTitleCase(items.title)}
                  </Typography>

                  <QuantitySelector
                    item={items}
                    handleQuantities={async (cart_item_id, newQuantity) => {
                      const payload = {
                        cart_items: [{ cart_item_id, quantity: newQuantity }],
                      };
                      const response = await updateQuantities(payload);
                      if (response.status) {
                        toast.success("Cart updated");
                        dispatch(fetchCart());
                      } else {
                        toast.error(
                          response.message || "Failed to update cart"
                        );
                      }
                    }}
                  />
                </div>
                <Typography variant="p" className="font-[600]">
                  {getCurrencySymbol(selectedCountry?.currency)}{" "}
                  {items.subtotal ?? 0}
                </Typography>
              </div>
            ))}

          {summary?.coupon_code && (
            <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
              <Typography variant="h5" className="flex gap-2">
                <CouponIcon className="w-5 h-5" />{" "}
                <span>{summary?.coupon_code}</span>
              </Typography>
              <Typography
                variant="h5"
                className="font-[600] text-[var(--teal-1)]"
              >
                - {getCurrencySymbol(selectedCountry?.currency)}
                {summary?.discount}{" "}
                <span className="cursor-pointer" onClick={handleRemoveCoupon}>
                  [Remove]
                </span>
              </Typography>
            </div>
          )}
          <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
            <Typography variant="h5" className="flex gap-2">
              Shipping
            </Typography>
            <Typography variant="h5" className="font-[600]">
              {getCurrencySymbol(selectedCountry?.currency)}
              {shipping ?? shipping}
            </Typography>
          </div>
          <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
            <Typography variant="h5" className="flex gap-2">
              Subtotal
            </Typography>
            <Typography variant="h5" className="font-[600]">
              {getCurrencySymbol(selectedCountry?.currency)}
              {summary?.cart_total && summary?.cart_total}
            </Typography>
          </div>
          <div className="flex justify-between w-full border-b border-b-[var(--teal-3)] py-[13px]">
            <Typography variant="h4" className="flex gap-2 font-[500]">
              Total
            </Typography>
            <Typography variant="h4" className="font-[600]">
              {getCurrencySymbol(selectedCountry?.currency)}
              {summary?.grand_total}
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CheckOutDetails;
