"use client"

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/lib/actions/userActions";

export default function Logout() {
  const signout = async () => {
    const response = await logoutUser()
    
    if(!response.success) {
      alert(response.message)
    }
  }

  return (
    <Button onClick={signout} variant="ghost" className="cursor-pointer">
      <LogOut className="absolute right-20 top-14" />
    </Button>
  )
}