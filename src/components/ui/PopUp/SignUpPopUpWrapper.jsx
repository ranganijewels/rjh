import React, { useEffect, useState } from "react";
import SignUpPopUp from "./SignUpPopUp";

const SCROLL_TRIGGER = 600; // px

const SignUpPopUpWrapper = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show if not already closed
    const alreadyClosed = localStorage.getItem("signUpPopUpClosed");
    if (alreadyClosed) return;

    const handleScroll = () => {
      if (window.scrollY > SCROLL_TRIGGER) {
        setShow(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("signUpPopUpClosed", "true");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <SignUpPopUp onClose={handleClose} />
    </div>
  );
};

export default SignUpPopUpWrapper;