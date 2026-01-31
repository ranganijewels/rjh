import clsx from "clsx";

export const RoundShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="84"
      height="84"
      viewBox="0 0 84 84"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M81.8364 42.4803C81.8364 64.2407 64.1958 81.8825 42.4342 81.8825C20.6738 81.8825 3.0332 64.2407 3.0332 42.4803C3.0332 20.7198 20.6738 3.07812 42.4342 3.07812C64.1958 3.07812 81.8364 20.7198 81.8364 42.4803Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.5234 63.7477H64.3519V21.1992H20.5234V63.7477Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M72.9747 42.0323L41.9823 73.0247L11.8965 42.9377L42.8877 11.9453L72.9747 42.0323Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M42.8878 3.07812V11.9412L25.8624 6.73088L20.5203 21.2055L14.0947 15.1187"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M42.8887 11.9447L57.9761 6.26953L64.3508 21.2101L70.951 15.3072"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M20.5211 21.1992L5.36084 29.1072L11.8963 42.9261H3.0332"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M64.3486 21.1992L79.4684 28.9973L72.9735 42.0208H81.8366"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M72.9735 42.0273L78.3815 58.6318L64.3486 63.7554L69.7474 70.8759"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M11.896 42.9336L5.83008 57.0879L20.5209 63.7551L14.7209 70.486"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M20.5215 63.75L27.886 79.0999L41.9836 73.0143V81.8774"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M41.9824 73.0143L57.9752 78.6929L64.3499 63.75"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PrincessShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="78"
      height="81"
      viewBox="0 0 78 81"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <g clipPath="url(#clip0_1424_6795)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.43457 80.5893H77.5126V2.11328H0.43457V80.5893Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.7832 66.9933H64.1635V15.6992H13.7832V66.9933Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M77.5126 80.5893L38.973 66.9983L0.43457 80.5893L13.7834 41.3519L0.43457 2.11328L38.973 15.7043L77.5126 2.11328L64.1638 41.3519L77.5126 80.5893Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M74.3329 11.4625C70.8782 12.8765 67.4223 14.2894 63.9676 15.7035L66.1713 6.04297H11.3811L13.5861 15.7035C10.2892 14.3656 6.98998 13.0265 3.69309 11.6886C3.60073 31.7358 3.50838 51.7819 3.41602 71.8291L13.7848 66.9988C13.1827 70.1722 12.5818 73.3456 11.9786 76.5189C30.1091 76.5654 48.2396 76.6118 66.3689 76.6594L64.1652 66.9988L74.1376 70.6638C74.2031 50.9296 74.2674 31.1966 74.3329 11.4625Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1424_6795">
          <rect width="78" height="81" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const OvalShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="59"
      height="84"
      viewBox="0 0 59 84"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <g clipPath="url(#clip0_1424_6809)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M56.0651 42.9107C56.0651 64.91 44.075 82.7433 29.2861 82.7433C14.496 82.7433 2.50586 64.91 2.50586 42.9107C2.50586 20.9114 14.496 3.07812 29.2861 3.07812C44.075 3.07812 56.0651 20.9114 56.0651 42.9107Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M29.2875 3.07812L38.8639 13.7493L29.2875 20.4591L19.1426 12.559L29.2875 3.07812Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M15.1553 9.07031L19.1413 12.5579L8.69956 17.4358V30.0817H3.93164"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M43.4114 9.07031L38.8652 13.7482L49.8732 17.4358V30.0817H54.6411"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M19.1424 12.5547L15.458 41.4447L18.2759 57.4592L37.996 70.2919L29.2874 82.739L19.1424 70.2919L38.8637 57.4592L42.1131 41.4447L38.8637 13.745"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8.70134 30.0859L15.4587 41.4522L9.82419 52.2733L2.50781 42.9139L8.70134 30.0859Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M49.8719 30.0859L56.038 41.1796L48.3986 52.2733L42.1133 41.4522L49.8719 30.0859Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M49.8722 30.0741L40.5569 28.1624L29.2867 20.4492L17.1523 28.1624L8.70117 30.0741"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M14.6358 76.2499L19.1439 70.2995L18.2785 57.4668L9.82617 52.2734"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M42.981 76.2499L37.9961 70.2995L38.8639 57.4668L48.3985 52.2734"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M19.1433 70.3007H9.82563V52.2734H3.25781"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M37.998 70.3007L48.4005 70.8066V52.2734H55.3175"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1424_6809">
          <rect
            width="58.1765"
            height="83.4706"
            fill="white"
            transform="translate(0.333984)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const RadiantShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="84"
      viewBox="0 0 64 84"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.4878 2.41016L1.94531 10.9766V72.5064L11.8369 81.1853H51.6307L60.6233 72.5064V12.3828L51.8545 2.41016H10.4878Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M10.4878 2.41016L18.1324 17.0315L1.94531 10.9766"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M51.8549 2.41016L44.4365 16.0276L60.6236 12.3828"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M11.8369 81.1881L19.2565 66.5039L1.94531 72.5093"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.8633 66.5039L60.6233 72.5105L51.6308 81.1881L42.8633 66.5039Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M52.5311 69.7674V14.2031L44.4375 16.0261L52.489 69.9933"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M8.71484 70.1561L15.0994 74.7251H47.7717L52.5289 70.1561V69.7695"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M47.7717 74.7214L19.2544 66.4956L8.71484 13.5045V70.1524L18.1303 17.026L48.6286 8.32422"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M15.0994 74.7214L42.8611 66.4956L52.5289 14.2003L48.6286 8.32422H13.5809L8.71484 13.5045"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M13.582 8.32422L44.4352 16.0233"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const PearShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="59"
      height="82"
      viewBox="0 0 59 82"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <g clipPath="url(#clip0_1424_6852)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M55.3714 41.4373C56.2476 47.8692 57.8505 59.6303 50.383 69.626C48.2014 72.5469 40.9217 81.1032 29.4422 81.0868C17.594 81.0692 10.2303 71.931 8.08136 68.8975C1.08397 59.0145 2.63208 47.8164 3.51404 41.4373C5.67462 25.8122 29.4422 1.78906 29.4422 1.78906C29.4422 1.78906 53.2295 25.7172 55.3714 41.4373Z"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M44.6186 46.4545L48.3786 57.52L20.0986 71.4372L29.4397 81.0833L38.0564 71.6225L10.7656 57.52L14.8056 45.4609"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M16.4436 77.0455L20.101 71.4418L8.08246 68.8986L10.7692 57.5234L3.62598 58.9299"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M43.1635 76.6209L38.0596 71.626L50.9635 68.82L48.3818 57.5234L55.4515 58.1217"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M10.7685 57.5277L2.72461 48.7121C6.82644 44.068 10.9271 39.4227 15.0278 34.7773"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M48.3801 57.5277L56.1475 49.2811C52.0293 44.4469 47.9111 39.6127 43.793 34.7773"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M29.5742 11.9141C34.313 14.1839 39.053 16.455 43.793 18.7249V34.7688H53.4573"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M20.1004 71.4363L20.448 62.5211L14.8086 45.4601L15.0268 34.7688V18.7249C19.8764 16.455 24.7249 14.1839 29.5745 11.9141"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M5.44141 34.7798H15.0264L24.1843 24.5977"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M29.4437 1.78906L29.5755 11.9196L23.7949 7.9183"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M15.0283 46.1224L29.5761 11.9136L35.6075 8.47656"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M44.6201 46.4537L29.5742 11.9141"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
        <path
          d="M35.0957 24.5977L43.7952 34.7798L44.6223 46.4647L38.0589 62.6095V71.6327"
          strokeWidth="1.26471"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1424_6852">
          <rect
            width="58.1765"
            height="80.9412"
            fill="white"
            transform="translate(0.333008 0.582031)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export const EmeraldShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="86"
      viewBox="0 0 64 86"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M50.4506 82.3515H11.7022L1.94531 73.2521V12.335L11.2736 2.40625H51.5209L61.2401 12.6048V73.2521L50.4506 82.3515Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M46.6078 76.1668C36.2916 76.2126 25.9754 76.2583 15.6592 76.3041C12.9521 73.8113 10.245 71.3186 7.53676 68.8258C7.50732 51.4082 7.47788 33.9906 7.44727 16.5742C10.0814 13.882 12.7143 11.191 15.3484 8.5C26.0555 8.52346 36.7638 8.5481 47.4721 8.57156C50.1286 11.3904 52.7862 14.2081 55.4427 17.0258C55.4592 34.2522 55.4733 51.4786 55.4886 68.7038L46.6078 76.1668Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M44.3983 72.3539H18.0856L11.4609 65.5314V19.8583C13.5722 17.3773 15.6835 14.8951 17.7948 12.4141H45.1248L51.7248 20.0601V65.5314L44.3983 72.3539Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.2794 67.572H21.3748L16.3633 61.8346V23.4274L21.1558 17.168H41.8293L46.822 23.5987V61.8346L41.2794 67.572Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M41.8281 17.1763L51.5191 2.40625"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M46.8223 23.6076L61.2409 12.6055"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M11.2725 2.40625L21.1541 17.1763"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M1.94531 12.3359L16.364 23.4366"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M1.94531 73.2557L16.364 61.8477"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M21.3754 67.5781L11.7021 82.3481"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M41.2803 67.5781L50.4519 82.3481"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M46.8223 61.8477L61.2409 73.2557"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MarquiesShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="86"
      viewBox="0 0 44 86"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42.3437 42.4536C42.3437 64.5714 22.6171 82.501 22.6171 82.501C22.6171 82.501 2.89062 64.5714 2.89062 42.4536C2.89062 20.3359 22.6171 2.40625 22.6171 2.40625C22.6171 2.40625 42.3437 20.3359 42.3437 42.4536Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M15.8267 74.9603L42.3441 41.0784L18.2422 15.7461L12.1357 52.9455"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M26.078 71.0544L2.89062 40.9385L27.0724 15.7461L33.2389 52.9906L35.8753 65.2474L26.219 71.2371"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M29.0847 74.9763L26.0771 71.0703"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M10.9617 32.5391L17.8186 60.3354L18.8847 71.0636L10.4622 67.1749L12.1354 52.9547L4.7998 54.651"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M18.8849 71.0629L22.6186 82.501L26.2193 71.2456L27.2808 60.3347L34.7644 33.1211L36.3092 20.4492L27.0727 15.7546L22.6186 2.40625L18.2432 15.7546L8.92684 20.4492L10.9619 32.5383L4.69824 30.59"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M33.2383 53L40.6826 53.8025"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M34.7637 33.1231L40.6828 31.0938"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HeartShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="68"
      height="75"
      viewBox="0 0 75 75"
      fill="none"
      className={clsx(
        className,
        "fill-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer transition-colors"
      )}
    >
      <g clipPath="url(#clip0_13_67)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M53.3 0C54 0.1 54.6 0.2 55.3 0.3C61.3 1.2 66.4 3.9 70.4 8.4C72.6 10.8 73.4 13.9 74.2 17.1C75.2 21.2 74.8 25.2 73.9 29.2C72.6 34.8 70.2 40.2 67 45C64.2 49.2 61.2 53.3 57.8 57.1C54.7 60.5 51.1 63.4 47.6 66.4C44.4 69.2 41 71.7 37.7 74.4C37.1 74.9 36.8 74.7 36.2 74.4C28.6 69 22 62.4 15.7 55.6C10.9 50.5 7.1 44.7 4 38.5C2.1 34.6 0.7 30.5 0.2 26.1C0.2 25.9 0.1 25.7 0 25.4C0 23.2 0 20.9 0 18.7C0.1 18.5 0.2 18.4 0.2 18.2C0.7 14.2 2.4 10.7 5 7.6C8.4 3.5 12.6 1.1 17.8 0.4C20.6 0 23.3 0.5 25.9 1.3C29.4 2.3 32.6 4 35.5 6.1C37 7.2 37 7.2 38.4 6C42 3.1 46 1 50.7 0.3C51.5 0.2 52.3 0.1 53 0C53.1 0 53.2 0 53.3 0ZM37 14.3C31.7 14.6 26.2 14.8 20.8 15.1C20.4 15.1 19.9 15.7 19.8 16.2C19.5 17.3 19.4 18.4 19.3 19.5C19.2 20.8 18.7 22.3 19.1 23.5C21.2 29.5 23.5 35.5 25.8 41.4C26.1 42.1 26.5 42.9 27.1 43.4C30.2 45.7 33.3 48 36.5 50.2C36.8 50.4 37.6 50.4 38 50.2C41.1 48.3 44.1 46.3 47.1 44.2C47.5 43.9 47.9 43.5 48.1 43.1C50.2 37.7 52.3 32.3 54.4 26.8C54.8 25.7 55.6 24.4 55.5 23.3C55.3 20.7 54.6 18.2 54 15.7C53.9 15.4 53.4 15 53.1 15C47.7 14.9 42.4 14.6 37 14.3ZM61.4 34.6C65.3 31.1 68.9 27.7 72.6 24.4C73.2 23.8 72.8 23.4 72.4 23C70.8 21.4 69.1 19.8 67.5 18.3C66.2 17 64.8 15.7 63.5 14.5C63.3 14.6 63.2 14.6 63.2 14.7C61.2 17.6 59.2 20.5 57.2 23.5C57 23.7 57 24.2 57.1 24.5C58.3 27.5 59.5 30.6 60.8 33.6C60.9 33.8 61.1 34.1 61.4 34.6ZM59.9 37.4C59.7 37.5 59.4 37.5 59.2 37.7C56.6 39.4 54 41 51.5 42.7C50.4 43.5 48.9 44 48.4 45.5C47.5 48.5 46.6 51.5 45.7 54.6C45.5 55.4 45.7 55.7 46.6 55.5C50.5 54.6 54.5 53.8 58.4 53C59.2 52.8 59.5 52.5 59.5 51.6C59.6 49.2 59.8 46.8 59.8 44.4C60 42.2 59.9 39.8 59.9 37.4ZM14.9 49.4C14.9 50.1 15 50.8 14.9 51.6C14.8 52.6 15.2 53 16.3 53.1C19.8 53.6 23.4 54.2 26.9 54.8C27.2 54.9 27.6 54.8 27.9 54.8C27.9 54.4 28 54 27.9 53.7C27.3 51.2 26.5 48.6 25.9 46.1C25.5 44.6 24.8 43.4 23.4 42.5C20.7 40.9 18.2 39.1 15.6 37.4C15.2 37.2 14.8 37 14.4 36.8C14.3 37.3 14.2 37.7 14.2 38.1C14.4 41.9 14.7 45.7 14.9 49.4ZM17.3 23.2C17.1 22.8 16.9 22.4 16.6 22C15 19.9 13.4 17.7 11.8 15.6C11.3 15 11 14.8 10.3 15.5C7.7 18.2 5.1 20.8 2.5 23.4C1.5 24.4 1.5 24.6 2.6 25.4C5.8 28 8.9 30.6 12.1 33.3C12.8 33.9 13.2 33.9 13.5 33C14.6 30.1 15.8 27.1 16.9 24.2C17 23.9 17.1 23.6 17.3 23.2ZM37.2 72C37.7 70.8 38.2 69.9 38.6 68.9C40.2 65.2 41.7 61.6 43.3 57.9C43.7 56.9 43.5 56.5 42.7 56.1C41 55 39.4 53.8 37.7 52.8C37.3 52.5 36.5 52.5 36.1 52.7C34.8 53.3 33.5 54.1 32.2 54.8C29.9 56.1 29.9 56.1 31 58.5C31.1 58.6 31.1 58.7 31.1 58.8C32.9 62.9 34.6 67 36.4 71.1C36.6 71.4 36.8 71.6 37.2 72ZM18.6 13.9C18.8 13.7 19.2 13.3 19.5 12.9C20.2 11.4 20.8 9.7 21.6 8.2C22 7.4 21.8 7 21.1 6.6C19.1 5.6 17.2 4.7 15.2 3.6C14.3 3.1 14 3.4 13.8 4.3C13.2 7 12.7 9.7 12.1 12.4C12 13 12.2 13.3 12.8 13.4C14.6 13.4 16.4 13.6 18.6 13.9ZM62.4 12.3C62 11.2 61.7 10.3 61.5 9.3C61 7.5 60.5 5.6 59.9 3.8C59.8 3.6 59.2 3.2 59 3.3C57.1 4.2 55.2 5.2 53.4 6.2C53.1 6.4 52.8 7 52.9 7.4C53.4 9.3 54 11.1 54.6 13C54.7 13.4 55.2 13.9 55.5 13.8C57.5 13.6 59.5 13.3 61.5 12.9C61.9 12.9 62.1 12.5 62.4 12.3ZM56.4 26C56.3 26 56.1 26 56 26C53.9 31.4 51.8 36.7 49.7 42.2C50.1 42.1 50.3 42.1 50.4 42C53.5 40 56.5 38 59.6 35.9C59.9 35.7 60.1 35 59.9 34.6C59.5 33.4 59 32.3 58.5 31.2C57.8 29.5 57.1 27.8 56.4 26ZM23.9 41.5C24 41.4 24.2 41.4 24.3 41.3C22.3 36 20.3 30.7 18.2 25.3C18.1 25.3 17.9 25.3 17.8 25.3C17.6 25.8 17.3 26.3 17.1 26.8C16.2 29.1 15.4 31.5 14.4 33.8C14.1 34.6 14.2 35 14.9 35.5C16.9 36.8 18.9 38.2 21 39.6C22 40.2 22.9 40.8 23.9 41.5ZM35 71.9C35.1 71.8 35.2 71.7 35.4 71.6C34.9 70.4 34.3 69.2 33.8 68C32.4 64.7 31.1 61.4 29.7 58.1C29.3 57.2 29 57.1 28.3 58C27.3 59.3 26.3 60.6 25.2 61.8C24.5 62.6 24.7 63 25.4 63.6C27.4 65.4 29.4 67.2 31.4 68.9C32.4 69.9 33.7 70.9 35 71.9ZM62.2 35.5C62.6 35.7 62.8 35.9 63 36C64.6 36.7 66.2 37.3 67.7 38C69.1 38.6 69.2 38.6 69.7 37.2C70.7 34.4 71.6 31.7 72.5 28.8C72.8 27.9 72.8 26.9 72.9 26C72.8 26 72.7 25.9 72.6 25.9C69.3 29.1 65.8 32.3 62.2 35.5ZM37.7 10.1C37.7 10.8 37.7 11.1 37.7 11.5C37.7 12.7 37.9 12.8 38.9 12.2C40.3 11.5 41.7 10.8 43 10.1C45.2 9 47.4 7.9 49.6 6.8C50.2 6.5 50.4 6.1 49.7 5.7C48.6 5 47.5 4.2 46.3 3.6C45.9 3.4 45.1 3.3 44.7 3.5C42.9 4.5 41.2 5.7 39.5 6.8C38.2 7.6 37.2 8.6 37.7 10.1ZM13.4 50.9C13.5 50.8 13.6 50.8 13.8 50.7C13.7 49.9 13.6 49.1 13.6 48.3C13.4 44.7 13.2 41.1 12.9 37.6C12.8 36.4 12.6 36.2 11.5 36.8C10 37.6 8.6 38.4 7.1 39.2C6.4 39.6 6.2 40.1 6.6 40.8C8.1 43.2 9.6 45.7 11.2 48.1C11.9 49 12.6 49.9 13.4 50.9ZM61.3 50.8C61.6 50.5 61.9 50.3 62.2 49.9C64.2 46.9 66.1 43.8 68.1 40.8C68.6 40 68.4 39.6 67.6 39.2C66 38.5 64.4 37.9 62.9 37.1C62 36.7 61.7 36.8 61.6 37.8C61.5 39.1 61.4 40.4 61.4 41.7C61.3 44.8 61.3 47.7 61.3 50.8ZM38.9 71.5C39.4 71.3 39.6 71.3 39.7 71.2C43 68.5 46.3 65.8 49.6 63.1C50.1 62.7 50 62.3 49.5 61.9C48.2 60.7 46.9 59.5 45.6 58.2C45 57.6 44.7 57.9 44.4 58.5C42.9 61.9 41.4 65.4 40 68.8C39.5 69.7 39.3 70.5 38.9 71.5ZM24.1 6.4C24.5 6.7 24.8 6.9 25.1 7.1C28.2 8.6 31.2 10.2 34.3 11.7C36.5 12.8 36.4 12.8 36.6 10.4C36.6 8.8 36 7.7 34.6 7C33.2 6.2 31.9 5.2 30.4 4.5C29.5 4.1 28.2 3.6 27.4 3.9C26.2 4.3 25.3 5.4 24.1 6.4ZM1.8 26.3C1.7 26.3 1.6 26.4 1.5 26.4C1.5 26.8 1.6 27.1 1.6 27.5C1.8 28.3 1.9 29.1 2.2 29.8C3.1 32.4 4.1 35.1 5.2 37.7C5.3 38 6 38.2 6.3 38.1C7.9 37.3 9.5 36.5 11.1 35.6C11.9 35.2 12.1 34.8 11.2 34.1C9 32.3 6.9 30.5 4.7 28.6C3.7 27.9 2.8 27.1 1.8 26.3ZM1.1 22.6C1.6 22.4 1.8 22.4 1.9 22.3C4.5 19.7 7 17.1 9.6 14.4C9.7 14.2 9.6 13.6 9.4 13.4C8.2 12.5 6.9 11.8 5.8 10.9C4.9 10.2 4.3 10.4 3.9 11.4C3.1 13.4 2.2 15.4 1.7 17.5C1.2 19.1 1.2 20.7 1.1 22.6ZM73.2 22.2C73.3 21.6 73.4 21.4 73.4 21.3C73.3 17.5 72.3 14 70.6 10.7C70.2 10 69.7 10 69.1 10.4C67.9 11.2 66.6 12 65.3 12.7C64.4 13.2 64.3 13.6 65.1 14.3C67.2 16.3 69.3 18.4 71.4 20.4C71.9 20.9 72.4 21.5 73.2 22.2ZM40 12.9C40 13 40 13.2 40.1 13.3C40.8 13.3 41.4 13.4 42.1 13.4C45.4 13.6 48.8 13.7 52.1 13.9C53.3 14 53.4 13.8 53.1 12.6C52.7 11.1 52.3 9.7 51.9 8.2C51.7 7.3 51.4 7.1 50.5 7.6C48.8 8.6 47 9.4 45.3 10.3C43.5 11.2 41.7 12 40 12.9ZM34.2 13.1C33.7 12.8 33.6 12.6 33.4 12.5C30.2 11 27 9.4 23.9 7.9C23.3 7.6 23 7.9 22.8 8.4C22.2 9.9 21.5 11.3 20.9 12.8C20.5 13.8 20.6 14 21.7 14C25.5 13.8 29.2 13.7 33 13.5C33.3 13.4 33.6 13.2 34.2 13.1ZM46.2 56.9C46.2 57 46.1 57.1 46.1 57.3C47.5 58.5 48.9 59.7 50.2 61.1C50.9 61.8 51.3 61.7 51.9 61.2C53.8 59.4 55.7 57.6 57.5 55.8C57.8 55.5 58 55.1 58.2 54.8C58.1 54.7 58.1 54.6 58 54.6C54.1 55.3 50.2 56.1 46.2 56.9ZM16.8 54.4C16.8 54.7 16.8 54.8 16.8 54.8C18.8 56.9 20.8 59.1 22.9 61.2C23 61.3 23.6 61.3 23.7 61.2C25.1 59.6 26.4 58 27.9 56.2C24.1 55.6 20.5 55 16.8 54.4ZM38.3 51.5C38.7 51.8 38.9 52 39.2 52.2C40.5 53.1 41.8 54 43.1 55C43.9 55.6 44.2 55.4 44.5 54.5C45.1 52.3 45.9 50.2 46.6 48C46.8 47.4 46.9 46.8 47.1 46.2C47 46.1 46.9 46.1 46.8 46C44 47.8 41.2 49.6 38.3 51.5ZM27.2 45.2C27.1 45.5 27 45.6 27 45.7C27.7 48.4 28.5 51.1 29.3 53.8C29.5 54.6 30.1 54.6 30.7 54.2C31.8 53.6 32.9 52.9 34 52.3C34.5 52 35 51.7 35.8 51.3C32.8 49.2 30 47.3 27.2 45.2ZM61.4 3.4C61.3 3.7 61.2 3.9 61.3 4C62 6.5 62.7 9.1 63.4 11.6C63.5 11.8 64.2 12 64.4 11.9C65.8 11.1 67 10.3 68.4 9.5C69 9 69.1 8.5 68.4 8C66.6 6.7 64.8 5.4 63 4.1C62.6 3.8 62 3.6 61.4 3.4ZM12.6 3.5C12.2 3.5 12 3.5 12 3.5C9.5 4.8 7.5 6.6 5.8 8.7C5.6 8.9 5.9 9.6 6.2 9.8C7.3 10.6 8.5 11.3 9.7 12.1C10.5 12.7 10.8 12.4 11 11.6C11.2 10.7 11.4 9.8 11.5 8.9C11.8 7.2 12.2 5.4 12.6 3.5ZM61.6 14.5C61.5 14.4 61.4 14.3 61.4 14.2C59.6 14.5 57.7 14.7 55.9 15.1C55.7 15.2 55.4 15.9 55.4 16.3C55.6 17.8 55.9 19.2 56.2 20.6C56.3 20.9 56.5 21.2 56.6 21.5C56.9 21.3 57.2 21.1 57.4 20.8C58.6 19.1 59.7 17.4 60.9 15.7C61.2 15.3 61.3 14.9 61.6 14.5ZM13.1 14.6C13 14.7 13 14.8 12.9 14.9C14.4 16.9 15.9 18.9 17.5 21.1C17.7 20.8 17.9 20.7 17.9 20.6C18.2 19 18.5 17.5 18.7 15.9C18.7 15.7 18.3 15.2 18.1 15.2C16.4 14.9 14.7 14.8 13.1 14.6ZM15.8 2.1C15.8 2.2 15.8 2.4 15.8 2.5C17.7 3.4 19.7 4.4 21.9 5.5C21.7 4.2 21.7 3.3 21.5 2.4C21.5 2.1 21.1 1.8 20.9 1.7C19.2 1.5 17.5 1.5 15.8 2.1ZM58 2.4C58 2.3 58 2.1 58 2C56.8 1.8 55.7 1.6 54.5 1.5C53.9 1.5 52.9 1.6 52.8 1.9C52.6 2.7 52.7 3.7 52.7 4.6C52.7 4.7 53.2 4.9 53.4 4.8C54.9 4 56.5 3.2 58 2.4ZM47.5 2.2C47.5 2.3 47.4 2.5 47.4 2.6C48 3 48.6 3.4 49.3 3.8C49.9 4.1 50.5 4.4 51.1 4.7C51.2 3.9 51.4 3.2 51.3 2.4C51.3 2.1 50.7 1.6 50.5 1.7C49.5 1.8 48.5 2 47.5 2.2ZM26.2 3.1C26.2 3 26.1 2.8 26.1 2.7C25.2 2.5 24.4 2.3 23.5 2.1C23.3 2.1 22.9 2.4 22.9 2.6C23 3.5 23.1 4.4 23.3 5.6C24.5 4.5 25.4 3.8 26.2 3.1Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_13_67">
          <rect width="74.7" height="74.7" fill="white" />
        </clipPath>
      </defs>
    </svg>
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="86"
    //   height="84"
    //   viewBox="0 0 86 84"
    //   fill="none"
    //   className={clsx(
    //     className,
    //     "stroke-current text-[var(--grey-2)]",
    //     isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
    //     "hover:text-[var(--teal-1)] cursor-pointer"
    //   )}
    // >
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M42.5262 82.1412C62.3849 57.5017 76.6242 39.877 80.9548 34.659C81.1734 34.3956 81.7859 33.6575 82.3973 32.5653C85.5278 26.9706 84.4727 19.4615 81.8724 14.3838C78.018 6.85623 68.9922 1.24646 59.3139 2.61167C48.2981 4.16574 43.1516 13.8096 42.6571 14.7766C42.2545 13.965 41.6605 12.9128 40.8024 11.7872C36.6428 6.32849 28.3788 2.02674 19.7046 3.52685C19.2837 3.60023 18.866 3.68981 18.4548 3.79341C9.0481 6.18387 2.55982 16.5994 2.3921 24.9795C2.30769 29.1992 3.78692 34.7885 6.45755 39.4982C7.06028 40.5601 7.62406 41.4062 8.03201 41.9836L42.5262 82.1412Z"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M17.499 4.06641L23.1746 14.905L31.799 4.98482L42.5453 17.4077L54.1087 4.06641L63.3087 14.905L66.0626 20.4694L71.5716 26.9382L83.2388 30.7511"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M3.07812 30.8009L14.2075 26.9406L5.23908 14.9062H23.1749L14.2075 26.9406L9.55667 43.7591L24.9896 48.1353"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M19.0273 20.4691L43.3551 19.0898L66.062 20.4691L50.3239 52.9686L50.1929 64.7407L42.5252 82.1387L36.8138 65.0029L36.552 52.838L19.0273 20.4691Z"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M24.991 48.1439L36.5555 52.8493L50.1953 64.7531L50.3263 52.9799L36.8173 65.0142L24.6513 60.5668L25.4066 32.9669L14.209 26.9492"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M36.8164 65.0117L31.7998 69.6599"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M50.3243 52.9799L74.3902 42.6993L71.5714 26.9492L60.0664 32.8622L61.3412 58.8228L50.1934 64.752L53.4981 68.5411"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M71.5735 26.9448L82.4129 15.5299L63.3105 14.9115L68.878 3.48047"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M63.3089 14.9062L42.5466 21.8391L23.1748 14.9062"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    //   <path
    //     d="M42.6622 14.7812L42.5449 21.8447"
    //     strokeWidth="1.26471"
    //     strokeLinejoin="round"
    //   />
    // </svg>
  );
};

