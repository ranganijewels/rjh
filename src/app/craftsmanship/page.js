import ContentPage from "@/commomPages/StoryPages/ContentPage";
import { CRAFTSMANSHIP } from "@/commomPages/StoryPages/content";

export const metadata = {
  title: "Craftsmanship",
  description:
    "How every Rangani Jewelry House piece is designed, hand-crafted, and finished — from first sketch to final setting.",
};

const page = () => <ContentPage slug="craftsmanship" {...CRAFTSMANSHIP} />;

export default page;
