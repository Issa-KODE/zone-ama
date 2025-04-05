import { db } from "@/lib/prisma";
// import Image from "next/image";
import Link from "next/link";
import { Product } from "@prisma/client";
import { formatCurrency } from "@/lib/formatters";

export default async function ListProducts() {
  const products = await db.product.findMany();

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-20 justify-items-center">
      {products.map((product) => (
        <ProductCard key={product.id} product={product}/>
      ))}
    </ul>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
      <li key={product.id} className="w-[300px] shadow border border-gray-200 px-3 py-2 rounded">
        <Link href={`/products/${product.id}`}>
          <div className="relative aspect-video w-full h-[100px] bg-blue-600 rounded">
            {/* <Image
              className="object-contain"
              fill
              src={`/products/${product.imagePath.replace(
                "public/products/",
                ""
              )}`}
              alt={product.name}
            /> */}
          </div>
          <h2 className="mt-2 font-bold">{product.name}</h2>
          <p className="text-sm">{product.description}</p>
          <p className="mt-3">{formatCurrency(product.priceInCents / 100)}</p>
        </Link>
      </li>
  );
}