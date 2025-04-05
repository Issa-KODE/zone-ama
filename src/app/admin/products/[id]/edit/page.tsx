import { db } from "@/lib/prisma";
import PageHeader from "../../../../../components/PageHeader";
import ProductForm from "../../_components/ProductForm";

export default async function EditProductPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params

  const product = await db.product.findUnique({ where: {id} })

  return (
    <>
      <PageHeader>Editer un produit</PageHeader>
      <ProductForm product={product}/>
    </>
  )
}