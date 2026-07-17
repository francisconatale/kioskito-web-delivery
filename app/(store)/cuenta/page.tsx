"use client"

import { AccountTab } from "@/app/components/account-tab"
import { useRouter } from "next/navigation"

export default function CuentaPage() {
    const router = useRouter()
    return <AccountTab onTabChange={(tab) => router.push(`/${tab}`)} />
}
