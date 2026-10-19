import ContentPage from "@/commomPages/StoryPages/ContentPage";
import { CUSTOMER_LOVE } from "@/commomPages/StoryPages/content";

export const metadata = {
  title: "Customer Love",
  description:
    "Reviews and real moments from the people who have chosen Rangani jewellery.",
};

const page = () => <ContentPage slug="customer-love" {...CUSTOMER_LOVE} />;

export default page;
