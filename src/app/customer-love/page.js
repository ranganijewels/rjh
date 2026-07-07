import ContentPage from "@/commomPages/StoryPages/ContentPage";
import { CUSTOMER_LOVE } from "@/commomPages/StoryPages/content";

export const metadata = {
  title: "Customer Love",
  description:
    "Testimonials, reviews, and real moments from the people we've had the privilege of serving since 1990.",
};

const page = () => <ContentPage slug="customer-love" {...CUSTOMER_LOVE} />;

export default page;
