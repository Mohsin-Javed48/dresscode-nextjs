import { useRouter } from "next/navigation";
import { RatingStar } from "./RatingStar";
import Image from "next/image";
import { Product, ProductCardProps } from "@/types";

export default function ClothItem({ product }: ProductCardProps) {
  const router = useRouter();
  return (
    <div
      key={product._id}
      className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 "
      onClick={() => router.push(`/shop/${product._id}`)}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2 p-4">
        {/* Style and Gender */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{product.style || "Casual"}</span>
          <span>•</span>
          <span>{product.gender}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 text-left">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <RatingStar value={product.rating} readOnly size={16} />
          <span className="text-sm font-medium text-gray-700">
            {product.rating}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          {product.discount > 0 ? (
            <>
              <span className="font-bold text-lg text-gray-900">
                Rs {(product.price * (1 - product.discount / 100)).toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                Rs {product.price}
              </span>
            </>
          ) : (
            <span className="font-bold text-lg text-gray-900">
              Rs {product.price}
            </span>
          )}
        </div>

        {/* Size and Stock */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Size: {product.size}</span>
          <span
            className={
              product.stockAvailable > 0 ? "text-green-600" : "text-red-600"
            }
          >
            {product.stockAvailable > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>
    </div>
  );
}
