"use client"
import { NEGOCIO_ID } from '@/lib/config';
;
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Save, Upload, ToggleLeft, ToggleRight } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function NuevaCategoriaPage() {
  const router = useRouter();
  
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!nombre.trim()) {
      alert("El nombre de la categoría es requerido.");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/categorias-delivery', {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        activa: visible,
        negocioId: NEGOCIO_ID
      });
      router.push('/dashboard/categorias');
    } catch (error) {
      alert("Ocurrió un error al crear la categoría.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-neutral-50 min-h-screen font-sans text-sm p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/categorias" className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">Nueva Categoría</h1>
        </header>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-1.5">Nombre de la categoría</label>
            <input 
              type="text" 
              placeholder="Ej. Bebidas" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-1.5">Descripción (Opcional)</label>
            <textarea 
              placeholder="Detalle para la app..." 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 text-sm h-24 focus:ring-2 focus:ring-primary-500 outline-none resize-y" 
            />
          </div>
          
          <div 
            className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors"
            onClick={() => setVisible(!visible)}
          >
            <div>
              <div className="text-sm font-bold text-neutral-900">Visibilidad en la App</div>
              <div className="text-xs text-neutral-500">Mostrar a los clientes inmediatamente.</div>
            </div>
            {visible ? (
              <ToggleRight className="w-8 h-8 text-blue-600" />
            ) : (
              <ToggleLeft className="w-8 h-8 text-neutral-400" />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-neutral-900 mb-1.5">Imagen representativa</label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 flex flex-col items-center justify-center text-neutral-500 hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => alert("La subida de imagen se implementará con tu bucket de almacenamiento.")}>
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">Click para subir imagen</span>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Link 
              href="/dashboard/categorias"
              className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancelar
            </Link>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
