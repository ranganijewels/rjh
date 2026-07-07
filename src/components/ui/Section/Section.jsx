import React from "react";

const Section = ({ children, className = ""}) => {
  return (
    <section
      className={`p-[0px_30px] ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;
