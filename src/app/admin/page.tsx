import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { sessionInfo } from "../(usersFacing)/_methods/sessionInfo";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getOrdersData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numbersOfSales: data._count,
  };
}

async function getUsersData() {
  const [usersCount, ordersData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    usersCount,
    averageValuePerUser:
      usersCount === 0
        ? 0
        : (ordersData._sum.pricePaidInCents || 0) / usersCount / 100,
  };
}

async function getProductsData() {
  const numbersOfProducts = await db.product.count();

  return {
    numbersOfProducts,
  };
}

export default async function AdminPage() {
  const session = await sessionInfo();

  if (!session.success || session.role !== "admin") {
    redirect("/access-denied");
  }

  const [salesData, usersData, productData] = await Promise.all([
    getOrdersData(),
    getUsersData(),
    getProductsData(),
  ]);

  return (
    <>
      <div className="flex justify-between items-center">
        <PageHeader>Tableau de bord</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Ajouter un produit</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        <DashboardCard
          title="Ventes"
          subtitle={`${formatNumber(salesData.numbersOfSales)} Ventes`}
          body={formatCurrency(salesData.amount)}
        />
        <DashboardCard
          title="Utilisateurs"
          subtitle={`${formatNumber(usersData.usersCount)} Utilisateurs`}
          body={`Moyenne par utilisateur : ${formatCurrency(
            usersData.averageValuePerUser
          )}`}
        />
        <DashboardCard
          title="Produits"
          subtitle={`${productData.numbersOfProducts} Produits en magasin`}
        />
      </div>
    </>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body?: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
