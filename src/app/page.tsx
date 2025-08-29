import Image from "next/image";
import HeroSection from "@/app/_components/HeroSection";
import NewArrival from "@/app/_components/NewArrival";
import TopSelling from "@/app/_components/TopSelling";
import BrowseStyle from "@/app/_components/BrowseStyle";
import CommentSlider from "@/app/_components/CommentsSlider";
import AddToCart from "@/app/_components/AddToCart";
import ProductReviews from "@/app/_components/ProductReviews";
import Recommendation from "@/app/_components/Recommendation";
import Components from "@/app/_components/Components";
import ShoppingCartScreen from "./_components/ShoppingCartScreen";

export default function Home() {
  return (
    <div className="text-center relative">
      <HeroSection />
      <NewArrival />
      <TopSelling />
      <BrowseStyle />
      <CommentSlider />
    </div>
  );
}