export const CushionShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="86"
      height="86"
      viewBox="0 0 86 86"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M79.3347 79.5118C76.8698 81.3251 73.8145 82.4027 70.5157 82.4027H17.545C9.42709 82.4027 2.78516 75.8791 2.78516 67.9058V16.9032C2.78516 8.92987 9.42709 2.40625 17.545 2.40625H70.5157C78.6349 2.40625 85.2756 8.92987 85.2756 16.9032V67.9058C85.2756 72.639 82.9349 76.8625 79.3347 79.5118Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6558 20.043L2.78516 42.4021L13.8907 64.4966L19.93 42.2692L11.6558 20.043Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M85.2745 42.8273L75.8331 20.043L68.4531 42.2692L74.9389 64.6283L85.2745 42.8273Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M61.7451 22.6813L66.9 2.65625"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M39.3242 2.40625L21.9863 11.0488"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M48.3965 2.40625L64.7947 10.0727"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M5.32661 9.32812L11.6561 20.0414L2.39062 17.9985"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M85.3428 17.3086L75.835 20.0485L81.9099 8.40625"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M11.6543 20.0465L24.8484 22.4627L20.1855 2.65625"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M75.8334 20.043L61.7451 22.679"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M78.4093 5.03906L24.8482 22.462L19.9282 42.272L26.414 59.8L24.8482 73.4174L9.5127 80.0486"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M8.02273 78.9558L13.891 64.5L3.20117 68.181"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M13.8926 64.5053L26.4163 59.8047L66.0269 73.2035L47.1773 82.4078"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M7.90039 5.96484L61.7444 22.6858L68.4527 42.2772L63.9817 59.804L66.0235 73.2016L78.5509 79.9547"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M40.086 82.4078L24.8477 73.4233L63.9822 59.8047L74.9389 64.637"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M24.847 73.4219L23.2812 82.4063"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M66.0234 73.1914L67.1913 82.3486"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M78.4949 80.0413L74.9365 64.625L85.2524 68.6286"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const AsscherShape = ({ className = "h-[50px]", isActive = false }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="86"
      height="82"
      viewBox="0 0 86 82"
      fill="none"
      className={clsx(
        className,
        "stroke-current text-[var(--grey-2)]",
        isActive ? "text-[var(--teal-1)]" : "text-[var(--grey-2)]",
        "hover:text-[var(--teal-1)] cursor-pointer"
      )}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.9609 1.78516L2.39062 19.0643V61.8194L19.9609 79.9768H63.7416L82.4837 62.6988V19.5028L64.6199 1.78516H19.9609Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.9267 21.7383L22.3047 30.5645V52.4053L30.9267 61.6809H52.4088L61.6059 52.8547V30.788L52.84 21.7383H30.9267Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M19.958 1.78516L30.9225 21.7317"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M2.3877 19.0664L22.3004 30.5601"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M2.3877 61.8202L22.3004 52.3984"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M30.9215 61.6797L19.957 79.9821"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M61.6016 30.7864L82.4808 19.5078"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.4402 11.7617H58.7263L72.0418 24.8138V57.7762L58.7263 71.8853H24.5063L11.6113 57.7762V24.3378L25.4402 11.7617Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.3413 17.0352H55.4167L66.6941 28.0335V55.0135L55.0084 65.8777H28.6711L17.3369 54.7489V27.9972L28.3413 17.0352Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M52.4043 61.6797L63.7385 79.9821"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M82.4808 62.6983L61.6016 52.8477"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M52.8379 21.7317L64.6191 1.78516"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
    </svg>
  );
};
