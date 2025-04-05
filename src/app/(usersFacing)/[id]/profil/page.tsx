import PageHeader from "@/components/PageHeader"
import FormSign from "../../_components/FormCreateOrUpdate"

import { db } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { cookies } from "next/headers";


async function ProfilPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params

  const user = await db.user.findUnique({
    where: {id}
  })
  
  if (!user) return notFound()

  // Vérifier si la session existe
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) return redirect("/signin")

  const userId = await db.session.findUnique({
    where: {id: sessionId},
    select: {userId: true}
  })

  // Vérifier si l'utilisateur connecté est le propriétaire de la session
  if(user.id !== userId?.userId) {
    return redirect("/")
  }

  return (
    <>
      <PageHeader className="text-center">Profil</PageHeader>
      <FormSign user={user}/>
    </>
  )
}

export default ProfilPage