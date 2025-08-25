import Image from "next/image";
import Header from "@/app/_components/Header";
import HeroSection from "@/app/_components/HeroSection";
import NewArrival from "@/app/_components/NewArrival";
import TopSelling from "@/app/_components/TopSelling";
import BrowseStyle from "@/app/_components/BrowseStyle";
import CommentSlider from "@/app/_components/CommentsSlider";
import Footer from "@/app/_components/Footer";

export default function Home() {
  return (
    <div className="items-center">
      <Header />
      <HeroSection />
      <NewArrival />
      <TopSelling />
      <BrowseStyle />
      <CommentSlider />
      <Footer />
    </div>
  );
}
