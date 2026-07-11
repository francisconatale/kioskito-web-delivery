"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Edit2, Trash2, Check, X, Sparkles } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get('/categorias-delivery', { params: { negocioId: 1 } });
      setCategorias(Array.isArray(data) ? data : (data?.content || (data as any)?.data || []));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCatName.trim()) return;
    try {
      await apiClient.post('/categorias-delivery', {
        nombre: newCatName.trim(),
        negocioId: 1
      });
      setNewCatName("");
      setIsCreating(false);
      fetchCategorias();
    } catch (error) {
      alert("Error al crear categoría");
    }
  };

  const handleGenerateStandard = async () => {
    const standards = [
      "Bebidas Sin Alcohol",
      "Bebidas Con Alcohol",
      "Snacks y Golosinas",
      "Almacén",
      "Lácteos y Frescos",
      "Cigarrillos y Varios"
    ];
    
    if (!confirm(`Se crearán las siguientes categorías automáticamente:\n- ${standards.join('\n- ')}\n\n¿Estás seguro?`)) return;

    try {
      setIsGenerating(true);
      for (const name of standards) {
        // Chequeamos que no exista
        if (!categorias.some(c => (c.nombre || c.name)?.toLowerCase() === name.toLowerCase())) {
          await apiClient.post('/categorias-delivery', {
            nombre: name,
            negocioId: 1
          });
        }
      }
      fetchCategorias();
    } catch (error) {
      alert("Hubo un error al crear algunas categorías.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta categoría?')) return;
    try {
      await apiClient.delete(`/categorias-delivery/${id}`);
      fetchCategorias();
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  return (
    <div className="w-full bg-neutral-50 min-h-screen font-sans text-sm flex flex-col">
      <header className="bg-white px-4 md:px-8 py-4 border-b border-neutral-200 sticky top-0 z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href="/dashboard" className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg sm:text-xl font-bold text-neutral-900 truncate">Categorías Delivery</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleGenerateStandard}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50 hidden sm:flex"
          >
            <Sparkles className="w-4 h-4" /> Estándar
          </button>
          <Link 
            href="/dashboard/categorias/nueva"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nueva
          </Link>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-5xl w-full mx-auto">

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-neutral-500">Cargando categorías...</div>
          ) : categorias.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">No hay categorías configuradas.</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {categorias.map(cat => (
                <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div>
                    <h3 className="font-bold text-neutral-900">{cat.nombre || cat.name}</h3>
                    {cat.descripcion && <p className="text-neutral-500 text-xs mt-0.5">{cat.descripcion}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleDelete(cat.id)} className="p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
