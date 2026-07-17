"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle2, XCircle } from "lucide-react"
import { horariosService, HorarioDelivery } from "@/lib/horarios-service"
import { NEGOCIO_ID } from "@/lib/config"
import { useHorarios } from "@/hooks/use-horarios"

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO']

const DAY_NAMES: Record<string, string> = {
  LUNES: 'Lunes',
  MARTES: 'Martes',
  MIERCOLES: 'Miércoles',
  JUEVES: 'Jueves',
  VIERNES: 'Viernes',
  SABADO: 'Sábado',
  DOMINGO: 'Domingo'
}

function formatHour(hour: string) {
  return hour.slice(0, 5)
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Record<string, HorarioDelivery[]>>({})
  const [loading, setLoading] = useState(true)
  const { isAbierto } = useHorarios(NEGOCIO_ID)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await horariosService.getHorarios(NEGOCIO_ID)
        const grouped: Record<string, HorarioDelivery[]> = {}
        DIAS.forEach(dia => {
          grouped[dia] = data.filter(h => h.diaSemana === dia)
        })
        setHorarios(grouped)
      } catch (error) {
        console.error("Error loading horarios", error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="pb-32 lg:pb-8 max-w-xl lg:max-w-2xl mx-auto w-full selection:bg-primary/20 animate-in fade-in duration-300">
      <header className="sticky top-0 z-20 glass border-x-0 border-t-0 lg:hidden">
        <div className="px-6 h-16 flex items-center gap-3">
          <h1 className="text-lg font-bold tracking-tight">Horarios</h1>
        </div>
      </header>

      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="h-14 w-14 rounded-[1.5rem] bg-primary/10 flex items-center justify-center">
            <Clock className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground/90">Horarios de Atención</h2>
            <div className="flex items-center gap-2 mt-1">
              {isAbierto ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium text-green-600">Abierto ahora</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm font-medium text-red-500">Cerrado ahora</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-2">
        {loading ? (
          <div className="text-center py-16">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground font-medium">Cargando horarios...</p>
          </div>
        ) : (
          DIAS.map(dia => {
            const dayHorarios = horarios[dia] || []
            const isOpen = dayHorarios.length > 0
            return (
              <div
                key={dia}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl border transition-all ${
                  isOpen
                    ? 'bg-card border-border/50'
                    : 'bg-muted/20 border-border/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground/40 flex-shrink-0" />
                  )}
                  <span className={`font-semibold text-sm ${isOpen ? 'text-foreground/90' : 'text-muted-foreground'}`}>
                    {DAY_NAMES[dia]}
                  </span>
                </div>
                <div className="text-right">
                  {isOpen ? (
                    dayHorarios.map((v, i) => (
                      <div key={i} className="text-sm font-medium text-foreground/80">
                        {formatHour(v.horaApertura)} - {formatHour(v.horaCierre)}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cerrado</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
