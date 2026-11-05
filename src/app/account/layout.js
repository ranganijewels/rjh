import AccountShell from "@/commomPages/Account/AccountShell";

// Private pages: keep them out of search results.
export const metadata = {
  title: "My account", // the root layout adds "| Rangani Jewelry House"
  robots: { index: false, follow: false },
};

export default function AccountLayout({ children }) {
  return <AccountShell>{children}</AccountShell>;
}
