import PolicyPage, { policyMetadata } from "@/components/common/PolicyPage";

export const generateMetadata = () => policyMetadata("certification");

export default function Page() {
  return <PolicyPage slug="certification" />;
}
