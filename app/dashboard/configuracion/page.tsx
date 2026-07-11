"use client"
import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <div className="w-full bg-neutral-50 min-h-screen font-sans text-sm">
      <header className="bg-white px-4 md:px-8 py-4 border-b border-neutral-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <Link href="/dashboard" className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">Configuración</h1>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center text-neutral-500">
          En construcción: Preferencias generales del Kiosco.
        </div>
      </main>
    </div>
  );
}
