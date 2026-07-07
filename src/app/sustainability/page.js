import ContentPage from "@/commomPages/StoryPages/ContentPage";
import { SUSTAINABILITY } from "@/commomPages/StoryPages/content";

export const metadata = {
  title: "Sustainability",
  description:
    "Our commitment to lab-grown diamonds, responsible sourcing, and jewelry that honors the earth it comes from.",
};

const page = () => <ContentPage slug="sustainability" {...SUSTAINABILITY} />;

export default page;
