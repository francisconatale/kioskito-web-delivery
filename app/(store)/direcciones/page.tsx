"use client"

import { AddressesTab } from "@/app/components/addresses-tab"
import { useRouter } from "next/navigation"

export default function DireccionesPage() {
    const router = useRouter()
    return <AddressesTab onBack={() => router.push("/cuenta")} />
}
