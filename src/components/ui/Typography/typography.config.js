// T-shirt scale reference (px), used consistently across variants below:
// xs=12, sm=14, md=16, lg=20, xl=24, 2xl=28, 3xl=32, 4xl=38, 5xl=40, 6xl=60
// Font weights use the shared scale: regular=400, medium=500, semibold=600.
//
// Single source of truth for the scale — variants below reference these
// instead of repeating raw arbitrary values.
export const fontSize = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  "2xl": "28px",
  "3xl": "32px",
  "4xl": "38px",
  "5xl": "40px",
  "6xl": "60px",
};

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
};

export const typographyStyles = {
  h1: {
    base: `xl:text-[${fontSize["6xl"]}] xl:font-[${fontWeight.semibold}] xl:leading-tight`,
    lg: `lg:text-[${fontSize["5xl"]}] lg:font-[${fontWeight.semibold}] lg:leading-tight`,
    md: `md:text-[${fontSize["4xl"]}] md:font-[${fontWeight.semibold}] md:leading-tight`,
    sm: `text-[${fontSize.lg}] font-[${fontWeight.medium}] leading-tight`,
  },
  h2: {
    base: `xl:text-[${fontSize["4xl"]}] xl:font-[${fontWeight.regular}] font-source-serif`,
    lg: `lg:text-[${fontSize["3xl"]}] lg:font-[${fontWeight.regular}] font-source-serif`,
    md: `md:text-[${fontSize["2xl"]}] md:font-[${fontWeight.regular}] font-source-serif`,
    sm: `text-[${fontSize.lg}] font-[${fontWeight.regular}] font-source-serif`,
  },
  h3: {
    base: `xl:text-[${fontSize["2xl"]}] xl:font-[${fontWeight.medium}]`,
    lg: `lg:text-[${fontSize.xl}] lg:font-[${fontWeight.medium}]`,
    md: `md:text-[${fontSize.lg}] md:font-[${fontWeight.medium}]`,
    sm: `text-[${fontSize.md}] font-[${fontWeight.medium}]`,
  },
  h4: {
    base: `xl:text-[${fontSize.lg}] xl:font-[${fontWeight.regular}]`,
    lg: `lg:text-[${fontSize.md}] lg:font-[${fontWeight.regular}]`,
    md: `md:text-[${fontSize.md}] md:font-[${fontWeight.regular}]`,
    sm: `text-[${fontSize.sm}] font-[${fontWeight.regular}]`,
  },
  h5: {
    base: `xl:text-[${fontSize.md}] xl:font-[${fontWeight.regular}]`,
    lg: `lg:text-[${fontSize.md}] lg:font-[${fontWeight.regular}]`,
    md: `md:text-[${fontSize.sm}] md:font-[${fontWeight.regular}]`,
    sm: `text-[${fontSize.xs}] font-[${fontWeight.regular}]`,
  },
  h6: {
    base: `xl:text-[${fontSize.sm}] xl:font-[${fontWeight.regular}]`,
    lg: `lg:text-[${fontSize.sm}] lg:font-[${fontWeight.regular}]`,
    md: `md:text-[${fontSize.xs}] md:font-[${fontWeight.regular}]`,
    sm: `text-[${fontSize.xs}] font-[${fontWeight.regular}]`,
  },
  p: {
    base: `xl:text-[${fontSize.lg}] xl:font-[${fontWeight.regular}]`,
    lg: `lg:text-[${fontSize.md}] lg:font-[${fontWeight.regular}]`,
    md: `md:text-[${fontSize.xs}] md:font-[${fontWeight.regular}] md:leading-[1.1]`,
    sm: `text-[${fontSize.xs}] font-[${fontWeight.regular}] leading-[1.1]`,
  },
  label: {
    base: `xl:text-[${fontSize["3xl"]}] xl:font-[${fontWeight.medium}] xl:leading-[1.1]`,
    lg: `lg:text-[${fontSize["3xl"]}] lg:font-[${fontWeight.medium}] lg:leading-[1.1]`,
    md: `md:text-[${fontSize["2xl"]}] md:font-[${fontWeight.medium}] md:leading-[1.1]`,
    sm: `text-[${fontSize.xl}] font-[${fontWeight.medium}] leading-[1.1]`,
  },
  colors: {
    grey: "text-[var(--grey-2)]",
    grey1: "text-[var(--grey-1)]",
    white: "text-[var(--grey-00)]",
    teal: "text-[var(--teal-1)]",
    customGrey: "text-[var(--placeholder)]",
    placeholder: "text-[var(--placeholder)]",
  },
};
