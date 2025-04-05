import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-semibold mb-4">Ce produit n&apos;est plus disponible</h1>
      <p className="mb-6">Il semble que ce produit ait été supprimé ou n&apos;existe pas.</p>
      <Link href="/" className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}