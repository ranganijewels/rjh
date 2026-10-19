import PolicyPage, { policyMetadata } from "@/components/common/PolicyPage";

export const generateMetadata = () => policyMetadata("lifetime-warranty");

export default function Page() {
  return <PolicyPage slug="lifetime-warranty" />;
}
