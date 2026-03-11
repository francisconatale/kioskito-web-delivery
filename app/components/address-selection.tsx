"use client"

import { MapPin, Plus, Check } from "lucide-react"
import { Address } from "@/lib/address-service"
import { cn } from "@/lib/utils"

interface AddressSelectionProps {
    addresses: Address[]
    selectedAddress: string
    onSelect: (direccion: string) => void
    onUseNew: () => void
    isUsingNew: boolean
}

export function AddressSelection({ 
    addresses, 
    selectedAddress, 
    onSelect, 
    onUseNew,
    isUsingNew
}: AddressSelectionProps) {
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
                {addresses.map((address) => {
                    const isSelected = !isUsingNew && selectedAddress === address.direccion
                    return (
                        <button
                            key={address.id}
                            type="button"
                            onClick={() => onSelect(address.direccion)}
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group",
                                isSelected 
                                    ? "bg-primary/5 border-primary shadow-md shadow-primary/5" 
                                    : "bg-card border-border/50 hover:border-primary/20 hover:bg-muted/30"
                            )}
                        >
                            <div className={cn(
                                "h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors",
                                isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}>
                                <MapPin className="h-5 w-5" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                                <span className={cn(
                                    "text-sm font-semibold truncate block",
                                    isSelected ? "text-primary" : "text-foreground/80"
                                )}>
                                    {address.direccion}
                                </span>
                            </div>

                            {isSelected && (
                                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-300">
                                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                                </div>
                            )}
                        </button>
                    )
                })}

                <button
                    type="button"
                    onClick={onUseNew}
                    className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 text-left group",
                        isUsingNew 
                            ? "bg-primary/5 border-primary shadow-md shadow-primary/5" 
                            : "bg-card border-border/50 hover:border-primary/20 hover:bg-muted/30"
                    )}
                >
                    <div className={cn(
                        "h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors",
                        isUsingNew ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                        <Plus className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <span className={cn(
                            "text-sm font-semibold truncate block",
                            isUsingNew ? "text-primary" : "text-foreground/80"
                        )}>
                            Usar otra dirección
                        </span>
                    </div>

                    {isUsingNew && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center animate-in zoom-in duration-300">
                            <Check className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    )
}
