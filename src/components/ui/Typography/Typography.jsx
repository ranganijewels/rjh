import React from "react";
import clsx from "clsx";
import { typographyStyles } from "./typography.config";

const Typography = ({
  variant = "p",
  as,
  className = "",
  children,
  dangerouslySetInnerHTML,
  textColor = "grey",
  onClick,
}) => {
  const safeVariant = variant || "p";
  const defaultTag = safeVariant?.split("_")[0] || "p";
  const Tag = as || defaultTag || "p";

  const styles =
    typographyStyles[safeVariant] ||
    typographyStyles[defaultTag] ||
    typographyStyles["p"];
  const colorClass = typographyStyles.colors?.[textColor] || "";

  return (
    <Tag
      className={clsx(
        styles.base,
        styles.sm,
        styles.md,
        styles.lg,
        colorClass,
        className
      )}
      onClick={onClick}
      {...(dangerouslySetInnerHTML
        ? { dangerouslySetInnerHTML }
        : { children })}
    />
  );
};

export default Typography;
