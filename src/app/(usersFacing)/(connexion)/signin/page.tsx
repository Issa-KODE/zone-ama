import PageHeader from "@/components/PageHeader";
import FormSignIn from "../../_components/FormSignIn";
import Link from "next/link";

export default function SignInPage() {
  return (
    <>
      <PageHeader>Connexion</PageHeader>
      <FormSignIn />

      <p className="text-center text-sm underline mt-10 text-orange-600">
        <Link href="/signup">Vous n&apos;avez pas de compte ? Inscrivez-vous</Link>
      </p>
    </>
  );
}
