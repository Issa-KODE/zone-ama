"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useActionState, useState } from "react";
import { addProduct, updateProduct } from "../_actions/products";
import { Product } from "@prisma/client";
import Image from "next/image";
import { formatCurrency } from "@/lib/formatters";

export default function ProductForm({ product }: { product?: Product | null }) {
  const [error, action, isPending] = useActionState(product == null ? addProduct : updateProduct.bind(null, product.id), {})
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );
  const [quantity, setQuantity] = useState<number | undefined>(product?.quantity)

  return (
    <form action={action} className="space-y-8 mt-10">
      <div className="space-y-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={product?.name || ""}
        />
        {error.name && <div className="text-destructive">{error.name}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="priceInCents">Prix</Label>
        <Input
          onChange={(e) => setPriceInCents(Number(e.target.value))}
          value={priceInCents || ""}
          id="priceInCents"
          name="priceInCents"
          type="number"
          required
        />
        <div className="text-muted-foreground">
          {formatCurrency((priceInCents || 0) / 100)}
        </div>
        {error.priceInCents && (
          <div className="text-destructive">{error.priceInCents}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantité</Label>
        <Input
          onChange={e => setQuantity(Number(e.target.value))}
          value={quantity || ""}
          id="quantity"
          name="quantity"
          type="number"
          required
        />
        {error.quantity && <div className="text-destructive">{error.quantity}</div>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={product?.description || ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image</Label>
        <Input id="image" name="image" type="file" required={product == null} />
      </div>
      {product != null && (
        <Image
          src={`/products/${product.imagePath.replace("public/products/", "")}`}
          alt={product.name}
          width={400}
          height={400}
        />
      )}
      {error.image && <div className="text-destructive">{error.image}</div>}

      <Button>
        {isPending ? "En cours" : "Enregistrer"}
      </Button>
    </form>
  );
}