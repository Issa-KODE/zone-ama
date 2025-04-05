import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { db } from "@/lib/prisma";
import Image from "next/image";
// import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async  function PageStripeSuccess({searchParams}: {searchParams: Promise<{payment_intent: string}>}) {
  const {payment_intent} = await searchParams

  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

  if(paymentIntent.metadata.productId == null) return notFound()

  const product = await db.product.findUnique({where: {id: paymentIntent.metadata.productId}})

  if(product == null) return notFound()

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 mt-10">
      <h1 className="text-4xl font-bold">{isSuccess ? "Success" : "Failed"}</h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            src={`/products/${product.imagePath.replace(
              "public/products/",
              ""
            )}`}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <div className="text-lg">
            {formatCurrency(product.priceInCents / 100)}
          </div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>
        </div>
      </div>
      <Button asChild>
        {/* <Link href={`/${user.id}/orders/${order.id}`}></Link> */}
      </Button>
    </div>
  )
}