"use client";
import React, { useEffect, useState } from "react";
import Typography from "@/components/ui/Typography/Typography";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ACCOUNT_MENUS } from "@/commomPages/Account/constant";
import PageHeading from "@/components/ui/Heading/PageHeading";
import LogoutConfirmationModal from "@/components/ui/Modal/LogoutConfirmationModal";

const AccountLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // useEffect(() => {
  //   const disableRightClick = (e) => {
  //     e.preventDefault();
  //   };

  //   document.addEventListener("contextmenu", disableRightClick);

  //   return () => {
  //     document.removeEventListener("contextmenu", disableRightClick);
  //   };
  // }, []);

  useEffect(() => {
    if (!isMounted) return;

    const token = localStorage.getItem("authTokenElova");
    if (!token) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isMounted, router, pathname]);

  if (!isMounted) return null;

  return (
    <section>
      <PageHeading title={"  My Account"} />
      <div className="2xl:py-[100px] gap-[40px] lg:py-[54px] py-[40px] 2xl:px-[210px] xl:px-[100px] lg:px-[81px] px-[18px] flex lg:flex-row flex-col-reverse">
        <aside className="flex flex-col xl:gap-[40px] md:gap-[30px] gap-[20px] lg:w-[20%] w-full lg:sticky top-[120px] self-start">
          {ACCOUNT_MENUS.map(({ label, path, action }) =>
            action === "logout" ? (
              <Typography
                key={label}
                variant="p"
                onClick={() => setShowLogoutModal(true)}
                className={`cursor-pointer hover:text-[var(--teal-1)] ${
                  pathname === path ? "text-[var(--teal-1)] font-semibold" : ""
                }`}
              >
                {label}
              </Typography>
            ) : (
              <Link key={path} href={path}>
                <Typography
                  variant="p"
                  className={`cursor-pointer hover:text-[var(--teal-1)] ${
                    pathname === path
                      ? "text-[var(--teal-1)] font-semibold"
                      : ""
                  }`}
                >
                  {label}
                </Typography>
              </Link>
            )
          )}
        </aside>

        <main className="w-full">{children}</main>
      </div>
      {showLogoutModal && (
        <LogoutConfirmationModal onClose={() => setShowLogoutModal(false)} />
      )}
    </section>
  );
};

export default AccountLayout;
