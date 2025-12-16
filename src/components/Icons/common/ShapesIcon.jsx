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
      width="86"
      height="84"
      viewBox="0 0 86 84"
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
        d="M42.5262 82.1412C62.3849 57.5017 76.6242 39.877 80.9548 34.659C81.1734 34.3956 81.7859 33.6575 82.3973 32.5653C85.5278 26.9706 84.4727 19.4615 81.8724 14.3838C78.018 6.85623 68.9922 1.24646 59.3139 2.61167C48.2981 4.16574 43.1516 13.8096 42.6571 14.7766C42.2545 13.965 41.6605 12.9128 40.8024 11.7872C36.6428 6.32849 28.3788 2.02674 19.7046 3.52685C19.2837 3.60023 18.866 3.68981 18.4548 3.79341C9.0481 6.18387 2.55982 16.5994 2.3921 24.9795C2.30769 29.1992 3.78692 34.7885 6.45755 39.4982C7.06028 40.5601 7.62406 41.4062 8.03201 41.9836L42.5262 82.1412Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M17.499 4.06641L23.1746 14.905L31.799 4.98482L42.5453 17.4077L54.1087 4.06641L63.3087 14.905L66.0626 20.4694L71.5716 26.9382L83.2388 30.7511"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M3.07812 30.8009L14.2075 26.9406L5.23908 14.9062H23.1749L14.2075 26.9406L9.55667 43.7591L24.9896 48.1353"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.0273 20.4691L43.3551 19.0898L66.062 20.4691L50.3239 52.9686L50.1929 64.7407L42.5252 82.1387L36.8138 65.0029L36.552 52.838L19.0273 20.4691Z"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M24.991 48.1439L36.5555 52.8493L50.1953 64.7531L50.3263 52.9799L36.8173 65.0142L24.6513 60.5668L25.4066 32.9669L14.209 26.9492"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M36.8164 65.0117L31.7998 69.6599"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M50.3243 52.9799L74.3902 42.6993L71.5714 26.9492L60.0664 32.8622L61.3412 58.8228L50.1934 64.752L53.4981 68.5411"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M71.5735 26.9448L82.4129 15.5299L63.3105 14.9115L68.878 3.48047"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M63.3089 14.9062L42.5466 21.8391L23.1748 14.9062"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
      <path
        d="M42.6622 14.7812L42.5449 21.8447"
        strokeWidth="1.26471"
        strokeLinejoin="round"
      />
    </svg>
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
