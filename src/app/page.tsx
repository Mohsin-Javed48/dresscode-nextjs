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

interface Cloth {
  id: number;
  created_at: string; // timestampz comes as string in JS
  title: string;
  rating: number;
  reviews: string;
  price: number;
  category: string;
  style: string;
  discount: number;
  image: string;
  size: string;
  season: string;
  stockAvailable: number;
  description: string;
  gender: string;
}

export async function getProducts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  console.log(baseUrl);

  const res = await fetch(`${baseUrl}/api/products`, {
    cache: "no-store", // optional, prevents caching in SSR
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  return data;
}

export default async function Home() {
  const products = await getProducts();
  console.log(products);
  console.log(products);
  return (
    <div className="text-center relative">
      {/* <HeroSection />
      <NewArrival />
      <TopSelling />
      <BrowseStyle />
      <CommentSlider /> */}
      {/* <ul>
        {products.map((p: any) => (
          <li key={p._id}>
            <h2>{p.title}</h2>
            <p>Price: ${p.price}</p>
            <p>Reviews: {p.reviews.length}</p>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
