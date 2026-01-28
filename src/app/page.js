"use client";
import HomepageLayout from "@/commomPages/Home";
import { useEffect } from "react";

export default function Home() {
  // useEffect(() => {
  //   const handleContextMenu = (e) => {
  //     e.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", handleContextMenu);

  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);
  return <HomepageLayout />;
}
