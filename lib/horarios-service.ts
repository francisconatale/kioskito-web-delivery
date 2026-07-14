import { apiClient } from './api-client';

export interface HorarioDelivery {
  id?: number;
  negocioId: number;
  diaSemana: string;
  horaApertura: string;
  horaCierre: string;
  activo: boolean;
}

export const horariosService = {
  getHorarios: async (negocioId: number): Promise<HorarioDelivery[]> => {
    const response = await apiClient.get(`/delivery/horarios?negocioId=${negocioId}`);
    return response.data;
  },

  guardarHorarios: async (negocioId: number, horarios: HorarioDelivery[]): Promise<void> => {
    await apiClient.put(`/delivery/horarios/${negocioId}`, horarios);
  },

  checkAbierto: async (negocioId: number): Promise<{ abierto: boolean }> => {
    const response = await apiClient.get(`/delivery/horarios/abierto?negocioId=${negocioId}`);
    return response.data;
  }
};
