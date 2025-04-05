"use server"

import { db } from "@/lib/prisma"
import { z } from "zod"
import fs from "fs/promises"
import { notFound, redirect } from "next/navigation"

const imageSchema = z.instanceof(File, {message: "Required"})

const addSchema = z.object({
  name: z.string().min(1),
  priceInCents: z.coerce.number().min(1),
  quantity: z.coerce.number().min(1),
  description: z.string().min(1),
  image: imageSchema.refine(file => file.size > 0 && file.type.startsWith("image/"), {message: "required"})
})

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData))

  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  await fs.mkdir("public/products", {recursive: true})

  const imagePath = `public/products/${crypto.randomUUID()}-${data.image.name}`
  await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()))

  await db.product.create({data: {
    name: data.name,
    priceInCents: data.priceInCents,
    quantity: data.quantity,
    description: data.description,
    imagePath
  }})

  redirect("/admin/products")
}

const editSchema = addSchema.extend({
  image: imageSchema.optional()
})

export async function updateProduct(id: string, prevState: unknown, formData: FormData) {
  const result = editSchema.safeParse(Object.fromEntries(formData))

  if(result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data

  const product = await db.product.findUnique({where: {id}})

  if (product == null) return notFound()


  let imagePath = product.imagePath
  if(data.image != null && data.image.size > 0) {
    await fs.unlink(imagePath)

    imagePath = `public/products/${crypto.randomUUID()}-${data.image.name}`
    await fs.writeFile(imagePath, Buffer.from(await data.image.arrayBuffer()))
  }

  await db.product.update({where: {id}, data: {
    name: data.name,
    priceInCents: data.priceInCents,
    quantity: data.quantity,
    description: data.description,
    imagePath
  }})

  redirect("/admin/products")
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({where: {id}})

  if (product == null) return notFound()

  await fs.unlink(product.imagePath)
}