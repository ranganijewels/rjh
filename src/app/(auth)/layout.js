import FeaturesList from "@/components/common/FeaturesList/FeaturesList";
import { WHY_CHOOSE_ICON } from "@/constants/constant";

export default function AuthLayout({ children }) {
  return (
    <div className="xl:space-y-[80px] space-y-[40px]">
      <div className="w-full flex flex-col md:flex-row">
        <div className="md:w-[50%] w-full">
          <img
            src="/images/login-banner.jpg"
            alt="Login Banner"
            className="xl:h-[787px] md:h-[547px] h-[265px] w-full object-cover"
          />
        </div>
        {children}
      </div>
      <div>
        <hr className="hr-teal-3" />
        <FeaturesList
          items={WHY_CHOOSE_ICON}
          isGrid
          desktopCols={4}
          mobileCols={2}
          containerClass="xl:py-[80px] py-[40px]"
        />
        <hr className="hr-teal-3" />
      </div>
    </div>
  );
}
