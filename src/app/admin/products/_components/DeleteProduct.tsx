"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { deleteProduct } from "../_actions/products";
import { useRouter } from "next/navigation";

export default function DeleteProduct({disabled, id}: {disabled: boolean, id: string}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return <DropdownMenuItem variant="destructive" disabled={disabled || isPending} onClick={() => {
    startTransition(async () => {
      await deleteProduct(id)
      router.refresh()
    })
  }}>
    Supprimer
  </DropdownMenuItem>
}