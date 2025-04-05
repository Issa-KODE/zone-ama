"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "../../../lib/actions/userActions";
import { useActionState } from "react";

export default function FormSignIn() {
  const [data, formAction, isPending] = useActionState(loginUser, {message: "", success: true});
  
  return (
    <>
      <form action={formAction} className="space-y-8">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="e-mail"
            required
          />
        </div>
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            name="password"
            placeholder="mot de passe"
            required
          />
        </div>

        <Button disabled={isPending}>
          {isPending ? "Connexion en cours..." : "Se connecter"}
        </Button>
      </form>

      {data?.success === false && (
        <p className="text-destructive mt-5">{data.message}</p>
      )}
    </>
  )
}