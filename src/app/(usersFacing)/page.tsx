import Link from "next/link";
import { sessionInfo } from "./_methods/sessionInfo";

export default async function UserPage() {
  const session = await sessionInfo();

  return (
    <>
      <h1>Hi</h1>
      {session.role === "admin" && (
        <Link
          href="/admin"
          className="underline text-3xl mt-5 font-bold inline-block"
        >
          Admin page
        </Link>
      )}
    </>
  );
}
