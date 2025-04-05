import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { Product as ProductPrisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export function Product({ product }: { product: ProductPrisma }) {
  return (
    <div className="mt-10 flex gap-x-5 h-[400px]">
      <div className="relative aspect-video w-[30%] border">
        <Image
          className="object-contain"
          src={`/products/${product.imagePath.replace("public/products/", "")}`}
          fill
          alt={product?.name}
        />
      </div>

      <div className="ml-30 w-[70%] h-full">
        <h2 className="font-bold text-2xl">{product.name}</h2>
        <p className="my-3">{formatCurrency(product.priceInCents / 100)}</p>

        <p className="my-10">
          The iPhone 16 redefines innovation with cutting-edge technology, a
          sleek design, and unmatched performance. Featuring a stunning 6.3-inch
          ProMotion OLED display with a higher refresh rate for ultra-smooth
          scrolling and responsiveness, the iPhone 16 delivers an immersive
          experience like never before.
        </p>

        <Button asChild className="w-full bg-orange-600 hover:bg-orange-500">
          <Link href={`/products/${product.id}/purchase`}>Purchase</Link>
        </Button>
      </div>
    </div>
  );
}