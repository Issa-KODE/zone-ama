import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { sessionInfo } from "./(usersFacing)/_methods/sessionInfo";
import { Nav, NavLink } from "@/components/Nav";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Logout from "@/components/Logout";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-commerce ZoneAma",
  description: "Petit e-commerce.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await sessionInfo()

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased my-10 mx-20",
          inter.variable
        )}
      >
        <>
          <Nav>
            <h1 className="flex items-center">
              <Link
                href="/"
                className="text-4xl font-bold mr-2 text-orange-500"
              >
                ZoneAma
              </Link>
              <ShoppingCart size="26" />
            </h1>

            <div>
              {session.success ? (
                <>
                  <NavLink href="/">Accueil</NavLink>
                  <NavLink href="/products">Magasin</NavLink>
                  {session.role === "user" && (
                    <NavLink href={`/${session?.userId}/orders`}>
                      Mes commandes
                    </NavLink>
                  )}
                  <NavLink href={`/${session?.userId}/profil`}>
                    Mon profil
                  </NavLink>
                  {session.role === "admin" && (
                    <NavLink href="/admin">Admin</NavLink>
                  )}
                  <Logout />
                </>
              ) : (
                <>
                  <NavLink href="/">Accueil</NavLink>
                  <NavLink href="/products">Magasin</NavLink>
                  <NavLink href="/signin">Se connecter</NavLink>
                  <NavLink href="/signup">S&apos;inscrire</NavLink>
                </>
              )}
            </div>
          </Nav>
        </>
        {children}
      </body>
    </html>
  );
}
