import { db } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Product } from "./_components/Product";
import Advices from "./_components/Advices";

export default async function ProductPage({ params }: {params: Promise<{id: string}> }) {
  const {id} = await params

  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) return notFound()

  return <main className="mt-15">
    <Product product={product} />
    <Advices />
  </main>;
}