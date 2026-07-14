"use client"
import { NEGOCIO_ID } from '@/lib/config';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Save, Trash2 } from 'lucide-react';
import { horariosService, HorarioDelivery } from '@/lib/horarios-service';
import { Switch } from '@/components/ui/switch';
import { TimePicker } from '@/components/ui/time-picker';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];


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
        { negocioId: NEGOCIO_ID, diaSemana: dia, horaApertura: '09:00:00', horaCierre: '18:00:00', activo: true }
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
      const formattedValue = value.length === 5 ? `${value}:00` : value;
      newDia[index] = { ...newDia[index], [field]: formattedValue };
      return { ...prev, [dia]: newDia };
    });
  };

  const toggleDay = (dia: string, isOpen: boolean) => {
    if (isOpen) {
      handleAddWindow(dia);
    } else {
      setHorarios(prev => ({ ...prev, [dia]: [] }));
    }
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
        <div className="flex items-center gap-4 max-w-3xl mx-auto">
          <Link href="/dashboard" className="p-2 -ml-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">Horarios de Atención</h1>
          <div className="flex-1" />
          <button 
            onClick={handleSave} 
            disabled={saving || loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-3xl mx-auto space-y-4">
        {loading ? (
          <div className="text-center py-12 text-neutral-500">Cargando horarios...</div>
        ) : (
          DIAS.map(dia => {
            const dayHorarios = horarios[dia] || [];
            const isOpen = dayHorarios.length > 0;
            return (
              <div key={dia} className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden group">
                <div className="px-5 py-4 flex items-center justify-between bg-white border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={isOpen} 
                      onCheckedChange={(checked) => toggleDay(dia, checked)} 
                    />
                    <span className={`font-semibold capitalize ${isOpen ? 'text-neutral-900' : 'text-neutral-400'}`}>
                      {dia.toLowerCase()}
                    </span>
                  </div>
                  {!isOpen && <span className="text-sm text-neutral-400 italic">Cerrado</span>}
                </div>
                
                {isOpen && (
                  <div className="bg-neutral-50/50 px-5 py-4 space-y-3">
                    {dayHorarios.map((ventana, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="flex items-center bg-white border border-neutral-200 rounded-lg shadow-sm flex-1 max-w-sm">
                          <TimePicker 
                            value={ventana.horaApertura} 
                            onChange={(v) => handleChangeTime(dia, i, 'horaApertura', v)}
                            className="flex-1"
                          />
                          <div className="h-6 w-px bg-neutral-200"></div>
                          <TimePicker 
                            value={ventana.horaCierre} 
                            onChange={(v) => handleChangeTime(dia, i, 'horaCierre', v)}
                            className="flex-1"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveWindow(dia, i)}
                          className="text-neutral-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 rounded-full"
                          title="Eliminar horario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => handleAddWindow(dia)}
                      className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 mt-2 px-1 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Agregar intervalo
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
