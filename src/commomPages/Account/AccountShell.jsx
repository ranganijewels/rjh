"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ACCOUNT_MENUS } from "@/commomPages/Account/constant";
import LogoutConfirmationModal from "@/components/ui/Modal/LogoutConfirmationModal";
import { toTitleCase } from "@/utils/string";

/**
 * The account area's frame: a short greeting (no banner), a slim menu on the
 * left on desktop and a swipeable tab row above the content on phones.
 */
const AccountShell = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const customer = useSelector((state) => state.auth.customer);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;
    if (!localStorage.getItem("authTokenRJHouse")) router.push(`/login?redirect=${pathname}`);
  }, [isMounted, router, pathname]);

  if (!isMounted) return null;

  const isActive = (path) => (path === "/account" ? pathname === "/account" : pathname.startsWith(path));
  const firstName = toTitleCase(customer?.first_name || "");

  const item = ({ label, path, action }) => {
    const active = !action && isActive(path);
    const cls = `whitespace-nowrap text-[14px] lg:text-[15px] px-[14px] py-[10px] lg:px-[14px] lg:py-[10px] border-b-2 lg:border-b-0 lg:border-l-2 transition-colors ${
      active
        ? "border-[var(--color-primary)] text-[var(--color-primary)] font-[600] lg:bg-[var(--surface-band)]"
        : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
    }`;
    return action === "logout" ? (
      <button key={label} type="button" onClick={() => setShowLogoutModal(true)} className={`${cls} text-left lg:mt-[12px]`}>
        {label}
      </button>
    ) : (
      <Link key={path} href={path} className={cls} aria-current={active ? "page" : undefined}>
        {label}
      </Link>
    );
  };

  return (
    <section className="w-full bg-white">
      <div className="2xl:px-[120px] xl:px-[80px] lg:px-[40px] px-[16px] lg:py-[40px] py-[24px]">
        <div className="mb-[20px] lg:mb-[32px]">
          <p className="text-[13px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]">My account</p>
          <p className="font-heading text-[24px] lg:text-[30px] text-[var(--color-text)]">
            {firstName ? `Hi, ${firstName}` : "Welcome back"}
          </p>
          {customer?.email && <p className="text-[13px] text-[var(--color-text-muted)]">{customer.email}</p>}
        </div>

        <div className="flex lg:flex-row flex-col gap-[20px] lg:gap-[48px]">
          <nav
            aria-label="Account"
            className="lg:w-[220px] shrink-0 lg:sticky lg:top-[120px] self-start w-full flex lg:flex-col overflow-x-auto hide-scrollbar overflow-y-hidden! border-b lg:border-b-0 border-[var(--border-subtle)]"
          >
            {ACCOUNT_MENUS.map(item)}
          </nav>
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      {showLogoutModal && <LogoutConfirmationModal onClose={() => setShowLogoutModal(false)} />}
    </section>
  );
};

export default AccountShell;
