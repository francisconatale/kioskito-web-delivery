"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, MapPin, X, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Address, addressService } from "@/lib/address-service"

interface AddressesTabProps {
    onBack: () => void
}

export function AddressesTab({ onBack }: AddressesTabProps) {
    const { user } = useAuth()
    const { toast } = useToast()
    const [addresses, setAddresses] = useState<Address[]>([])
    const [loading, setLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newAddress, setNewAddress] = useState("")
    const [removingId, setRemovingId] = useState<number | null>(null)

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const data = await addressService.getAddresses()
                setAddresses(data)
            } catch (error) {
                console.error("Error fetching addresses:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchAddresses()
    }, [])

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newAddress.trim()) return

        setIsAdding(true)
        try {
            const added = await addressService.addAddress(newAddress.trim())
            setAddresses(prev => [...prev, added])
            setNewAddress("")
            toast({ title: "Dirección agregada", description: "Tu nueva dirección se guardó correctamente." })
        } catch (error: any) {
            toast({
                title: "Error al agregar dirección",
                description: error.response?.data?.message || "La dirección ya existe o hubo un problema.",
                variant: "destructive"
            })
        } finally {
            setIsAdding(false)
        }
    }

    const handleRemoveAddress = async (id: number) => {        
        setRemovingId(id)
        try {
            await addressService.removeAddress(id)
            setAddresses(prev => prev.filter(a => a.id !== id))
            toast({ title: "Dirección eliminada", description: "La dirección fue eliminada de tu cuenta." })
        } catch (error) {
            console.error("Error removing address:", error)
            toast({
                title: "Error al eliminar",
                description: "Hubo un problema al intentar eliminar la dirección.",
                variant: "destructive"
            })
        } finally {
            setRemovingId(null)
        }
    }

    return (
        <div className="pb-32 max-w-xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <header className="sticky top-0 z-20 glass border-x-0 border-t-0">
                <div className="px-6 h-16 flex items-center gap-4">
                    <button 
                        onClick={onBack}
                        className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center hover:bg-muted/50 transition-colors -ml-2"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-lg font-bold tracking-tight">Mis Direcciones</h1>
                </div>
            </header>

            <div className="px-6 py-6">
                    <div className="space-y-6">
                        {/* List */}
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : addresses.length === 0 ? (
                            <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border/50">
                                <MapPin className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                                <h3 className="font-medium text-foreground/80 mb-1">Aún no hay direcciones</h3>
                                <p className="text-sm text-muted-foreground px-4">Agregá tu primera dirección de entrega debajo.</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {addresses.map(address => (
                                    <li key={address.id} className="flex items-center justify-between p-4 rounded-2xl border border-border/50 bg-card shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-primary" />
                                            </div>
                                            <span className="font-medium truncate">{address.direccion}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 ml-2"
                                            onClick={() => handleRemoveAddress(address.id)}
                                            disabled={removingId === address.id}
                                        >
                                            {removingId === address.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Add Form */}
                        <form onSubmit={handleAddAddress} className="mt-8 pt-8 border-t border-border/50">
                            <h3 className="font-semibold mb-4 text-foreground/90 flex items-center gap-2">
                                <Plus className="h-4 w-4 text-primary" />
                                Nueva Dirección
                            </h3>
                            <div className="flex gap-2">
                                <Input
                                    value={newAddress}
                                    onChange={(e) => setNewAddress(e.target.value)}
                                    placeholder="Ej: Av. Rivadavia 1234, Depto 5B"
                                    className="h-12 rounded-xl"
                                    disabled={isAdding}
                                />
                                <Button 
                                    type="submit" 
                                    className="h-12 w-12 shrink-0 rounded-xl"
                                    disabled={isAdding || !newAddress.trim()}
                                >
                                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}
                                </Button>
                            </div>
                        </form>
                    </div>
            </div>
        </div>
    )
}
