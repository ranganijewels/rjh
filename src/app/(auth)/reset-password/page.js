import ResetPasswordForm from "@/commomPages/Login/ResetPasswordForm";
import React from "react";

// The emailed token sits in the query string, so keep it out of search
// indexes and out of the Referer header sent to other sites.
export const metadata = {
  title: "Reset password",
  robots: { index: false },
  referrer: "no-referrer",
};

const page = () => {
  return <ResetPasswordForm />;
};

export default page;
