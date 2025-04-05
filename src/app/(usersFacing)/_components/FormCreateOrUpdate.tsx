"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { registerUser, updateUser } from "../../../lib/actions/userActions";

type User = {
  id: string
  email: string;
  password: string;
  address: string;
  city: string;
};

export default function FormCreateOrUpdate({ user }: { user?: User }) {
  const [error, formAction, isPending] = useActionState(user == null ? registerUser : updateUser.bind(null, user.id), {});

  return (
    <form action={formAction} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" name="email" required={user == null} defaultValue={user?.email || ""} />
        {error.email && (
          <div className="text-destructive text-sm">{error.email}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          name="password"
          required={user == null}
        />
        {error.password && (
          <div className="text-destructive text-sm">{error.password}</div>
        )}
      </div>
      {user == null && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
          />
          {error.confirmPassword && (
            <div className="text-destructive text-sm">
              {error.confirmPassword}
            </div>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input
          id="address"
          type="text"
          name="address"
          required={user == null}
          defaultValue={user?.address || ""}
        />
        {error.address && (
          <div className="text-destructive text-sm">{error.address}</div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">Ville</Label>
        <Input
          id="city"
          type="text"
          name="city"
          required={user == null}
          defaultValue={user?.city || ""}
        />
        {error.city && (
          <div className="text-destructive text-sm">{error.city}</div>
        )}
      </div>

      {user == null ? (
        <Button type="submit">
          {isPending ? "Chargement..." : "S'inscrire"}
        </Button>

      ) : (
        <Button type="submit">
          {isPending ? "Chargement..." : "Modifier"}
        </Button>
      )}
    </form>
  );
}
