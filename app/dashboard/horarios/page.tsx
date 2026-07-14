"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, X, Save } from 'lucide-react';
import { horariosService, HorarioDelivery } from '@/lib/horarios-service';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
const NEGOCIO_ID = 1; // MVP default

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Record<string, HorarioDelivery[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadHorarios();
  }, []);

  const loadHorarios = async () => {
    try {
      const data = await horariosService.getHorarios(NEGOCIO_ID);
      const grouped: Record<string, HorarioDelivery[]> = {};
      DIAS.forEach(dia => {
        grouped[dia] = data.filter(h => h.diaSemana === dia) || [];
      });
      setHorarios(grouped);
    } catch (error) {
      console.error("Error loading horarios", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWindow = (dia: string) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: [
        ...(prev[dia] || []),
        { negocioId: NEGOCIO_ID, diaSemana: dia, horaApertura: '09:00', horaCierre: '18:00', activo: true }
      ]
    }));
  };

  const handleRemoveWindow = (dia: string, index: number) => {
    setHorarios(prev => ({
      ...prev,
      [dia]: prev[dia].filter((_, i) => i !== index)
    }));
  };

  const handleChangeTime = (dia: string, index: number, field: 'horaApertura' | 'horaCierre', value: string) => {
    setHorarios(prev => {
      const newDia = [...prev[dia]];
      // Add :00 seconds if the user input only has HH:mm
      const formattedValue = value.length === 5 ? `${value}:00` : value;
      newDia[index] = { ...newDia[index], [field]: formattedValue };
      return { ...prev, [dia]: newDia };
    });
  };

  const formatTimeInput = (timeString: string) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const flatHorarios = Object.values(horarios).flat();
      await horariosService.guardarHorarios(NEGOCIO_ID, flatHorarios);
      alert('Horarios guardados exitosamente');
    } catch (error) {
      console.error("Error saving horarios", error);
      alert('Hubo un error al guardar los horarios');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full bg-neutral-50 min-h-screen font-sans text-sm pb-24">
      <header className="bg-white px-4 md:px-8 py-4 border-b border-neutral-200 sticky top-0 z-10">
        <div className="flex items-center gap-4 max-w-5xl mx-auto">
          <Link href="/dashboard" className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">Horarios de Atención</h1>
          <div className="flex-1" />
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
        {loading ? (
          <div className="text-center py-12 text-neutral-500">Cargando horarios...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="p-6 border-b border-neutral-100">
              <h2 className="text-lg font-semibold text-neutral-900">Configuración Semanal</h2>
              <p className="text-neutral-500 mt-1">Define en qué horarios tu negocio acepta pedidos de delivery.</p>
            </div>
            <div className="divide-y divide-neutral-100">
              {DIAS.map(dia => (
                <div key={dia} className="p-6 flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-32 font-medium text-neutral-700 capitalize pt-2">
                    {dia.toLowerCase()}
                  </div>
                  <div className="flex-1 space-y-3">
                    {horarios[dia]?.length === 0 ? (
                      <div className="text-neutral-400 py-2 italic">Cerrado este día</div>
                    ) : (
                      horarios[dia]?.map((ventana, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <input 
                            type="time" 
                            className="border border-neutral-300 rounded-lg px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={formatTimeInput(ventana.horaApertura)}
                            onChange={(e) => handleChangeTime(dia, i, 'horaApertura', e.target.value)}
                          />
                          <span className="text-neutral-400">a</span>
                          <input 
                            type="time" 
                            className="border border-neutral-300 rounded-lg px-3 py-2 text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={formatTimeInput(ventana.horaCierre)}
                            onChange={(e) => handleChangeTime(dia, i, 'horaCierre', e.target.value)}
                          />
                          <button 
                            onClick={() => handleRemoveWindow(dia, i)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                            title="Eliminar horario"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                    <button 
                      onClick={() => handleAddWindow(dia)}
                      className="flex items-center gap-1 text-emerald-600 font-medium hover:text-emerald-700 text-sm mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar horario
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
