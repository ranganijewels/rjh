export const ACCOUNT_MENUS = [
  { label: "Overview", path: "/account" },
  { label: "Orders", path: "/account/orders" },
  { label: "Wishlist", path: "/account/wishlist" },
  { label: "Addresses", path: "/account/addresses" },
  { label: "Profile Info", path: "/account/profile-info" },
  { label: "Size Profile", path: "/account/size-profile" },
  { label: "Support", path: "/account/support" },
  { label: "Logout", path: "/login",action: "logout" },
];

export const OVERVIEW_DETAILS = [
  {
    icon: "/icons/orders.svg",
    title: "Orders",
    subTitle: "Check your order status",
    path: "/account/orders",
  },
  {
    icon: "/icons/wishlist.svg",
    title: "Wishlist",
    subTitle: "Check your wishlist",
    path: "/account/wishlist",
  },
  {
    icon: "/icons/address.svg",
    title: "Address",
    subTitle: "Your saved addresses",
    path: "/account/addresses",
  },
  {
    icon: "/icons/profile-info.svg",
    title: "Profile Info",
    subTitle: "Check your Profile info",
    path: "/account/profile-info",
  },
  {
    icon: "/icons/ring-size-profile.svg",
    title: "Size Profile",
    subTitle: "Manage ring size profile",
    path: "/account/size-profile",
  },
  {
    icon: "/icons/support.svg",
    title: "Support",
    subTitle: "Support",
    path: "/account/support",
  },
];

export const ORDER_DATA = [
  {
    orderNumber: "EL1241235262",
    datePlaced: "March 15, 2025",
    totalAmount: "$ 1,223.78",
    imageUrl: "/images/products/ring-product-1.png",
    product: {
      title: "Princess Cut Engagement Ring",
      description:
        "A stunning princess cut engagement ring featuring a brilliant square diamond",
      details: {
        shape: "Princess Cut",
        carat: "2 ctw",
        metal: "18K Yellow Gold",
        size: "8",
        quantity: "1",
      },
    },
    deliveryDate: "May 15, 2025",
  },
  {
    orderNumber: "EL1241235262",
    datePlaced: "March 15, 2025",
    totalAmount: "$ 1,223.78",
    imageUrl: "/images/products/ring-product-1.png",
    product: {
      title: "Princess Cut Engagement Ring",
      description:
        "A stunning princess cut engagement ring featuring a brilliant square diamond",
      details: {
        shape: "Princess Cut",
        carat: "2 ctw",
        metal: "18K Yellow Gold",
        size: "8",
        quantity: "1",
      },
    },
    deliveryDate: "May 15, 2025",
  },
];

export const ADDRESS_LIST = [
  {
    id: 1,
    name: "Alex Johnson",
    label: "Home",
    address: "123 Maple Street, Toronto, ON, Canada",
    phone: "(416) 555-0199",
    isDefault: true,
  },
  {
    id: 2,
    name: "Jordan Smith",
    label: "Main Residence",
    address: "456 Elm Street, Vancouver, BC, Canada",
    phone: "(416) 555-0199",
  },
  {
    id: 3,
    name: "Sarah Thompson",
    label: "Work",
    address: "456 Oak Avenue, Vancouver, BC, Canada",
    phone: "(604) 555-0123",
  },
  {
    id: 4,
    name: "Michael Lee",
    label: "School",
    address: "789 Pine Road, Montreal, QC, Canada",
    phone: "(514) 555-0456",
  },
  {
    id: 5,
    name: "Emily Davis",
    label: "Gym",
    address: "321 Cedar Lane, Calgary, AB, Canada",
    phone: "(403) 555-0789",
  },
];
