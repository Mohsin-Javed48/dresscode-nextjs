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
import { supabase } from "@/app/_lib/supabase";
import { getCloths } from "@/app/_lib/data-service";

interface Cloth {
  id: number;
  created_at: string; // timestampz comes as string in JS
  title: string;
  rating: number;
  reviews: string;
  price: number;
  catogery: string;
  style: string;
  discount: number;
  image: string;
  size: string;
  season: string;
  stockAvailable: number;
  description: string;
  gender: string;
}

export default async function Home() {
  const cloths: Cloth[] = await getCloths();
  console.log(cloths);

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
