"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

const registerUserSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string().min(8, "Le mot de passe de confirmation doit contenir au moins 8 caractères"),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
}).refine(
  data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
})


export async function registerUser(prevState: unknown, formData: FormData) {
  const result = registerUserSchema.safeParse(Object.fromEntries(formData));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data;

  const existingUser = await db.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    return { email: ["Cet email est déjà utilisé"] }
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      address: data.address,
      city: data.city,
    },
  });

  redirect("/signin");
}

const updateUserSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string().optional(),
  address: z.string().min(1, "L'adresse est requise"),
  city: z.string().min(1, "La ville est requise"),
})


export async function updateUser(id: string, prevState: unknown, formData: FormData) {
  const result = updateUserSchema.safeParse(Object.fromEntries(formData));

  if (result.success === false) {
    return result.error.formErrors.fieldErrors
  }

  const data = result.data;

  // Vérifie les infos ici.

  const hashedPassword = await bcrypt.hash(data.password, 10);

  await db.user.update({
    where: { id },
    data: {
      email: data.email,
      password: hashedPassword,
      address: data.address,
      city: data.city,
    },
  })

  redirect("/") // À revoir

}

export async function loginUser(prevState: unknown, formData: FormData): Promise<{
  message: string;
  success: boolean;
} | undefined>  {
  const {email, password} = Object.fromEntries(formData)

  if((!email && typeof email !== "string") || (!password && typeof password !== "string")) {
    return {message: "Aucune information renseignée", success: false}
  } 

  const user = await db.user.findUnique({
    where: {email: email as string}
  })

  if(!user) {
    return {message: "Invalid credentials.", success: false}
  }

  const isPasswordValid = await bcrypt.compare(password as string, user.password)

  if(!isPasswordValid) {
    return {message: "Invalid credentials.", success: false}
  }

  const existingSession = await db.session.findFirst({where: {userId: user.id}})

  if(existingSession) {
    await db.session.delete({where: {id: existingSession.id}})
  }

  const newSession = await db.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  const cookieStore = await cookies()
  cookieStore.set("sessionId", newSession.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60
  })

  redirect("/")
  
}

export async function logoutUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  try { 
    await db.session.delete({where: {id: sessionId}})
    cookieStore.delete("sessionId")

  } 
  catch (error) {
    console.error(error)
    return {success: false, message: "Echec lors de la déconnexion. Veuillez réessayer.", error}
  }
  
  redirect("/signin")

}