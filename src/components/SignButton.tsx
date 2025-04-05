import Link from "next/link";
import { Button } from "./ui/button";

export default function SignButton({children}: {children: React.ReactNode}) {
  return <Button asChild>
    <Link href="/signin">{children}</Link>
  </Button>
  
}