import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, MapPin } from "lucide-react"

interface AddressModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    loadingAddresses: boolean;
    addresses: any[];
    activeAddress: string | undefined;
    newAddress: string;
    onSelectAddress: (addr: any) => void;
    onAddAddress: () => void;
    onNewAddressChange: (val: string) => void;
}

export function AddressModal({
    isOpen,
    onOpenChange,
    loadingAddresses,
    addresses,
    activeAddress,
    newAddress,
    onSelectAddress,
    onAddAddress,
    onNewAddressChange
}: AddressModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white rounded-3xl p-6">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl">¿Dónde enviamos tu pedido?</DialogTitle>
                </DialogHeader>
                
                <div className="mt-4 flex flex-col gap-4">
                    {loadingAddresses ? (
                        <div className="flex justify-center py-6"><Loader2 className="w-6 h-6 animate-spin text-primary-700" /></div>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
                            {addresses.map(addr => (
                                <div 
                                    key={addr.id}
                                    onClick={() => onSelectAddress(addr)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${activeAddress === addr.direccion ? 'border-primary-700 bg-primary-100' : 'border-neutral-200 hover:border-primary-500'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <MapPin className={`w-5 h-5 ${activeAddress === addr.direccion ? 'text-primary-700' : 'text-neutral-400'}`} />
                                        <div className="flex-1">
                                            <p className="font-medium text-neutral-900 text-sm">{addr.direccion}</p>
                                            {addr.esPrincipal && <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">Principal</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {addresses.length === 0 && (
                                <p className="text-sm text-neutral-500 text-center py-4">No tienes direcciones guardadas.</p>
                            )}
                        </div>
                    )}
                    
                    <div className="mt-2">
                        <label className="text-sm font-medium text-neutral-700 mb-2 block">Agregar nueva dirección</label>
                        <div className="flex gap-2">
                            <Input 
                                value={newAddress}
                                onChange={(e) => onNewAddressChange(e.target.value)}
                                placeholder="Ej: Av. Siempreviva 742"
                                className="flex-1 rounded-xl"
                            />
                            <button 
                                onClick={onAddAddress}
                                disabled={!newAddress.trim()}
                                className="bg-primary-700 text-white px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-primary-900 transition-colors"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
