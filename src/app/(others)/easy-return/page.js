import PolicyPage, { policyMetadata } from "@/components/common/PolicyPage";

export const generateMetadata = () => policyMetadata("returns-policy");

export default function Page() {
  return <PolicyPage slug="returns-policy" />;
}
