"use client"
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, isResolvingAuth } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isResolvingAuth) {
            if (!user) {
                // Si no está logueado, lo mandamos al inicio (o al auth screen)
                router.replace('/');
            } else if (user.rol !== 'ADMIN' && user.rol !== 'GERENTE') {
                // Si está logueado pero no tiene permisos, lo mandamos al inicio
                router.replace('/');
            }
        }
    }, [user, isResolvingAuth, router]);

    // Mostrar un estado de carga mientras se valida la sesión o si se está redirigiendo
    if (isResolvingAuth || !user || (user.rol !== 'ADMIN' && user.rol !== 'GERENTE')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 font-sans">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-neutral-500 font-medium">Verificando permisos...</p>
                </div>
            </div>
        );
    }

    // Si tiene permisos, renderizamos el contenido del dashboard (page.tsx de la ruta actual)
    return <>{children}</>;
}
