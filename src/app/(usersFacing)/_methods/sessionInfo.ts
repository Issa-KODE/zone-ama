import { db } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function sessionInfo() {
  const cookieStore = await cookies();
  const session = cookieStore.get("sessionId")?.value;

  if (!session) {
    return { success: false, message: "Cookie de session inexistant." };
  }

  const existSession = await db.session.findUnique({ where: { id: session } });

  if (!existSession || existSession.expiresAt < new Date()) {
    return { success: false, message: "Session inexistante ou expirée." };
  }

  const user = await db.user.findUnique({ where: { id: existSession.userId } });

  if (!user) {
    return { success: false, message: "Utilisateur non trouvé." };
  }

  return {
    success: true,
    userId: user.id,
    role: user.role,
    message: "Session récupérée.",
  };
}
