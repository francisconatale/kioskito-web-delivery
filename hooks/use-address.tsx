"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { addressService } from '@/lib/address-service';
import { useAuth } from './use-auth';

interface AddressContextType {
    activeAddress: string | undefined;
    setActiveAddress: (address: string | undefined) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: React.ReactNode }) {
    const [activeAddress, setActiveAddressState] = useState<string | undefined>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('activeAddress') || undefined;
        }
        return undefined;
    });
    
    const { user } = useAuth();

    const setActiveAddress = (address: string | undefined) => {
        setActiveAddressState(address);
        if (typeof window !== 'undefined') {
            if (address) {
                localStorage.setItem('activeAddress', address);
            } else {
                localStorage.removeItem('activeAddress');
            }
        }
    };

    useEffect(() => {
        if (user && activeAddress === undefined) {
            // Fetch once to get main address when user logs in or app starts
            addressService.getAddresses().then(fetched => {
                const main = fetched.find(a => a.esPrincipal);
                if (main) {
                    setActiveAddress(main.direccion);
                } else if (fetched.length > 0) {
                    setActiveAddress(fetched[0].direccion);
                } else if (user.direccion) {
                    setActiveAddress(user.direccion);
                }
            }).catch(console.error);
        }
    }, [user, activeAddress]);

    return (
        <AddressContext.Provider value={{ activeAddress, setActiveAddress }}>
            {children}
        </AddressContext.Provider>
    );
}

export function useAddress() {
    const context = useContext(AddressContext);
    if (context === undefined) {
        throw new Error('useAddress must be used within an AddressProvider');
    }
    return context;
}
