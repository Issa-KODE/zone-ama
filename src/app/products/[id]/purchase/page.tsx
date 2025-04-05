import { db } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Stripe from "stripe"
import CheckoutForm from "./_components/CheckoutForm"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export default async function PurchasePage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params
  const product = await db.product.findUnique({where: {id}})

  if (!product) return notFound()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "eur",
    metadata: {productId: product.id},
  })

  if(paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment intent")
  }

  return <CheckoutForm product={product} clientSecret={paymentIntent.client_secret}/>
}